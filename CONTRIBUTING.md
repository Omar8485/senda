# Cómo contribuir a Senda

Gracias por querer sumarte. Senda es una iniciativa abierta de Omar ([@Omar8485](https://github.com/Omar8485)). El objetivo es que cualquier persona entienda qué sabe hacer, qué podría aprender y qué le conviene desarrollar, con rigor y sin inflar niveles.

## Antes de empezar

1. Lee `README.md` (cómo está organizado el proyecto) y `ESTADO.md` (qué se está haciendo ahora).
2. Si tu aporte toca el modelo (categorías, niveles, priorización), lee primero las reglas en `reglas/`. Los cambios a las reglas 01–03 se proponen como una decisión nueva en `decisiones/registro.md`, con estado `propuesta`, y se discuten antes de aplicarse.
3. Para cambios grandes, abre primero un *issue* y cuenta qué quieres hacer y por qué.

## Qué se puede aportar

- **Código:** la app y sus herramientas.
- **Catálogo:** fichas nuevas de habilidades, conocimientos, competencias y campos, creadas desde `plantillas/` y validadas con `python herramientas/validar.py`.
- **Rúbricas por nivel** para habilidades existentes, con fuentes.
- **Casos de prueba** para la ontología (`modelo/casos-de-prueba.md`).
- **Traducciones**, documentación y diseño.

## Reglas del método (no negociables)

Valen para personas y para asistentes de IA que trabajen en el repositorio.

1. **No mezclar categorías.** Un valor no va en el catálogo; una habilidad no va en la orientación. Si un término tiene varios sentidos (liderazgo, comunicación, aprender a aprender), es un **término paraguas**: se desambigua antes de registrarlo. Ante cualquier duda, manda `reglas/01-ontologia.md`.
2. **"Capacidad" no es categoría.** Se usa aptitud o competencia según el caso (D-003).
3. **Ningún nivel sin evidencia.** Se aplican los topes de `reglas/02-niveles-de-dominio.md`. Si la evidencia no alcanza, se registra el nivel que sí la tiene y se anota el sospechado.
4. **La ontología no cambia en silencio.** Todo cambio a las reglas 01–03 se propone como entrada nueva en `decisiones/registro.md` con estado `propuesta`. Después de un cambio, se revisa `modelo/casos-de-prueba.md`.
5. **No forzar clasificaciones.** Si algo no encaja, se registra como caso abierto.
6. **Los valores son de cada persona.** La app y sus prompts preguntan y contrastan, pero no proponen qué valorar ni inventan objetivos.
7. **Nada de diagnósticos** ni inferencias de rasgos de personalidad. El trabajo con valores no es terapia.

## Convenciones

- Una ficha por entidad: Markdown con encabezado YAML, creada desde `plantillas/`.
- Identificador = nombre del archivo, con prefijo (`hab-`, `comp-`, `con-`, `campo-`, `val-`, `prin-`, `dir-`, `obj-`, `inv-`), en kebab-case, sin tildes ni eñes. Las referencias entre fichas van siempre por identificador.
- Fechas ISO (`AAAA-MM-DD`). Las reglas llevan versión y estado; se sube la versión cuando cambian.

## Reglas para aportar

- **Español neutro**, sin voseo, en textos y documentación del modelo.
- **Nada de datos personales reales** en el repositorio: ni tuyos ni de otras personas. Los ejemplos se inventan.
- **Nada de claves, tokens ni contraseñas.** La CI revisa el historial con gitleaks. Para reportar una vulnerabilidad, lee `SECURITY.md`.
- **Cita las fuentes** cuando algo venga de un marco establecido (Dreyfus, ACT, ESCO, O\*NET…). Distingue lo establecido de lo que es propuesta.
- Ejecuta el validador antes de enviar: `python herramientas/validar.py` debe terminar con 0 errores.
- Si tocas la app, ejecuta `npm run check` dentro de `app/` (lint, tipos y pruebas). Toda regla del método en el núcleo (`app/src/nucleo/`) lleva su prueba.

## Licencias y firma (DCO)

- El **código** se publica bajo **AGPL-3.0-or-later** (`LICENSE`).
- La **ontología, el catálogo y los textos** se publican bajo **CC BY-SA 4.0** (`LICENSE-CONTENIDO.md`).

Al contribuir aceptas publicar tu aporte bajo esas mismas licencias. Conservas tus derechos de autor sobre lo que aportas: no hay cesión.

Usamos el **Developer Certificate of Origin** (DCO, https://developercertificate.org/). Cada commit debe ir firmado con una línea `Signed-off-by`, que se agrega con:

```
git commit -s -m "Describe tu cambio"
```

Con esa firma certificas que tienes derecho a aportar ese trabajo bajo la licencia del proyecto.

## Conducta

Participar en Senda implica respetar el `CODE_OF_CONDUCT.md`.
