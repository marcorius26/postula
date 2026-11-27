# Directrices de calidad — Postula

Contrato entre **Develop** (las cumple) y **Testing** (las verifica).
Cada directriz tiene un ID; Testing cita el ID en cada fallo. Todas son bloqueantes.
Solo el usuario puede modificar este documento.

## 1. Verificación automática

- **D-01** `npm run lint` termina sin errores ni warnings.
- **D-02** `npm run typecheck` (`tsc --noEmit`) termina sin errores.
- **D-03** `npm test` pasa al completo; no hay tests desactivados (`.skip`, `.only`).
- **D-04** `npm run build` genera el build de producción sin errores.

## 2. Seguridad

- **D-05** Ningún secreto en el repositorio: ni claves, ni tokens, ni `.env*` (salvo
  `.env.example` con valores de ejemplo). Las claves se leen solo de `process.env`.
- **D-06** Nunca se usa la `service_role key` de Supabase en el código de la app.
- **D-07** Toda tabla tiene Row Level Security activado y políticas que limitan
  `select/insert/update/delete` a `auth.uid() = user_id`.
- **D-08** Toda server action comprueba el usuario con `supabase.auth.getUser()` antes de
  leer o escribir, y nunca acepta `user_id` desde el formulario.
- **D-09** Las rutas privadas (`/dashboard/**`) redirigen a `/login` sin sesión, tanto
  en `proxy.ts` como en la propia página (defensa en profundidad).

## 3. Datos y validación

- **D-10** Toda entrada de usuario se valida en servidor con un esquema Zod de
  `src/lib/validation.ts` usando `safeParse`; los errores se devuelven al formulario
  con un mensaje en español, sin lanzar excepciones al usuario.
- **D-11** Los cambios de esquema van en un fichero nuevo de `supabase/migrations/`.
- **D-12** Tras una escritura se llama a `revalidatePath` de las rutas afectadas.

## 4. Código

- **D-13** TypeScript estricto: prohibido `any`, `@ts-ignore`, `@ts-expect-error` y
  `as unknown as`.
- **D-14** Server Components por defecto; `"use client"` solo en componentes que usan
  estado, efectos o eventos del navegador.
- **D-15** La lógica de negocio pura vive en `src/lib/` (sin React ni Supabase) y tiene
  tests en `tests/` que cubren al menos un caso normal y uno límite.
- **D-16** Sin código muerto: ni `console.log`, ni imports o variables sin usar, ni
  código comentado.

## 5. Experiencia de usuario

- **D-17** Todos los textos visibles están en español.
- **D-18** Cada campo de formulario tiene `<label>` asociado; los botones indican
  estado de envío (p. ej. "Guardando…") y se desactivan mientras tanto.
- **D-19** Las listas muestran un estado vacío útil y los errores se muestran al usuario.
- **D-20** La interfaz es usable en móvil (≥ 360 px) sin scroll horizontal.
- **D-21** Las acciones destructivas (borrar) piden confirmación.
