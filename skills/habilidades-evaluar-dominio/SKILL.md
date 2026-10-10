---
name: habilidades-evaluar-dominio
description: Usar en el Modelo de Habilidades de Omar para asignar o revisar su nivel de dominio en una habilidad (0-5) o conocimiento (0-3) a partir de evidencia concreta, y registrarlo en el inventario.
---

# Evaluar el nivel de dominio con evidencia

Asigna un nivel que describa lo que Omar **puede hacer de forma demostrable**, no lo que cree saber. La honestidad es el valor de esta skill: un nivel inflado arruina la estrategia.

## Dónde está el modelo

Carpeta `MODELO HABILIDADES` (en Windows: `C:\Users\omar_\Documents\MODELO HABILIDADES`). Si no tienes acceso a la carpeta, usa los documentos del proyecto "Modelo de Decisión: Habilidades y Valores" (empieza por `claude/ESTADO.md`) y entrega las fichas en el chat para que Omar las guarde.

Lee:
- `ESTADO.md` (dónde va el proyecto y qué quedó pendiente)
- `reglas/02-niveles-de-dominio.md` (escala, cinco dimensiones, topes por evidencia, vigencia)
- La ficha de la habilidad en `modelo/catalogo/` (su rúbrica específica)

Si la ficha no existe, crea primero la ficha con la skill `habilidades-clasificar`. Si no tiene rúbrica específica, evalúa con la escala genérica y la confianza no puede ser `alta`.

## Pasos

1. **Delimita el contexto.** ¿En qué contexto importa esta habilidad para los objetivos activos de Omar? Si se comporta distinto en contextos distintos, evalúa por contexto.
2. **Recoge evidencia con preguntas conductuales**, una o dos a la vez, nunca un cuestionario largo:
   - "¿Cuándo fue la última vez que hiciste esto? ¿Qué hiciste exactamente y qué resultado tuvo?"
   - "¿Alguien más vio o evaluó el resultado? ¿Qué dijo?"
   - "¿Lo has hecho en otro contexto distinto? ¿Salió igual?"
   - "¿Qué fue lo más difícil que has resuelto con esta habilidad?"
   - "¿Cuándo decidiste no usarla, o la usaste y no convenía?" (juicio)
   Pide productos concretos cuando existan (un archivo, un enlace, un resultado medible).
3. **Clasifica cada evidencia:** tipo (`producto`, `resultado`, `retroalimentacion`, `evaluacion`, `autoobservacion`, `formacion`), contexto, si es externa y fecha. La `formacion` (cursos, lecturas, horas) se registra pero no cuenta como evidencia de ejecución.
4. **Analiza las cinco dimensiones** (autonomía, consistencia, complejidad, transferencia, juicio) con una línea cada una.
5. **Propón el nivel** que describe el conjunto, compáralo con la rúbrica específica y **aplica los topes de evidencia**. Si la evidencia no alcanza, registra el nivel justificado y anota `nivel_sospechado`.
6. **Asigna confianza:** `baja` (solo autoobservación), `media` (evidencia propia en varios contextos), `alta` (evidencia externa).
7. **Di el resultado sin suavizarlo.** Si Omar se percibe más alto, explica qué evidencia falta y cómo conseguirla. Si se percibe más bajo de lo que muestra la evidencia, dilo también.
8. **Registra** en `perfil/inventario/inv-<id-de-la-ficha>.md` desde `plantillas/inventario.md`. Si ya existe, agrega la evidencia nueva sin borrar la anterior y actualiza `ultima_revision`. Deja `decision: pendiente` salvo que se esté en la Fase 7.
9. **Valida:** `python herramientas/validar.py`.

## Formato de respuesta

```
Habilidad: hab-... (contexto: ...)
Evidencias: N (externas: N, contextos distintos: N)
Dimensiones: autonomía ... · consistencia ... · complejidad ... · transferencia ... · juicio ...
Nivel: X (confianza: ...)   Sospechado: Y — falta: ...
Siguiente evidencia que subiría el nivel: ...
```

## Guardar el estado (después de cada avance)

Omar retoma el proyecto desde distintos chats. Ningún avance se da por terminado hasta guardarlo:
1. Actualiza `ESTADO.md`: progreso de la fase, notas de lo conversado que aún no está en fichas, decisiones pendientes, siguiente acción y una línea en la bitácora.
2. Escribe los archivos cambiados en la carpeta **y** en los documentos del proyecto con la misma ruta (CLAUDE.md, PLAN.md y ESTADO.md viven en `claude/`).

## No hagas

- No asignes niveles por horas, cursos o certificados de conocimiento.
- No promedies dimensiones para subir el nivel.
- No evalúes todo de una vez: en la Fase 6 solo se evalúa lo que exigen los objetivos activos y el núcleo.
- No infieras rasgos de personalidad a partir de las respuestas.
