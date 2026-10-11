# Senda v1: bitácora de construcción

> Guía para continuar el trabajo de la v1 desde cualquier sesión (en la nube o en la PC de Omar). Se actualiza en cada avance. La arquitectura está en `docs/arquitectura.md`; el estado general del proyecto, en `ESTADO.md`.

## Cómo retomar

1. Trae la rama de trabajo: `git fetch origin && git checkout claude/lucid-cori-csscqq && git pull`. Si el PR [#1](https://github.com/Omar8485/senda/pull/1) ya se unió, trabaja desde `main` actualizado.
2. Entra a `app/` y ejecuta `npm ci`. Requiere Node 22.12 o superior.
3. Verifica que todo esté en verde con `npm run check`, `npm run build` y `npm run test:e2e`. Antes de la primera prueba de interfaz, instala Chromium con `npx playwright install chromium`.
4. Busca la primera casilla sin marcar en "Avance" y continúa desde ahí.
5. Al terminar un paso: corre las verificaciones, marca la casilla, agrega una línea a la bitácora de abajo y haz commit con `git commit -s` (DCO) y push.

**Nunca subas claves, tokens ni datos personales** (ver `SECURITY.md`). Los datos de prueba se inventan, como `app/src/datos/ejemplos/prototipo-inventado.json`.

## Avance de la fase B.1 (Senda local)

Criterio de salida: Omar migra sus datos y usa la v1 una semana sin volver al prototipo.

- [x] **B.1a Datos** (`app/src/datos/`)
  - `esquemas.ts`: modelo de datos con Zod (perfil, valores, objetivos, habilidades, evidencias, rutas, eventos de XP y formato de respaldo).
  - `db.ts`: IndexedDB con Dexie. Las claves de API van en una tabla `secretos` que no se exporta.
  - `repositorio.ts`: toda escritura se valida. Evidencias y eventos de XP solo se agregan, nunca se editan.
  - `respaldo.ts`: exportar, importar (reemplaza todo y valida antes de tocar la base) y borrar todo.
  - `prototipo.ts`: importador de la base del prototipo de claude.ai.
  - Núcleo ampliado: XP por acción, nivel de personaje, XP por habilidad y reglas de logro.
- [x] **B.1b Modelos y acciones**
  - `prompts/`: seis tareas más `reglas.md` (mensaje de sistema), en Markdown con versión y esfuerzo. Son genéricos: usan el nombre del perfil en lugar de "Omar".
  - `app/src/modelos/`:
    - `adaptador.ts`: interfaz común y errores con código.
    - `anthropic.ts`: SDK oficial `@anthropic-ai/sdk` en el navegador, con salida estructurada, `effort` según el prompt y respaldo del servidor (`fallbacks: "default"`) en Opus 5.5, Fable 5.1 y Sonnet 5.5.
    - `openai.ts`: `/chat/completions` en modo JSON; sirve para OpenAI, Gemini, OpenRouter, Ollama y LM Studio.
    - `cliente.ts`: `generarJSON` valida con Zod, reintenta una vez con el error y firma cada resultado.
  - `app/src/servicios/acciones.ts`: cada acción de la app junta el modelo (propone), el núcleo (decide) y los datos: valores, objetivos, logro con evidencia, rutas, sesiones, retos, evidencia, autoevaluación y pausa.
  - `app/src/servicios/config-modelo.ts`: proveedor y modelo en el perfil; la clave va aparte, en la tabla local `secretos`.
  - Política de seguridad: `connect-src` admite HTTPS y `localhost`, porque cada persona elige su proveedor.
- [x] **B.1c Interfaz** (`app/src/ui/`, `app/src/App.tsx`)
  - Pestañas: Inicio, Ruta, Agregar y Ajustes.
  - `Bienvenida.tsx`: nombre y confirmación de mayoría de edad (P-007), además de importar datos.
  - `Inicio.tsx`: personaje y XP, brújula por área, límites, y habilidades por objetivo, valor o todas, con niveles, sospechado y requerido.
  - `Ruta.tsx`: camino por unidades; solo el nodo siguiente está disponible.
  - `Agregar.tsx`: asistentes para un valor (o para derivar habilidades de un valor existente) y para un objetivo, y al final "Generar mi ruta".
  - `modales/`: reto, evidencia, autoevaluación, logro con imagen, editar o archivar un valor, valores de un objetivo, avatar y sesión.
  - `Ajustes.tsx`: modelo de IA con avisos (P-003), perfil, "Mis datos" (exportar, importar respaldo o prototipo, borrar todo) y acerca de.
  - Pruebas de interfaz (`app/e2e/flujo.spec.ts`), con el modelo simulado y sin salir a internet:
    - recorrido completo: configurar el modelo, agregar un valor, generar la ruta, completar una sesión y aprobar un reto, que sube el nivel a 1 y no más (D-009);
    - importar el prototipo y exportar un respaldo;
    - sin errores de consola, y la clave no viaja en el cuerpo de la petición.
- [ ] **B.1d PWA**: manifest, service worker e iconos para instalar en el móvil y el escritorio.
- [ ] **Migración real:** Omar exporta la base del prototipo y la importa en la v1 desde "Mis datos". Esto lo hace Omar en su dispositivo: sus datos nunca pasan por el repositorio.

## Pendientes técnicos conocidos

- **Textos en los componentes:** por ahora están escritos en español dentro de `app/src/ui/`. Hay que extraerlos a archivos de traducción (`app/src/i18n/`) antes de agregar otro idioma. La arquitectura pedía JSON desde el día uno; se pospuso para avanzar con las pantallas.
- **Tamaño del paquete:** unos 600 kB sin comprimir (React, Zod, Dexie y el SDK de Anthropic). Se puede dividir con `import()` dinámico de los adaptadores.
- **Verificación con un modelo real:** las pruebas usan un modelo simulado. Falta una prueba manual con una clave real (la hace Omar: la clave nunca pasa por el repositorio ni por la sesión).
- **Áreas sensibles:** el esquema marca la visibilidad como privada por defecto, y la constante `AREAS_SENSIBLES` está lista para la fase social (D). Todavía no hay nada que publicar.

## Decisiones de implementación (para revisar)

| Tema | Decisión | Por qué |
|---|---|---|
| Tope sin evidencia de ejecución | 0. La formación sola no respalda niveles 1–2 | Lectura estricta de la regla 02: los niveles 1–2 exigen un ejemplo ejecutado. **Pendiente de que Omar lo confirme** |
| Nivel 5 | Nunca se registra de forma automática | La regla 02 pide "reconocimiento externo sostenido", algo que el código no puede verificar. **Pendiente de Omar** |
| Objetivo sin valor | La creación exige al menos un valor. Un objetivo migrado puede llegar sin valor, y la app lo señala | Mismo comportamiento que el prototipo |
| Objetivo "logrado" sin evidencia en el prototipo | Al migrar vuelve a "activo" | Regla: sin evidencia aprobada no hay logro |
| Claves de API | Tabla local `secretos`, fuera del respaldo | docs/arquitectura.md §6.2 |
| Sincronización | Fuera de B.1; llega en B.3 (Google Drive primero) | Respuesta de Omar a §12 |
| Confianza sin rúbrica | Nunca "alta" si la habilidad no tiene rúbrica específica, aunque haya evidencia externa | Regla 02 §6 |
| Evidencia propia | No cambia el nivel por sí sola; queda `revision_pendiente`. La persona puede autoevaluarse y el núcleo recorta al tope | Prototipo + regla 02 |
| Modelo predeterminado | Claude Opus 5.5, con respaldo del servidor ante rechazos. La persona puede elegir otro o un proveedor OpenAI-compatible | P-003: el modelo lo elige el usuario |
| Esfuerzo del modelo | `high` en las evaluaciones (reto y logro) y `medium` en el resto; se fija en cada prompt | Rigor donde se decide un nivel o un logro |

## Formato que espera el importador del prototipo

Un JSON con las colecciones del artifact: `valores`, `habilidades`, `objetivos` y `rutas`, cada una como mapa `id → documento` o como lista de documentos con `id`. A eso se suma `jugador`, que puede ser el documento `estado` o un mapa que lo contiene. Es el formato de `datos/senda-db/`, que vive en el repositorio privado. El ejemplo inventado está en `app/src/datos/ejemplos/prototipo-inventado.json`.

**Pérdidas conocidas al migrar:**
- **Racha:** el prototipo guardaba solo el XP total y la racha. La v1 los calcula a partir de eventos, así que el XP se conserva repartido en eventos (uno por habilidad y uno por el resto), pero la racha vuelve a empezar.
- **Imagen de la evidencia de logro:** el prototipo guardaba solo el nombre del archivo, no la imagen.
- **Nombre del perfil:** el prototipo no lo guardaba, así que lo escribe quien importa.

## Preguntas pendientes de Omar

1. Confirmar la respuesta a la pregunta 3 de la arquitectura: la v1 es una PWA instalable en el móvil, sin tiendas.
2. Confirmar las dos interpretaciones del núcleo de la tabla de arriba.
3. Pregunta 4 de la arquitectura (respuestas de referencia de los retos de inglés): pendiente; hace falta en B.2.
4. Topes de los retos en D-009 (tope 3 y un nivel por reto): siguen en propuesta.

## Bitácora

- **2026-10-10:** B.0 completa (estructura, CI y Pages). Repositorio público: revisión de secretos con gitleaks sobre todo el historial (sin hallazgos), escaneo de secretos en la CI y `SECURITY.md`. PR #1 abierto hacia `main`.
- **2026-10-10:** B.1a completa: capa de datos, importador del prototipo y 47 pruebas.
- **2026-10-11:** B.1b completa: prompts versionados, adaptadores Anthropic y OpenAI-compatible, `generarJSON` y capa de acciones. 74 pruebas.
- **2026-10-11:** B.1c completa: interfaz completa sobre la capa de acciones, 74 pruebas unitarias y 10 de interfaz (escritorio y móvil).
