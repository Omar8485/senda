# Estado del proyecto

> **Léeme primero.** Este archivo permite retomar el trabajo desde cualquier chat o sesión. Se actualiza al final de **cada avance** (obligatorio).
> Aquí está el estado del **proyecto** (modelo y app). El progreso personal de Omar como usuario (valores, inventario, plan) vive en el repositorio privado `Omar8485/senda-omar`, en `perfil/ESTADO.md`. En la carpeta de Omar está en `perfil/ESTADO.md`.

**Última actualización:** 2026-10-11

## Dónde estamos

| Fase | Estado |
|---|---|
| 0 — Infraestructura | ✔ cerrada (2026-10-10) |
| 1 — Ontología | ✔ cerrada (2026-10-10). Pendiente no bloqueante: marcar acuerdo en los casos de prueba con `?` (sobre todo el 23) |
| 2 — Familias | pendiente: es la siguiente fase de la línea del modelo |
| 3 — Medición | pendiente |
| 4 — Fundamental vs especializado | pendiente |
| 5 — Orientación de Omar | en curso: 5 de 10 áreas registradas (detalle en `perfil/ESTADO.md`, privado) |
| 6 — Inventario | pendiente (depende de 5) |
| 7 — Estrategia | pendiente; la skill `habilidades-estrategia` se propondrá a la cuenta al llegar aquí |
| 8 — Operación / Senda | en curso: prototipo v0.1.11 en claude.ai; v1 publicada en GitHub Pages; B.0 y B.1 hechas y datos de Omar migrados (falta la semana de uso); B.2a y B.2c hechas |

## Senda como proyecto abierto (2026-10-10)

Omar decidió que Senda sea **código abierto, gratuito y abierto a colaboradores**. Él es el autor de la iniciativa y le da prioridad por ahora. Las decisiones P-001 a P-011 están en `docs/vision.md`, que complementa `docs/viabilidad.md`.

- **Licencias (decididas por Omar):** código bajo **AGPL-3.0-or-later** (`LICENSE`); ontología, catálogo y textos bajo **CC BY-SA 4.0** (`LICENSE-CONTENIDO.md`); contribuciones con DCO (`CONTRIBUTING.md`). Hay además un `CODE_OF_CONDUCT.md`.
- **Dominio:** no hace falta todavía. La v1 puede vivir en GitHub Pages (`omar8485.github.io/senda`). Se compra un `.org` al lanzar.
- **Costos (P-011, propuesta):** arquitectura de **costo cero para el proyecto**:
  - app estática;
  - datos en el dispositivo, más la nube propia del usuario;
  - el modelo de IA lo pone el usuario;
  - la capa social, más adelante, sobre un protocolo abierto (AT Protocol), donde cada usuario aloja sus datos públicos.
  
  Un servidor propio (por ejemplo, Supabase) queda solo como opción, si algún día hay fondos.
- **Datos personales separados (2026-10-10):** `perfil/`, `datos/` y la copia anotada de la ontología v0.1 se movieron a `Omar8485/senda-omar`. El historial completo anterior quedó como respaldo en la rama `respaldo-historial-senda` de ese repo. El historial de `senda` se reescribió sin esos datos (2026-10-10, autorizado por Omar).

## Senda: prototipo en claude.ai

- App: un artifact privado de Omar en claude.ai. Su base guarda los datos reales de Omar, así que el enlace no se publica aquí.
- Diseño: `sistema/DISENO.md`. Código: `sistema/senda.html`. Por ahora está personalizado para Omar (nombre fijo y prompts que dicen "Omar"); la v1 será genérica.
- Funciona: brújula de valores, objetivos con valores, derivar habilidades desde valores y objetivos (Claude), ruta tipo Duolingo, retos evaluados, evidencia, logro solo con evidencia aprobada, avatar, XP separado del nivel.

## Siguiente acción

0. **Senda v1:** publicada en https://omar8485.github.io/senda/, con los datos de Omar migrados a su Chrome y probada con un modelo real. Cómo usarla: `docs/guia-de-uso.md`. Pendiente de Omar:
   - usar solo la v1 una semana, sin volver al prototipo (criterio de salida de B.1), y exportar un respaldo a su carpeta cada semana;
   - confirmar la interpretación del núcleo (sin evidencia de ejecución, tope 0; el nivel 5 nunca es automático);
   - aprobar la propuesta para B.2b: Claude redacta las respuestas de referencia de los retos y Omar las marca.

   Detalle y pendientes técnicos: **`docs/construccion-v1.md`**. Seguridad: `docs/auditoria-seguridad-2026-10-11.md`.
1. **Fase 5:** completar las áreas pendientes de Omar con la skill `habilidades-orientacion` (detalle en `perfil/ESTADO.md`).
2. **Fase 2 (cuando Omar quiera):** contrastar `modelo/familias.md` con ESCO/O\*NET y reclasificar las 20 habilidades de la auditoría.

## Decisiones

- **Aceptadas:**
  - D-001: dos mapas, más la separación modelo/perfil.
  - D-002: un proceso mental con método es habilidad (refinada por Omar).
  - D-003: "capacidad" no es categoría.
  - D-004: valores ACT + principios.
  - D-007: un valor es una cualidad de la acción.
  - D-008: valores → situaciones → habilidades.
  - D-009: separación entre XP y nivel.
  - D-010: plataforma inicial en claude.ai.
  - D-011: reglas de evidencia para marcar un logro (imagen para resultados de terceros, enlace para trabajo propio publicado, retraso que no invalida, preguntas de verificación para lo autodeclarado).
- **Pendientes de Omar:**
  - D-005 (escala 0–5) y D-006 (límite de 3): se deciden en las Fases 3 y 7.
  - Topes de los retos en D-009.
- **Desacuerdo abierto:** caso 23. Omar citó "pensamiento crítico" como habilidad; Claude propone tratarlo como término paraguas.
- **Producto:** P-001 a P-011 en `docs/vision.md`.

## Entorno técnico

- **Carpeta de Omar** (`MODELO HABILIDADES`, en su PC): la copia de trabajo de los dos repositorios. No es un repositorio git:
  - la raíz corresponde a `Omar8485/senda`, salvo `CLAUDE.md` y `skills/`;
  - `CLAUDE.md`, `skills/`, `perfil/`, `datos/` y `notas/` corresponden a `Omar8485/senda-omar`.
- **Repositorios:**
  - `github.com/Omar8485/senda`: **público** desde el 2026-10-10. Contiene modelo, reglas, app y docs.
  - `github.com/Omar8485/senda-omar`: privado siempre. Contiene `CLAUDE.md` (instrucciones de trabajo con Claude), `skills/`, `perfil/`, `datos/`, `notas/` y la rama `respaldo-historial-senda`. Una sesión en la nube debe clonar los dos repositorios.
- **App v1 (`app/`):** Node 22.12+. `npm ci` y `npm run check` (lint, tipos y pruebas del núcleo); `npm run build` y `npm run test:e2e` (Playwright). La CI corre todo, más el validador, en cada push.
- **Validador:** `python3 herramientas/validar.py` desde la raíz. Necesita `perfil/` para validar las fichas personales; sin esa carpeta valida solo el modelo.
- **Skills en la cuenta:** `habilidades-clasificar`, `habilidades-orientacion` y `habilidades-evaluar-dominio`, aprobadas. Copias de referencia en `skills/` del repositorio privado `senda-omar` (desde el 2026-10-11).
- **Documentos del proyecto (claude.ai):** CLAUDE.md (privado), PLAN.md y ESTADO.md están en `claude/`; el resto, con su ruta. Se actualizan junto con la carpeta.

## Bitácora

> Resumen sin detalles personales. La bitácora completa está en `perfil/ESTADO.md` (privado).

- **2026-10-10 (sesión 1):** Fase 0 completa: reglas 01–04, plantillas, validador, 4 skills, fichas de ejemplo y auditoría de la conversación de origen con ChatGPT.
- **2026-10-10:** Omar aprobó 3 skills y aceptó D-002 (con un refinamiento propio) y D-004. Fase 1 cerrada. Empieza la Fase 5.
- **2026-10-10:** Fase 5: 5 de 10 áreas de valores y 3 principios registrados. D-003 y D-007 aceptadas. Se publica la "Brújula de valores".
- **2026-10-10:** Vista previa de punta a punta con un objetivo real (inglés C1): fichas de catálogo, inventario y plan preliminar.
- **2026-10-10:** Senda v0.1 publicada (personaje, ruta, valor nuevo, retos). D-008 a D-010 y `sistema/DISENO.md`.
- **2026-10-10:** Senda v0.1.2 a v0.1.11, por comentarios de Omar en la app:
  - brújula editable con origen e historial;
  - avatar;
  - "Mis habilidades" explícito;
  - pestañas Objetivos / Valores / Todas;
  - habilidades en pausa plegadas;
  - límites ocultos;
  - flujo "Agregar objetivo";
  - todo objetivo responde a un valor;
  - etiquetas de área explícitas, con ayuda y transversales al final;
  - un objetivo solo se marca como logrado con evidencia evaluada.
- **2026-10-10:** Proyecto subido a `Omar8485/senda`, con `docs/viabilidad.md`.
- **2026-10-10:** Omar define Senda como bien común: código abierto, gratis y abierto a colaboradores. `docs/vision.md` con P-001 a P-010.
- **2026-10-10:**
  - CC BY-SA 4.0 confirmada para el contenido.
  - Dominio: no hace falta todavía.
  - Datos personales movidos a `Omar8485/senda-omar`.
  - P-011 (propuesta): arquitectura de costo cero para el proyecto.
- **2026-10-10:** Omar eligió AGPL-3.0 para el código. Se agregan `LICENSE`, `CONTRIBUTING.md` (DCO), `CODE_OF_CONDUCT.md` y encabezados SPDX. Con su autorización, se reescribió el historial de `senda` sin datos personales. `senda-omar` usa `main` como rama principal. El validador ignora los `ESTADO.md`.
- **2026-10-10:** `docs/arquitectura.md` v0.1 (borrador): local primero, sin backend, React + TS + Vite como PWA, IndexedDB/Dexie, núcleo del método determinista, prompts versionados, adaptadores Anthropic y OpenAI-compatible con evaluaciones firmadas por modelo, banco de pruebas para certificar modelos, sincronización con la nube del usuario (Drive primero, cifrado opcional), social sobre AT Protocol (necesita dominio propio) y fases B.0 a E. Correo de contacto del código de conducta: infostark.computer@gmail.com.
- **2026-10-10:** Omar responde §12 de la arquitectura: React + TypeScript, Google Drive primero, pregunta si la v1 es app de móvil (Claude: sí, como PWA; falta su confirmación) y deja pendientes las respuestas de referencia. **Fase B.0 hecha** desde la nube: `app/` (Vite 8, React 19, TypeScript 6, oxlint), núcleo con topes de nivel (regla 02), retos (D-009), XP y racha, 26 pruebas de Vitest y 4 de Playwright (escritorio y móvil), política de seguridad de contenido, CI en GitHub Actions, despliegue a Pages desde `main` y Dependabot. Arquitectura v0.2.
- **2026-10-10:** El repositorio pasa a ser público y Pages queda activado (Omar). Revisión de secretos con gitleaks sobre todo el historial: sin hallazgos. La CI escanea secretos en cada push; se agrega `SECURITY.md`. PR #1 abierto. B.1a (datos) completa. La bitácora de construcción de la v1 pasa a `docs/construccion-v1.md`.
- **2026-10-11:** Fase B.1 (código) completa en la nube: capa de datos con importador del prototipo, prompts versionados en `prompts/`, adaptadores Anthropic (SDK oficial) y OpenAI-compatible, capa de acciones, interfaz completa y PWA sin conexión. 74 pruebas unitarias y 12 de interfaz. Se corrigió un `.gitignore` que ocultaba `app/src/datos/`. Pendiente de Omar: unir el PR, probar con su clave y migrar sus datos.
- **2026-10-11:** B.2a: arnés del banco de pruebas de modelos y prueba de clasificación sobre `modelo/casos-de-prueba.md`. Recordatorio para Omar: marcar ✔ o ✘ en esos casos convierte el resultado provisional en oficial.
- **2026-10-11:** Privacidad: `CLAUDE.md` sale del repositorio público y pasa a `senda-omar` (pedido de Omar). Las reglas del método pasan a `CONTRIBUTING.md`. Sin ruta local ni enlace del prototipo en `ESTADO.md` y `sistema/DISENO.md`. Nuevo control en la CI: `herramientas/revisar_publico.py`.
- **2026-10-11:** B.2c: evidencias de referencia para medir la aprobación indebida de logros (13 casos e imágenes ficticias). Detalle en `docs/construccion-v1.md`.
- **2026-10-11:** Omar decide: el historial público no se reescribe; `skills/` pasa a `senda-omar`; D-011 (reglas de evidencia de logro) aceptada al revisar las evidencias de referencia.
- **2026-10-11:** PR #1 unido a `main`. Omar activa Pages con GitHub Actions y la app queda publicada. Claude importa los datos del prototipo en el Chrome de Omar desde "Mis datos": 9 valores y principios, 12 habilidades, 1 objetivo, 2 rutas, sin errores ni errores de consola.
- **2026-10-11:** Omar crea una clave de Anthropic exclusiva para Senda, en un espacio de trabajo con límite de gasto mensual, y la pone en la app. Primera prueba con un modelo real: "Ponerme a prueba" genera un reto válido, sin errores de consola. Queda la semana de uso.
- **2026-10-11:** auditoría de seguridad sin hallazgos urgentes; pruebas de seguridad en la CI; D-011 refinada por Omar (el trabajo propio publicado basta con enlace); los 15 casos de evidencia acordados; guía de uso diario. Pregunta 3 confirmada.
