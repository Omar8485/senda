---
name: habilidades-clasificar
description: Usar en el Modelo de Habilidades de Omar cuando hay que decidir qué es un concepto (habilidad, conocimiento, competencia, campo, disposición, aptitud, valor, principio, objetivo) o crear o revisar una ficha del catálogo.
---

# Clasificar un concepto y crear su ficha

Aplica la ontología del modelo a un concepto y, si corresponde, crea su ficha. El objetivo es que dos conceptos de categorías distintas nunca terminen en la misma lista.

## Dónde está el modelo

Carpeta del usuario `MODELO HABILIDADES` (en Windows: `C:\Users\omar_\Documents\MODELO HABILIDADES`). Si no tienes acceso a la carpeta, usa los documentos del proyecto "Modelo de Decisión: Habilidades y Valores" (empieza por `claude/ESTADO.md`) y entrega la ficha en el chat para que Omar la guarde.

Lee antes de empezar:
- `ESTADO.md` (dónde va el proyecto)
- `reglas/01-ontologia.md` (definiciones y test, §5)
- `modelo/casos-de-prueba.md` (precedentes)
- `modelo/familias.md` (funciones válidas)

## Pasos

1. **Reformula el concepto** tal como lo dijo Omar y pregunta por el sentido solo si hay ambigüedad real que cambie la categoría.
2. **Paso 0 — ¿paraguas?** Si tiene varios sentidos razonables, enuméralos y clasifica cada sentido por separado. No registres el término paraguas como ficha.
3. **Aplica el test en orden** (regla 01 §5). Para cada paso, escribe una línea con la respuesta y por qué. La primera respuesta afirmativa decide.
4. **Si resulta HABILIDAD**, verifica explícitamente los cuatro tests (entrenable, aislable con un ejercicio de < 1 h, evaluable por la huella que deja, disociable del conocimiento). Si falla alguno, revisa si es competencia, aptitud o paraguas.
5. **Compara con los casos de prueba.** Si tu clasificación contradice un caso existente, **detente**: explica la contradicción y propón una entrada `D-NNN` en `decisiones/registro.md` con estado `propuesta`. No cambies reglas ni casos por tu cuenta.
6. **Si no encaja en nada**, regístralo en "Casos abiertos" del registro de decisiones. No fuerces.
7. **Crea la ficha** solo si pertenece al mapa de desarrollo (habilidad, competencia, conocimiento, campo):
   - Copia la plantilla de `plantillas/`.
   - Identificador con prefijo y kebab-case sin tildes; nombre del archivo = id.
   - Habilidad: verbo + objeto; subtipo; funciones (ids de `modelo/familias.md`); importancia `autonomia` y `multiplicador` (0–3) puntuadas **por separado** con una frase de justificación en el cuerpo.
   - Competencia: resultado + contexto; componentes con nivel mínimo (habilidades 0–5, conocimientos 0–3).
   - Estado `borrador`, versión 1. Cita la fuente si existe (`onet:`, `esco:`).
   - Busca si ya existe una ficha equivalente antes de crear otra.
   - Valores, principios y objetivos **no** van al catálogo: derívalos a la skill `habilidades-orientacion`.
8. **Valida:** `python herramientas/validar.py`. Corrige errores.
9. **Si fue un caso difícil**, propón agregarlo a `modelo/casos-de-prueba.md` con acuerdo `?`.

## Formato de respuesta

```
Concepto: ...
¿Paraguas?: sí/no (sentidos: ...)
Clasificación: CATEGORÍA (subtipo)
Razón: paso N del test — ...
Tests de habilidad: entrenable ✔/✘ · aislable ✔/✘ · evaluable ✔/✘ · disociable ✔/✘
Ficha: creada / no corresponde / pendiente de tu decisión
Dudas para ti: (solo si las hay)
```

## Errores que debes atrapar

- Propiedades presentadas como habilidad ("transferencia", "consistencia").
- Competencias presentadas como habilidad ("gestión financiera personal").
- Disposiciones presentadas como habilidad ("paciencia", "proactividad").
- Estados emocionales presentados como valor ("estar tranquilo").
- Usar "capacidad" como categoría.

## Guardar el estado (después de cada avance)

Omar retoma el proyecto desde distintos chats. Ningún avance se da por terminado hasta guardarlo:
1. Actualiza `ESTADO.md`: progreso de la fase, notas de lo conversado que aún no está en fichas, decisiones pendientes, siguiente acción y una línea en la bitácora.
2. Escribe los archivos cambiados en la carpeta **y** en los documentos del proyecto con la misma ruta (CLAUDE.md, PLAN.md y ESTADO.md viven en `claude/`).
