---
name: habilidades-estrategia
description: Usar en el Modelo de Habilidades de Omar para conectar sus objetivos con su inventario - calcular brechas, decidir qué desarrollar, armar el plan de práctica trimestral o hacer la revisión semanal o trimestral.
---

# Estrategia: de los objetivos a la práctica

Decide qué desarrollar, hasta qué nivel, en qué orden y cómo, respetando que el tiempo es limitado. Fases 7 y 8 del plan.

## Dónde está el modelo

Carpeta `MODELO HABILIDADES` (en Windows: `C:\Users\omar_\Documents\MODELO HABILIDADES`). Si no tienes acceso a la carpeta, usa los documentos del proyecto "Modelo de Decisión: Habilidades y Valores" (empieza por `claude/ESTADO.md`) y entrega las fichas en el chat para que Omar las guarde.

Lee:
- `ESTADO.md` (dónde va el proyecto y qué quedó pendiente)
- `reglas/03-priorizacion-y-estrategia.md` (flujo, cinco decisiones, límite de 3, criterios, práctica, revisión)
- `perfil/orientacion/objetivos/` (solo `estado: activo`), `perfil/orientacion/principios/`
- `perfil/inventario/` y las fichas del catálogo referidas

Requisitos: al menos un objetivo activo con `exige` completo, y nivel registrado para cada elemento exigido. Si falta algo, dilo y deriva a `habilidades-orientacion` o `habilidades-evaluar-dominio`.

## Modo A — Plan trimestral

1. **Desglosa** cada objetivo activo: competencias exigidas → componentes de cada competencia (habilidades 0–5, conocimientos 0–3) con nivel requerido. Si el mismo componente aparece en varios objetivos, usa el nivel requerido más alto y anota los objetivos.
2. **Calcula brechas:** requerido − actual. Marca los niveles con confianza baja o "en riesgo" por falta de práctica: la brecha real puede ser mayor.
3. **Propón una decisión** por elemento: desarrollar, mantener, suficiente, delegar o descartar por ahora. Considera también candidatos del núcleo (multiplicador alto) y los que Omar elija por valor intrínseco, declarados como tales.
4. **Ordena las candidatas a "desarrollar"** con los criterios B, M, A, V, C (0–3) y el puntaje orientativo `P = 2·B + M + A + V − C`. Muestra la tabla. Si el orden choca con la intuición de Omar, examinen juntos por qué y registren la conclusión.
5. **Aplica el límite:** máximo 3 en "desarrollar" y máximo 1 subida desde nivel 3 o superior. Las que queden fuera pasan a "descartar por ahora" con fecha de revisión.
6. **Revisa los principios:** ninguna estrategia puede violar un principio declarado.
7. **Diseña la práctica** de cada habilidad en desarrollo: tarea al borde del nivel actual, fuente de retroalimentación, frecuencia, evidencia que producirá para justificar el siguiente nivel y acción comprometida para esta semana.
8. **Registra:** `perfil/estrategia/plan-AAAA-TN.md` (por ejemplo `plan-2026-T4.md`) y actualiza `decision` en cada ficha de inventario. Valida con `python herramientas/validar.py`.

## Modo B — Revisión semanal (5 minutos)

1. ¿Se hicieron las acciones comprometidas?
2. Si no: ¿qué barrera apareció? Sin juicio: romper un compromiso es parte del proceso; lo que se entrena es retomarlo.
3. Acción comprometida para la semana siguiente.
4. Si surgió evidencia nueva, regístrala en el inventario.

## Modo C — Revisión trimestral

1. Estado de cada objetivo (activo, logrado, pausado, abandonado) y si siguen sirviendo a los mismos valores.
2. Actualiza niveles con la evidencia del trimestre (usa `habilidades-evaluar-dominio`).
3. Rehaz el Modo A completo.
4. Pregunta qué aprendió Omar sobre el propio modelo: si alguna regla estorbó, propón una decisión `D-NNN`.

## Guardar el estado (después de cada avance)

Omar retoma el proyecto desde distintos chats. Ningún avance se da por terminado hasta guardarlo:
1. Actualiza `ESTADO.md`: progreso de la fase, notas de lo conversado que aún no está en fichas, decisiones pendientes, siguiente acción y una línea en la bitácora.
2. Escribe los archivos cambiados en la carpeta **y** en los documentos del proyecto con la misma ruta (CLAUDE.md, PLAN.md y ESTADO.md viven en `claude/`).

## No hagas

- No agregues habilidades porque sí: cada una debe cerrar una brecha, pertenecer al núcleo o elegirse por valor intrínseco.
- No presentes el puntaje como veredicto.
- No planifiques en torno a subir aptitudes ni a "cambiar la personalidad"; tradúcelo a habilidades entrenables.
