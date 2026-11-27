# Postula

**Postula** es una aplicación web para llevar el seguimiento de tus candidaturas de empleo.
Registra cada oferta (empresa, puesto, ubicación, enlace, salario, fecha y notas), muévela
entre estados — *Me interesa*, *Enviada*, *Entrevista*, *Oferta*, *Descartada* — y consulta
estadísticas de tu búsqueda, como la tasa de respuesta.

## Funcionalidades

- Registro e inicio de sesión con correo y contraseña (Supabase Auth).
- Panel privado con estadísticas: total, recuento por estado y tasa de respuesta
  (`(entrevista + oferta + descartada) / (total − me interesa)`).
- Alta, edición y borrado (con confirmación) de candidaturas.
- Cambio rápido de estado desde cada tarjeta.
- Filtro por estado y búsqueda por empresa o puesto (en la URL, se puede compartir o recargar).
- Interfaz en español, adaptada a móvil.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions, Cache Components) |
| Lenguaje | TypeScript estricto |
| Estilos | Tailwind CSS 4 |
| Base de datos y autenticación | Supabase (Postgres + Auth) con Row Level Security |
| Validación | Zod 4 |
| Tests | Vitest |
| Despliegue | Vercel |

## Estructura

```
src/
  app/
    (auth)/login, signup     # páginas públicas de acceso
    dashboard/               # zona privada (lista, estadísticas, edición en [id]/edit)
    actions/                 # server actions: auth.ts, applications.ts
  components/                # componentes de UI
  lib/
    supabase/                # cliente de servidor, refresco de sesión del proxy y requireUser
    validation.ts            # esquemas Zod
    stats.ts, filters.ts     # lógica pura (testeada)
    status.ts, format.ts     # etiquetas y colores por estado, formato de fechas
    types.ts                 # tipos de dominio y de la base de datos
  proxy.ts                   # refresca la sesión y protege /dashboard
supabase/migrations/         # SQL versionado (tabla, índices, RLS)
tests/                       # tests de Vitest
```

## Arquitectura de agentes

El proyecto se ha desarrollado con un equipo de agentes de IA coordinados:

| Agente | Fichero | Papel |
|---|---|---|
| **Orquestador** | [`CLAUDE.md`](CLAUDE.md) | Divide el trabajo en tareas con criterios de aceptación, las encarga a los subagentes, integra y decide cuándo algo está terminado. |
| **Develop** | [`.claude/agents/develop.md`](.claude/agents/develop.md) | Implementa cada tarea siguiendo su guía de programación. |
| **Testing** | [`.claude/agents/testing.md`](.claude/agents/testing.md) | Revisa el trabajo de Develop contra [`docs/DIRECTRICES.md`](docs/DIRECTRICES.md) y devuelve `APROBADO` o `RECHAZADO` con los fallos por ID (`D-xx`). |

[`docs/DIRECTRICES.md`](docs/DIRECTRICES.md) es el contrato de calidad entre Develop y Testing.
Cada tarea itera Develop → Testing hasta que Testing la aprueba, y cada ronda queda
registrada en [`docs/agent-log.md`](docs/agent-log.md).

## Ejecutar en local

Requisitos: Node.js 20 o superior y un proyecto de Supabase (ver abajo).

```bash
npm install
cp .env.example .env.local   # y rellena las variables
npm run dev                  # http://localhost:3000
```

Otros comandos:

```bash
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm test           # Vitest
npm run build      # build de producción
npm run check      # todo lo anterior seguido
```

## Crear el proyecto de Supabase

1. Crea un proyecto gratuito en [supabase.com](https://supabase.com).
2. Abre **SQL Editor**, pega el contenido de
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) y ejecútalo.
   Crea el tipo `application_status`, la tabla `applications`, su índice, el trigger de
   `updated_at`, las políticas de Row Level Security y los permisos (`grant`) para el rol
   `authenticated`, necesarios si el proyecto no concede acceso automático a tablas nuevas.
   El rol `anon` no recibe ningún permiso.
3. En **Authentication → Sign In / Providers → Email**, desactiva **Confirm email** para
   poder entrar nada más registrarte. Si lo dejas activado, tendrás que confirmar el correo
   desde el enlace que envía Supabase antes de iniciar sesión.
4. En **Project Settings → API** copia la *Project URL* y la clave *anon* / *publishable*.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto de Supabase (`https://xxxx.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública *anon* / *publishable*. Es pública por diseño: la seguridad la dan las políticas RLS. |

Se definen en `.env.local` (excluido de git). Nunca uses la clave `service_role` en la app.

## Despliegue en Vercel

1. Sube el repositorio a GitHub e impórtalo en [vercel.com/new](https://vercel.com/new)
   (el framework Next.js se detecta solo).
2. En **Settings → Environment Variables** añade `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` para *Production* (y *Preview* si lo usas).
3. Despliega. Si activaste la confirmación por correo, añade la URL de Vercel en
   Supabase → **Authentication → URL Configuration** (*Site URL* y *Redirect URLs*).
4. Para que la producción sea pública, desactiva **Deployment Protection** en
   **Settings → Deployment Protection**.
