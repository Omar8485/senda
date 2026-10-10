# Cómo contribuir a Senda

Gracias por querer sumarte. Senda es una iniciativa abierta de Omar ([@Omar8485](https://github.com/Omar8485)). El objetivo es que cualquier persona entienda qué sabe hacer, qué podría aprender y qué le conviene desarrollar, con rigor y sin inflar niveles.

## Antes de empezar

1. Lee `README.md`, `CLAUDE.md` (cómo está organizado el proyecto) y `ESTADO.md` (qué se está haciendo ahora).
2. Si tu aporte toca el modelo (categorías, niveles, priorización), lee primero las reglas en `reglas/`. Los cambios a las reglas 01–03 se proponen como una decisión nueva en `decisiones/registro.md`, con estado `propuesta`, y se discuten antes de aplicarse.
3. Para cambios grandes, abre primero un *issue* y cuenta qué quieres hacer y por qué.

## Qué se puede aportar

- **Código:** la app y sus herramientas.
- **Catálogo:** fichas nuevas de habilidades, conocimientos, competencias y campos, creadas desde `plantillas/` y validadas con `python herramientas/validar.py`.
- **Rúbricas por nivel** para habilidades existentes, con fuentes.
- **Casos de prueba** para la ontología (`modelo/casos-de-prueba.md`).
- **Traducciones**, documentación y diseño.

## Reglas para aportar

- **Español neutro** en textos y documentación del modelo.
- **Nada de datos personales reales** en el repositorio: ni tuyos ni de otras personas. Los ejemplos se inventan.
- **Cita las fuentes** cuando algo venga de un marco establecido (Dreyfus, ACT, ESCO, O\*NET…). Distingue lo establecido de lo que es propuesta.
- Ejecuta el validador antes de enviar: `python herramientas/validar.py` debe terminar con 0 errores.

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
