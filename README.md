# Senda

Senda es una app para entender **qué sabes hacer, qué podrías aprender y qué te conviene desarrollar**, conectada con **lo que te importa** (valores) y **lo que quieres lograr** (objetivos).

Su diferencia con otras apps de superación personal es el rigor:

- un valor se aterriza en situaciones, y cada situación en habilidades;
- el nivel de una habilidad (0-5) solo sube con evidencia;
- el XP mide la práctica y no se confunde con el nivel;
- un objetivo solo se marca como logrado con evidencia evaluada.

> Proyecto abierto en preparación. Iniciativa y autoría: **Omar** ([@Omar8485](https://github.com/Omar8485)). Licencias: código bajo **AGPL-3.0-or-later** (`LICENSE`); ontología, catálogo y textos bajo **CC BY-SA 4.0** (`LICENSE-CONTENIDO.md`). ¿Quieres colaborar? Lee `CONTRIBUTING.md`. Para reportar un problema de seguridad, lee `SECURITY.md`.

## Estado

- **Prototipo funcional en claude.ai.** El código fuente es `sistema/senda.html`. Usa la base de datos y el acceso a Claude que ofrecen los artifacts de claude.ai, así que fuera de claude.ai no guarda datos ni llama al modelo.
- **Modelo conceptual.** La Fase 1 está cerrada y la Fase 5 está en curso. El detalle está en `ESTADO.md` y `PLAN.md`.
- **Senda v1 en construcción** en `app/` (fase B.0 lista: estructura, pruebas automáticas y despliegue). Arquitectura en `docs/arquitectura.md`.
- **Viabilidad como producto:** `docs/viabilidad.md`.

## Estructura

| Ruta | Qué es |
|---|---|
| `ESTADO.md` | Estado vivo: fases, progreso, pendientes y bitácora. **Empieza aquí.** |
| `PLAN.md` | Fases y criterios de salida. |
| `CONTRIBUTING.md` | Cómo aportar: reglas del método, convenciones, licencias y DCO. |
| `reglas/` | Ontología (01), niveles de dominio (02), priorización (03) y rigor (04). |
| `decisiones/registro.md` | Decisiones conceptuales D-001 en adelante. |
| `modelo/` | La parte genérica, que vale para cualquier persona: familias de funciones, casos de prueba y catálogo. |
| `plantillas/` | Plantillas de fichas. |
| `skills/` | Copias de referencia de las skills de Claude. |
| `herramientas/validar.py` | Validador de esquema y reglas (`python herramientas/validar.py`). |
| `app/` | La v1 en construcción: React + TypeScript + Vite, con el núcleo del método y sus pruebas. Ver `app/README.md`. |
| `.github/workflows/` | CI (pruebas en cada push) y despliegue a GitHub Pages. |
| `sistema/` | Diseño (`DISENO.md`) y código del prototipo (`senda.html`). |
| `docs/` | Visión de producto (`vision.md`), arquitectura de la v1 (`arquitectura.md`) y viabilidad (`viabilidad.md`). |

Los datos personales del autor como usuario de Senda (`perfil/`, `datos/`, `notas/`) y sus instrucciones privadas de trabajo con Claude viven en un repositorio privado y están excluidos con `.gitignore`.

## Trabajar desde la nube

Abre una sesión de Claude Code con este repositorio, pídele que lea `ESTADO.md`, `CONTRIBUTING.md` y, si vas a tocar la app, `docs/construccion-v1.md`, y continúa desde la "siguiente acción". Al terminar, haz commit y push. La próxima sesión con acceso a la PC de Omar baja los cambios a la carpeta local.
