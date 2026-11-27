# Registro del equipo de agentes

Cada entrada es una ronda Develop → Testing coordinada por el Orquestador.

| # | Tarea | Ronda | Veredicto | Fallos (IDs) | Corrección |
|---|---|---|---|---|---|
| 1 | T1 — MVP (auth, CRUD, estadísticas, RLS) | 1 | RECHAZADO | D-10 (`parse` en vez de `safeParse` en searchParams del dashboard); D-16 (código muerto: `client.ts` sin uso, `isApplicationStatus`/`getStatusLabel` solo usados en tests, tipos `Credentials`/`ApplicationInput` sin uso) | Reenviado a Develop con el informe íntegro + nota del Orquestador: añadir `grant` explícitos para la Data API (el proyecto Supabase no expone tablas nuevas automáticamente) |
| 2 | T1 — MVP (auth, CRUD, estadísticas, RLS) | 2 | **APROBADO** | — | D-10: `safeParse` con filtros vacíos por defecto. D-16: eliminados `client.ts`, `isApplicationStatus`, `getStatusLabel`, `Credentials`, `ApplicationInput`. Extra: `deleteApplication` devuelve NOT_FOUND, `vitest.config.mts`, `turbopack.root`, `grant` explícitos a `authenticated` |
