# CLAUDE.md — Modelo de habilidades y valores

Instrucciones para Claude al trabajar en esta carpeta. Léelas completas antes de tocar cualquier archivo.

## Qué es este proyecto

Un modelo para representar con rigor **qué sabe hacer una persona, qué podría aprender y qué le conviene desarrollar**, conectado con **lo que le importa y lo que quiere lograr**. El usuario es **Omar**: lo construye para sí mismo, pero el modelo genérico debe servir para cualquier persona.

No es un árbol de habilidades de videojuego. Es **dos mapas conectados por una estrategia**:

- **Mapa de orientación** (¿hacia dónde y por qué?): valores, principios, direcciones, objetivos, acciones.
- **Mapa de desarrollo** (¿con qué cuento?): campos, competencias, habilidades, conocimientos, disposiciones, aptitudes.
- **Estrategia**: objetivos → competencias exigidas → habilidades y conocimientos con nivel requerido → brecha frente al inventario → qué desarrollar.

## Estructura de carpetas

```
CLAUDE.md                 este archivo
ESTADO.md                 estado vivo: fase, progreso, pendientes, bitácora  ← LÉELO PRIMERO
PLAN.md                   fases y criterios de salida
reglas/
  01-ontologia.md         categorías, definiciones operativas, test de clasificación
  02-niveles-de-dominio.md escala 0-5, dimensiones, topes por evidencia
  03-priorizacion-y-estrategia.md cinco decisiones, límite de 3, criterios, práctica
  04-rigor-y-convenciones.md reglas epistemológicas, límites, convenciones de archivos
modelo/                   GENÉRICO (vale para cualquier persona)
  familias.md             funciones universales (semilla de Fase 2)
  casos-de-prueba.md      pruebas unitarias de la ontología
  catalogo/{habilidades,competencias,conocimientos,campos}/   una ficha por entidad
perfil/                   INSTANCIA DE OMAR (repo privado Omar8485/senda-omar; ignorado en este repo)
  ESTADO.md               estado personal: progreso de orientación, inventario, notas, bitácora completa
  orientacion/{valores,principios,direcciones,objetivos}/
  inventario/             niveles con evidencia
  estrategia/             planes trimestrales
plantillas/               plantillas de cada tipo de ficha
decisiones/registro.md    decisiones conceptuales (D-NNN) y casos abiertos
fuentes/                  referencias y auditoría de la conversación de origen
herramientas/validar.py   validador de esquema, referencias y reglas
sistema/DISENO.md         diseño de Senda, la app tipo videojuego (fuente operativa diaria)
skills/                   copia de referencia de las skills (ver abajo)
docs/                     visión de producto y viabilidad de Senda como startup
datos/senda-db/           respaldo JSON de la base de Senda (repo privado; ignorado en este repo)
```

## Al empezar cada sesión

1. Lee `ESTADO.md` (estado del proyecto) y, si la tarea es sobre Omar como usuario, `perfil/ESTADO.md` (privado): fase actual, progreso, decisiones pendientes y siguiente acción. Si trabajas desde un chat del proyecto sin acceso a la carpeta, usa el documento `claude/ESTADO.md` del proyecto.
2. Lee la regla que corresponda a la tarea. Ante cualquier duda de categoría, `reglas/01-ontologia.md` manda.
3. Si la tarea encaja con una skill, úsala.

## Skills

Las skills se guardan en la cuenta de Omar (Claude las propone y Omar las aprueba) para usarlas desde cualquier sesión. La carpeta `skills/` guarda una copia de referencia de cada `SKILL.md`: si se modifica una skill, se actualiza la copia y se vuelve a proponer la skill completa.

| Skill | Cuándo | Fases |
|---|---|---|
| `habilidades-clasificar` | Omar menciona un concepto y hay que decidir qué es, o hay que crear una ficha del catálogo | 1, 2, 4 |
| `habilidades-evaluar-dominio` | Hay que asignar o revisar el nivel de Omar en una habilidad o conocimiento | 3, 6 |
| `habilidades-orientacion` | Trabajar valores, principios, direcciones u objetivos de Omar | 5 |
| `habilidades-estrategia` | Calcular brechas, priorizar, armar el plan de práctica o hacer la revisión periódica | 7, 8 |

## Senda (la app)

Senda es la app de Omar en claude.ai (https://claude.ai/artifact/JS7eTwNbd4sACDn6qd5KvZ). Su base de datos es la fuente operativa de XP, rutas, retos, evidencias y lo creado desde "Valor nuevo". Cuando Omar pida **"sincroniza Senda"**: lee la base con ArtifactData (`valores`, `habilidades`, `rutas`, `jugador/estado`), crea o actualiza las fichas de lo marcado `pendiente_ficha: true`, revisa niveles con evidencia externa según la regla 02 y actualiza `ESTADO.md`. Para cambios de diseño, edita el HTML y republica en la misma URL. Ver `sistema/DISENO.md`.

## Repositorio y respaldo

Hay dos repositorios y una carpeta que los reúne:

- **github.com/Omar8485/senda**: el proyecto abierto (modelo genérico, reglas, app y docs). Se hará público: **nunca subas aquí datos personales** (valores, inventario, evidencias, notas de conversación). `perfil/`, `datos/` y `notas/` están en `.gitignore`.
- **github.com/Omar8485/senda-omar**: privado siempre. Contiene `perfil/` (fichas y `perfil/ESTADO.md`), `datos/senda-db/` (foto de la base de Senda) y `notas/`. La rama `respaldo-historial-senda` guarda el historial anterior a la separación.
- **Carpeta de Omar** (`C:\Users\omar_\Documents\MODELO HABILIDADES`): la copia de trabajo diaria. La raíz corresponde a `senda` y `perfil/` + `datos/` corresponden a `senda-omar`.

Si una sesión trabaja solo desde GitHub, al final Omar o la siguiente sesión con acceso a la PC baja los cambios a la carpeta. `datos/senda-db/` es una foto en una fecha: la fuente viva sigue siendo la base del artifact.

## Reglas de oro (no negociables)

1. **Nunca mezclar categorías.** Un valor no va en el catálogo; una habilidad no va en la orientación. Si un término tiene varios sentidos (liderazgo, comunicación, aprender a aprender), es un **término paraguas**: se desambigua antes de registrarlo.
2. **"Capacidad" no es categoría.** Usa aptitud o competencia según el caso (D-003).
3. **Ningún nivel sin evidencia.** Aplica los topes de la regla 02. Si la evidencia no alcanza, registra el nivel que sí la tiene y anota el sospechado. No infles niveles para agradar; Omar prefiere evaluaciones directas y honestas.
4. **No cambies la ontología en silencio.** Cualquier cambio a las reglas 01–03 se propone como nueva entrada en `decisiones/registro.md` con estado `propuesta`. Solo Omar acepta o rechaza. Tras un cambio, revisa `modelo/casos-de-prueba.md`.
5. **No fuerces clasificaciones.** Si algo no encaja, regístralo como caso abierto.
6. **Los valores son de Omar.** Pregunta, contrasta y señala posibles mandatos ajenos (prueba del testigo secreto), pero no propongas qué debería valorar. No inventes objetivos.
7. **No infieras rasgos de personalidad** ni hagas diagnósticos. El trabajo con valores no es terapia; si aparece material doloroso, ofrece omitir el ejercicio y sugiere acompañamiento profesional.
8. **Límite de trabajo en curso:** máximo 3 elementos en `decision: desarrollar` (D-006).
9. **Cita las fuentes** (`fuentes/referencias.md`) y distingue lo que viene de un marco establecido de lo que es propuesta propia.
10. **Valida antes de cerrar:** ejecuta `python herramientas/validar.py` después de crear o modificar fichas y corrige los errores.

## Convenciones

- **Español neutro, sin voseo.** Tono directo, sin relleno.
- Una ficha por entidad, Markdown con encabezado YAML, creada desde `plantillas/`.
- Identificador = nombre del archivo, con prefijo: `hab-`, `comp-`, `con-`, `campo-`, `val-`, `prin-`, `dir-`, `obj-`, `inv-`. Kebab-case, sin tildes ni eñes.
- Referencias entre fichas siempre por identificador.
- Fechas ISO (`AAAA-MM-DD`).
- Las reglas llevan versión y estado; súbela cuando cambien.

## Guardar el estado (después de CADA avance, no solo al final)

Omar retoma el proyecto desde distintos chats y sesiones. Ningún avance se da por terminado hasta que está guardado:

1. Ejecuta el validador (si no hay terminal, valida en la nube con una copia).
2. Actualiza `ESTADO.md` (proyecto, **sin detalles personales**) y/o `perfil/ESTADO.md` (personal: progreso de orientación, notas de conversación, bitácora completa). Incluye fase, siguiente acción y una línea en la bitácora.
3. Si se tomó una decisión conceptual, regístrala en `decisiones/registro.md`.
4. Sincroniza: escribe los archivos cambiados en la carpeta **y** en los documentos del proyecto (misma ruta; CLAUDE.md, PLAN.md y ESTADO.md viven en `claude/`).
5. Si el avance es significativo, haz commit y push al repositorio que corresponda: `senda` para modelo, app y docs; `senda-omar` para `perfil/` y `datos/`. Re-exporta `datos/senda-db/` si la base cambió.
6. Resume a Omar en dos o tres líneas qué cambió y qué queda pendiente de él.
