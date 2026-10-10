# Senda: arquitectura de la v1

> Versión 0.1 (borrador) · 2026-10-10 · Propuesta de Claude para revisión de Omar.
> Se apoya en `docs/vision.md` (P-001 a P-011) y en el prototipo `sistema/senda.html`, que funciona como especificación funcional.

## 1. Principios de diseño

1. **Costo cero para el proyecto (P-011).** Ninguna función básica depende de un servidor que el proyecto tenga que pagar. Si mañana no hay dinero, Senda sigue funcionando y nadie pierde datos.
2. **Local primero.** La app funciona completa sin cuenta y sin internet, salvo para llamar al modelo de IA. Los datos viven en el dispositivo.
3. **Los datos son del usuario.**
   - Se exportan e importan en JSON en cualquier momento.
   - La sincronización usa **la nube del propio usuario**.
   - Lo público usa **su propio repositorio** en AT Protocol.
4. **El modelo lo elige el usuario (P-003).**
   - La app no sabe de proveedores: habla con una interfaz común.
   - Cada evaluación queda firmada con el modelo que la hizo.
5. **El rigor del método vive en el código, no en el modelo.** Las reglas que no se negocian se aplican con código determinista, nunca con el criterio del modelo:
   - topes de nivel por tipo de evidencia;
   - el XP no sube el nivel;
   - no hay logro sin evidencia aprobada.
   
   El modelo propone; el código decide qué se registra.
6. **Privado por defecto.** Nada sale del dispositivo sin una acción explícita del usuario.
7. **Fácil de contribuir.** Herramientas populares, un solo lenguaje (TypeScript) y pruebas automáticas.

## 2. Vista general

```
┌──────────────────────── Navegador / app de escritorio ────────────────────────┐
│                                                                               │
│  Interfaz (React + TypeScript, PWA)                                           │
│     │                                                                         │
│  Núcleo del método (TypeScript puro, sin interfaz, con pruebas)               │
│     · ontología y validación   · reglas de nivel y topes   · XP y rachas      │
│     · rutas y nodos            · logros con evidencia      · prompts versionados│
│     │                    │                         │                          │
│  Almacén local        Adaptadores de modelos     Sincronización (opcional)    │
│  (IndexedDB)          · Anthropic                · Google Drive / Dropbox /    │
│                       · OpenAI-compatible          OneDrive / archivo JSON     │
│                         (OpenAI, Gemini,         Social (fase D, opcional)     │
│                          OpenRouter, Ollama,     · AT Protocol (repo del       │
│                          LM Studio…)               usuario)                    │
└───────────────────────────────────────────────────────────────────────────────┘
         │                         │                              │
   (nada sale sin           API del proveedor              nube o PDS del usuario
    acción del usuario)     o modelo local                 (no del proyecto)
```

Hosting: archivos estáticos en **GitHub Pages** (gratis). No hay backend del proyecto.

## 3. Tecnología propuesta

| Pieza | Elección | Por qué |
|---|---|---|
| Lenguaje | **TypeScript** | Un solo lenguaje para el núcleo y la interfaz; tipos para un modelo de datos rico |
| Interfaz | **React + Vite** | La comunidad de colaboradores más grande; Vite compila a archivos estáticos |
| App instalable | **PWA** (service worker + manifest) | Se instala en el móvil y el escritorio desde el navegador, funciona sin conexión y no pasa por tiendas |
| Base local | **IndexedDB** a través de **Dexie** | Estándar del navegador, con buena capacidad; Dexie simplifica consultas y migraciones |
| Esquemas | **Zod** | Valida datos importados, respuestas del modelo y migraciones con el mismo esquema |
| Pruebas | **Vitest** (núcleo) + **Playwright** (interfaz) | Rápidas; Playwright ya se usó con el prototipo |
| Escritorio (más adelante) | **Tauri** | App liviana; permite hablar con modelos locales sin las trabas de CORS del navegador |
| Idiomas | Archivos JSON de traducción desde el día uno | Español primero y otros idiomas sin tocar el código |

> Alternativa considerada: Svelte (más simple y liviano). Se descartó por tener una comunidad de colaboradores más pequeña. Es fácil de revisar si Omar lo prefiere.

## 4. Estructura del repositorio

```
app/                    la aplicación (Vite + React)
  src/nucleo/           el método: tipos, reglas de nivel, XP, rutas, logros (sin React)
  src/datos/            IndexedDB (Dexie), migraciones, exportar e importar
  src/modelos/          adaptadores de IA + cliente común
  src/sync/             sincronización con nubes del usuario
  src/social/           AT Protocol (fase D)
  src/ui/               pantallas y componentes
  src/i18n/             es.json, en.json…
prompts/                prompts versionados (Markdown con variables), uno por tarea
banco/                  banco de pruebas de modelos: casos, respuestas de referencia, script
modelo/, reglas/, …     lo que ya existe (ontología, catálogo, decisiones)
sistema/senda.html      prototipo (referencia funcional; se archiva al salir la v1)
```

**Los prompts salen del código.** En el prototipo están incrustados (`REGLAS`). En la v1 cada tarea tiene su archivo en `prompts/`, con versión. Así cualquiera puede mejorarlos y el banco de pruebas mide cada cambio.

## 5. Modelo de datos (v1)

Sale de la base actual del prototipo (`valores`, `habilidades`, `objetivos`, `rutas`, `jugador`) y la ordena. Todos los registros llevan `id`, `creado`, `actualizado`, `version` y `origen`.

| Entidad | Campos clave | Notas |
|---|---|---|
| `perfil` | nombre, avatar, idioma, modelo preferido | Un perfil por dispositivo o cuenta |
| `valor` | enunciado, corto, área, importancia, consistencia, situaciones[], historial[], visibilidad | Las áreas sensibles (pareja, familia, crianza) se marcan `sensible: true` y nunca se publican de forma automática |
| `principio` | enunciado | Filtro de la estrategia; no se muestra en inicio |
| `objetivo` | título, enunciado, criterio, fecha límite, valores[], estado, evidencia_logro, intentos_logro[] | Regla: al menos un valor; logro solo con evidencia aprobada |
| `habilidad` | nombre, tipo, nivel, nivel_sospechado, requerido, clase, fuentes[], estado, motivo_pausa | `nivel` lo escribe solo el núcleo, aplicando los topes |
| `evidencia` | habilidad u objetivo, tipo, externa, descripción, enlace, archivo, evaluación | Se registra solo al final (append-only). Cada evaluación guarda `{modelo, proveedor, version_prompt, fecha, resultado}` |
| `ruta` | fuente (objetivo o valor), unidades[] → nodos[] | Tipo Duolingo; nodo = práctica, reto o evidencia |
| `evento_xp` | fecha, cantidad, motivo, habilidad | El XP total y la racha se calculan a partir de los eventos |
| `catalogo` | copia local del catálogo genérico (`modelo/catalogo`) | Se actualiza con la app; sirve para reutilizar habilidades y rúbricas |

**Migración desde el prototipo:** un importador que lee el JSON exportado de la base de claude.ai (el formato de `datos/senda-db/`) y lo convierte a este modelo. Omar es el primer usuario migrado.

## 6. Capa de modelos de IA

### 6.1 Interfaz común

Toda la app usa una sola función, por ejemplo `generarJSON(tarea, variables, esquema)`:
1. Toma el prompt versionado de `prompts/<tarea>.md` y lo completa.
2. Llama al adaptador elegido.
3. Valida la respuesta con el esquema Zod. Si no cumple, reintenta una vez con el error; si vuelve a fallar, avisa al usuario.
4. Devuelve el resultado junto con la **firma**: `{proveedor, modelo, version_prompt, fecha}`.

### 6.2 Adaptadores

| Adaptador | Cubre | Notas a verificar en la implementación |
|---|---|---|
| **Anthropic** | Modelos Claude | Llamada directa desde el navegador con el encabezado `anthropic-dangerous-direct-browser-access` |
| **OpenAI-compatible** | OpenAI, Gemini (endpoint compatible), OpenRouter, Ollama, LM Studio, llama.cpp server, etc. | Cada proveedor decide si acepta llamadas desde el navegador (CORS). Ollama exige configurar `OLLAMA_ORIGINS`; la app de escritorio (Tauri) evita el problema |

**Claves de API:**
- se guardan solo en el dispositivo, nunca en la sincronización salvo que el usuario lo pida;
- se pueden borrar desde la configuración;
- la app no tiene servidor que pueda verlas.

**Riesgo:** una clave en el navegador es vulnerable si la app tuviera una falla de seguridad (XSS). Por eso: política de seguridad de contenido estricta y nada de scripts de terceros.

### 6.3 Tareas que usan el modelo

| Tarea | Entrada | Salida (validada) | Quién decide al final |
|---|---|---|---|
| Clasificar un concepto | texto | categoría + razones (regla 01) | El usuario confirma |
| Derivar habilidades de un valor | valor | situaciones → habilidades con clase y nivel requerido | El usuario acepta o desmarca |
| Derivar habilidades de un objetivo | objetivo + valores | criterio afinado, aviso de fecha, habilidades | El usuario acepta |
| Generar ruta | objetivo o valor + habilidades | unidades y nodos | El usuario puede regenerar |
| Crear reto | habilidad + nivel meta + rúbrica | reto con criterios | — |
| Evaluar respuesta a un reto | reto + respuesta | aprobado, puntaje, nivel demostrado | **El núcleo** aplica los topes (un reto sube como máximo a nivel 3, D-009) |
| Evaluar evidencia de logro | criterio + evidencia (+ imagen) | aprobado + qué falta | **El núcleo** solo habilita "logrado" si se aprueba |

### 6.4 Avisos (P-003)

- En la configuración del modelo y al pie de cada evaluación: *"Generado por {modelo}. Puede contener errores; la calidad depende del modelo que elegiste. Úsalo como guía, no como certificación."*
- Frase dinámica en el perfil y en la tarjeta compartida: **"{nombre} entrena con Senda · coach: {modelo}"**, en texto plano, sin logos de terceros, con la nota "Senda no está afiliada a los proveedores de modelos".

## 7. Banco de pruebas de modelos (certificación)

Es lo que hace que "el modelo que elijas" no destruya el rigor.

| Prueba | Fuente | Qué mide |
|---|---|---|
| Clasificación | `modelo/casos-de-prueba.md` (respuestas acordadas) | Acierto de categoría |
| Evaluación de retos | Respuestas de referencia escritas a propósito (buenas, flojas, tramposas) con veredicto conocido | **Tasa de aprobación indebida** (inflar) y de rechazo indebido |
| Evaluación de evidencia | Evidencias de referencia (con respaldo, sin respaldo, inconsistentes) | Que no apruebe afirmaciones sin respaldo |
| Formato | Todas | Porcentaje de respuestas que cumplen el esquema sin reintento |

**Resultado:**
- **Recomendado:** pasa todos los umbrales.
- **Aceptable:** pasa con avisos.
- **Experimental:** no pasa. La app muestra la categoría al elegir el modelo.

Los resultados se publican en el repositorio (`banco/resultados/`) y cualquiera puede correr el banco con su propio modelo y aportar el resultado. Umbrales iniciales propuestos, a calibrar:
- aprobación indebida ≤ 5 %;
- clasificación ≥ 85 %;
- formato ≥ 95 %.

## 8. Sincronización y respaldo (fase B.2)

| Opción | Cómo | Para quién |
|---|---|---|
| **Archivo** | Exportar o importar JSON (manual) | Todos, desde el día uno |
| **Google Drive** | Carpeta privada de la app (`appDataFolder`), con el permiso de Google limitado a esa carpeta | Usuarios de Android y Google |
| **Dropbox / OneDrive** | Mismo patrón, con OAuth para aplicaciones de navegador | Los demás |

**Conflictos:** un registro por documento con `version` y `actualizado`; gana el más reciente, salvo las evidencias y los eventos de XP, que solo se agregan y nunca se pisan. Si se detecta un conflicto real en un mismo documento, se guardan las dos versiones y se le pregunta al usuario.

**Cifrado opcional:** el usuario puede activar una frase de cifrado. El archivo en su nube queda cifrado y ni Google ni Dropbox pueden leerlo. Si pierde la frase, pierde el respaldo; la app lo advierte.

> Nota: registrar la app en Google, Dropbox o Microsoft para OAuth es gratis, pero requiere una cuenta del proyecto. Se puede usar el correo de contacto de Senda.

## 9. Capa social sobre AT Protocol (fase D)

- **Identidad:** el usuario inicia sesión con su cuenta de AT Protocol (por ejemplo, Bluesky), mediante el cliente OAuth para navegador.
- **Lo que se publica:** solo lo que el usuario marca como público, guardado como registros en **su propio repositorio**, con tipos propios de Senda:
  - objetivo público, con su estado;
  - logro verificado (con el tipo de evidencia y el modelo que lo evaluó);
  - habilidad con nivel y su procedencia (reto, evidencia externa o autodeclarado);
  - una senda que se puede copiar (la estructura de la ruta, sin evidencia).
- **Interacciones:** seguir, reaccionar con ánimo ("me encanta", "¡sigue!", "yo también"), copiar una senda, invitar a un proyecto, ofrecer ayuda. Todas son registros del usuario que actúa, en su propio repositorio.
- **Leer a quienes sigues:** la app lee directamente sus repositorios. Sin servidor del proyecto.
- **Descubrir gente** (búsqueda, tendencias) requiere un índice. Queda fuera de la v1 y solo se agrega si hay comunidad y fondos.
- **Lo privado nunca va a AT Protocol** mientras su extensión de datos privados (Spaces) siga en alfa.

> **Aquí sí hace falta el dominio.** Los tipos de registro de AT Protocol se nombran con un dominio invertido que el proyecto debe controlar (por ejemplo, `org.<dominio>.objetivo`). Un subdominio de GitHub Pages no sirve. El `.org` se compra antes de empezar la fase D.

## 10. Seguridad y privacidad

- Sin analítica ni rastreadores. Sin scripts de terceros.
- Política de seguridad de contenido estricta; dependencias mínimas y auditadas (Dependabot).
- Las imágenes de evidencia se guardan en el dispositivo y viajan al modelo solo cuando el usuario evalúa.
- Pantalla "Mis datos": qué hay guardado, dónde, qué se publicó, y botones para exportar y borrar todo.
- Mayores de 18 en la v1 (P-007).
- Las áreas sensibles se marcan y la app no ofrece publicarlas.

## 11. Fases de construcción

| Fase | Entrega | Criterio de salida |
|---|---|---|
| **B.0 — Base** | Repo `app/` con Vite + React + TS, núcleo con pruebas, CI en GitHub Actions, despliegue a GitHub Pages | Una página vacía desplegada y pruebas en verde |
| **B.1 — Senda local** | Las funciones del prototipo: brújula, objetivos, habilidades, rutas, retos, evidencia, logros, XP. Datos en IndexedDB, exportar e importar, importador del prototipo, adaptadores Anthropic y OpenAI-compatible, prompts versionados | Omar migra sus datos y usa la v1 una semana sin volver al prototipo |
| **B.2 — Banco de pruebas** | `banco/` con casos, script y resultados de 3 a 5 modelos | Etiquetas Recomendado / Aceptable / Experimental visibles en la app |
| **B.3 — Sincronización** | Google Drive (primero) y archivo; cifrado opcional | Mismo perfil en dos dispositivos sin perder datos |
| **C — Beta** | 10 a 20 personas durante 4 semanas | Informe de uso, errores y confusiones; decisión de seguir |
| **D — Social** | AT Protocol: publicar, seguir, reacciones, copiar senda | Dos usuarios de prueba se siguen, reaccionan y copian una senda |
| **E — Lanzamiento** | Repo público, dominio, página de presentación | Checklist de privacidad y aspectos legales revisada |

## 12. Preguntas abiertas para Omar

1. ¿Te parece bien React + TypeScript, o prefieres otra herramienta (por ejemplo, Svelte, o algo más cercano a tu experiencia en .NET o Kotlin)?
2. ¿Qué proveedor de nube va primero para sincronizar: Google Drive, como propongo, u otro?
3. ¿Quieres que la v1 sea solo web (PWA) o también app de escritorio desde el inicio?
4. Para el banco de pruebas: ¿escribimos juntos las respuestas de referencia (buenas, flojas, tramposas) de los primeros retos de inglés?
