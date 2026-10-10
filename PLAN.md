# Plan por fases — Modelo de habilidades y valores

**Pregunta que guía el proyecto:** ¿cómo representar las capacidades de un ser humano con el rigor suficiente para comprender qué sabe hacer, qué podría aprender y qué le conviene desarrollar? Y luego: ¿cómo conectar ese modelo con los objetivos personales de Omar?

**Principio de orden:** primero los conceptos, después las listas, después la persona. Si se clasifica antes de acordar qué significa cada término, el resultado se ve bien pero es inconsistente.

---

## Mapa de fases

```
Fase 0 ─ Infraestructura ✔
   │
Fase 1 ─ Ontología ✔ ────┬──────────────────────────┐
   │                     │                          │
Fase 2 ─ Familias        │                    Fase 5 ─ Orientación de Omar ◀ en curso
   │                     │                    (puede ir en paralelo con 2-4)
Fase 3 ─ Medición        │                          │
   │                     │                          │
Fase 4 ─ Fundamental vs especializado               │
   │                                                │
   └───────────────┬────────────────────────────────┘
                   │
             Fase 6 ─ Inventario de Omar
                   │
             Fase 7 ─ Estrategia
                   │
             Fase 8 ─ Operación, revisión y visualización (continua)
```

La **Fase 5 no depende de la taxonomía**: se puede hacer en paralelo con las Fases 2–4. Hacerla pronto tiene una ventaja: aporta casos reales para poner a prueba la ontología.

---

## Fase 0 — Infraestructura ✔ *(completada el 2026-10-10)*
**Objetivo:** dejar el proyecto listo para trabajar con método.
**Entregables:** `CLAUDE.md`, reglas 01–04 (borradores), plantillas, registro de decisiones, referencias, auditoría de la conversación de origen, validador, cuatro skills y seis fichas de ejemplo.

## Fase 1 — Ontología ✔ *(cerrada el 2026-10-10)*
**Objetivo:** cerrar las definiciones operativas de cada categoría y el test de clasificación.
**Pregunta que responde:** ¿qué cuenta como habilidad y qué pertenece a otra categoría?
**Trabajo:**
1. Revisar `reglas/01-ontologia.md` y los 20 casos de `modelo/casos-de-prueba.md`; marcar acuerdo o desacuerdo en cada uno.
2. Aceptar o rechazar las decisiones D-001 a D-004.
3. Agregar 5–10 casos difíciles propios (conceptos que hoy te confunden).
**Skill:** `habilidades-clasificar`.
**Criterio de salida:** todos los casos con `✔`, D-001 a D-004 resueltas, y ningún concepto nuevo que el test no pueda clasificar o mandar a "caso abierto" con razón clara.

## Fase 2 — Familias de habilidades
**Objetivo:** organizar las habilidades por las funciones que sirven, sin confundirlas con profesiones, materias o rasgos.
**Trabajo:**
1. Contrastar la semilla `modelo/familias.md` con ESCO y O\*NET.
2. Reclasificar las 20 habilidades de la conversación de origen (`fuentes/auditoria-conversacion-origen.md`).
3. Crear un catálogo semilla de **30–40 fichas mínimas** (id, definición, función, subtipo).
**Skill:** `habilidades-clasificar`.
**Criterio de salida:** ninguna función vacía ni ninguna que absorba más de un tercio del catálogo; cada ficha pasa el validador.

## Fase 3 — Medición del dominio
**Objetivo:** que un nivel describa lo que una persona puede hacer, no lo que cree saber.
**Trabajo:**
1. Revisar la escala 0–5, las cinco dimensiones y los topes de evidencia (`reglas/02-niveles-de-dominio.md`); aceptar o rechazar D-005.
2. Escribir rúbricas específicas para las habilidades que probablemente usarás (empezar por 3).
3. Probar cada rúbrica evaluando un caso real.
**Skill:** `habilidades-evaluar-dominio`.
**Criterio de salida:** 3 rúbricas probadas con evidencia real; la evaluación produce el mismo nivel si se repite con la misma evidencia.

## Fase 4 — Fundamental frente a especializado
**Objetivo:** separar lo que sirve para la autonomía de lo que multiplica el aprendizaje y de lo que depende de un objetivo.
**Trabajo:**
1. Puntuar autonomía y multiplicador (0–3) en todo el catálogo.
2. Proponer las capas genéricas: núcleo, funcional, especialización.
3. Contrastar la hipótesis "lo universal son funciones, no habilidades".
**Criterio de salida:** mapa de capas genérico, con justificación de cada habilidad del núcleo.

## Fase 5 — Mapa de orientación de Omar *(en curso desde el 2026-10-10)*
**Objetivo:** saber qué te importa y qué quieres lograr, con tus propias palabras.
**Trabajo:**
1. Valores por área de vida (las 10 del Valued Living Questionnaire), con importancia y consistencia de la última semana y la prueba del testigo secreto.
2. Principios (tus límites no negociables).
3. Direcciones vitales (opcional).
4. Objetivos activos: **máximo 3–5**, cada uno con criterio de cumplimiento, fecha, valor al que sirve y competencias que exige.
**Skill:** `habilidades-orientacion`.
**Criterio de salida:** cada objetivo activo declara a qué valor sirve; el validador no marca errores.
**Nota:** aprovecha lo que ya trabajaste con el libro de Hayes (capítulos 11–13).

## Fase 6 — Inventario de Omar
**Objetivo:** saber con qué cuentas hoy, con evidencia.
**Trabajo:** evaluar **solo** lo que exigen tus objetivos activos y el núcleo. No se hace un inventario de todo.
**Skill:** `habilidades-evaluar-dominio`.
**Criterio de salida:** cada elemento exigido por un objetivo activo tiene nivel, confianza y al menos una evidencia.

## Fase 7 — Estrategia
**Objetivo:** decidir qué desarrollar, hasta qué nivel, en qué orden y cómo practicarlo.
**Trabajo:**
1. Calcular brechas (requerido − actual).
2. Aplicar las cinco decisiones (desarrollar, mantener, suficiente, delegar, descartar).
3. Respetar el límite de 3 en desarrollo activo (D-006).
4. Diseñar un plan de práctica de 90 días con acción comprometida semanal.
**Skill:** `habilidades-estrategia`.
**Criterio de salida:** `perfil/estrategia/plan-AAAA-TN.md` con máximo 3 habilidades en desarrollo, cada una con práctica, retroalimentación y evidencia esperada.

## Fase 8 — Operación, revisión y visualización *(continua)*
**Objetivo:** que el modelo se use y no se convierta en un documento muerto.
**Trabajo:**
1. Revisión semanal (5 minutos) y trimestral (regla 03 §7).
2. Ejecutar el validador en cada revisión.
3. Visualización: un árbol interactivo generado a partir de las fichas (mapa de orientación, mapa de desarrollo y brechas).
4. Evaluar si el modelo sirve para otras personas (otro `perfil/`).
**Skill:** `habilidades-estrategia` (modo revisión).

---

## Línea de sistema: Senda (desde 2026-10-10)
Omar definió que el resultado final es un **sistema tipo videojuego** sobre el modelo: personaje con habilidades, valores que generan habilidades, plan diario, retos y ruta visual. Diseño en `sistema/DISENO.md`; decisiones D-008 a D-010.
- **v0.1 (publicada):** inicio con personaje, ruta, valor nuevo con análisis de Claude, retos. Datos reales de Omar sembrados.
- **v0.2 (siguiente):** ajustes tras una semana de uso, generación de la ruta siguiente, subida de archivos, recordatorio diario.
- **v1 local:** migración cuando el diseño se estabilice.

Las Fases 2–4 (taxonomía, medición, capas) siguen siendo necesarias, pero ahora se alimentan del uso real del sistema.

## Estado actual
El estado vivo del proyecto (fase, progreso, pendientes, bitácora) está en **`ESTADO.md`**.
