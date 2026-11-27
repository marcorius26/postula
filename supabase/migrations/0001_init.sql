-- Postula: esquema inicial
-- Tabla de candidaturas con Row Level Security por usuario.

create type public.application_status as enum (
  'wishlist',
  'applied',
  'interview',
  'offer',
  'rejected'
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  company text not null,
  position text not null,
  location text,
  url text,
  status public.application_status not null default 'applied',
  applied_at date,
  salary text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index applications_user_id_idx on public.applications (user_id);

-- Mantiene updated_at al día en cada modificación.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger applications_set_updated_at
  before update on public.applications
  for each row
  execute function public.set_updated_at();

-- Row Level Security: cada usuario solo ve y modifica sus candidaturas.
alter table public.applications enable row level security;

create policy "applications_select_own"
  on public.applications for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "applications_insert_own"
  on public.applications for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "applications_update_own"
  on public.applications for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "applications_delete_own"
  on public.applications for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Permisos explícitos (el proyecto no concede acceso automático a tablas nuevas).
-- Solo usuarios autenticados; nada para anon. RLS sigue limitando cada fila a su dueño.
grant usage on schema public to authenticated;
grant usage on type public.application_status to authenticated;
grant select, insert, update, delete on table public.applications to authenticated;
