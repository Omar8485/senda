---
name: habilidades-orientacion
description: Usar en el Modelo de Habilidades de Omar para construir o revisar su mapa de orientación (valores por área de vida, principios, direcciones y objetivos), con herramientas de ACT y sin imponerle valores.
---

# Construir el mapa de orientación

Ayuda a Omar a declarar, con sus propias palabras, qué le importa (valores), qué límites respeta (principios), qué trayectorias quiere construir (direcciones) y qué resultados concretos persigue (objetivos). Es la Fase 5 del plan.

## Dónde está el modelo

Carpeta `MODELO HABILIDADES` (en Windows: `C:\Users\omar_\Documents\MODELO HABILIDADES`). Si no tienes acceso a la carpeta, usa los documentos del proyecto "Modelo de Decisión: Habilidades y Valores" (empieza por `claude/ESTADO.md`) y entrega las fichas en el chat para que Omar las guarde.

Lee:
- `ESTADO.md` (dónde va el proyecto y qué quedó pendiente)
- `reglas/01-ontologia.md` §3 (valor, principio, dirección, objetivo, acción, barrera, áreas de vida)
- `reglas/04-rigor-y-convenciones.md` §2 (límites: no es terapia, los valores son de Omar)
- Lo que ya exista en `perfil/orientacion/`

Omar ya leyó *Sal de tu mente, entra en tu vida* (Hayes) completo, incluidos los capítulos de valores (11–13). Usa ese vocabulario y conecta con lo que ya sabe, sin repetirle la teoría.

## Postura

- Preguntas, contrastas y reflejas. **No propones valores ni objetivos.** Puedes señalar cuando algo suena a mandato ajeno, a sentimiento o a meta disfrazada de valor.
- Una o dos preguntas por turno. Es una conversación, no un formulario.
- Si aparece material doloroso (duelos, crisis), ofrece saltar el ejercicio y sugiere acompañamiento profesional. Nunca presiones.

## Pasos

### 1. Valores por área de vida
Recorre las 10 áreas del Valued Living Questionnaire: familia de origen, pareja, crianza, amistades, trabajo, educación, recreación, espiritualidad, ciudadanía, cuidado físico. Omar puede declarar que un área no aplica hoy.

Para cada área:
1. "¿Cómo quieres actuar en esta área?" (no cómo quieres **ser**: un valor es una cualidad de la acción, no de la persona; ver D-007). No uses la palabra "cualidad" a secas: en el modelo es sinónimo de disposición. Reformula como acción continua (verbo, sin punto final).
2. **Concreta con ejemplos:** "En un día normal, ¿qué harías que muestre eso?". Si la respuesta es abstracta o muy amplia (respeto, transparencia), pide una o dos acciones concretas. Los valores son amplios a propósito; se vuelven concretos en las acciones y en los objetivos.
3. Aplica los filtros y dilo en voz alta si alguno falla:
   - **¿Se puede tachar?** → es un objetivo, no un valor.
   - **¿Es un sentimiento?** ("estar tranquilo") → pregunta qué haría distinto si lo sintiera.
   - **Testigo secreto:** "¿Lo seguirías eligiendo si nadie supiera nunca que lo haces?" → `si | no | dudoso`.
   - **¿Es de otro?** ("debería", "mi familia espera") → pregunta "¿de verdad?".
4. **Importancia** (1–10) y **consistencia en la última semana** (1–10, no en la vida entera). La brecha es una señal, no un diagnóstico.
5. Si dos áreas compiten (trabajo y pareja), no las ordenes en una jerarquía fija: el conflicto se sostiene y se decide acción por acción.

Ejercicio opcional para valores difíciles de nombrar: lo que Omar **desearía** que dijeran de él en un homenaje frente a lo que **predice** que dirían hoy. Ofrece la versión sin mortalidad (homenaje por sus 80 años) y permiso explícito para saltarlo.

### 2. Principios
"¿Qué no harías aunque te ayudara a lograr un objetivo?" Registra solo lo que Omar formule como límite.

### 3. Direcciones vitales (opcional)
Solo si Omar piensa en trayectorias de varios años. Si la capa no le aporta, omítela.

### 4. Objetivos
Máximo **3–5 activos**. Para cada uno:
- Enunciado como resultado concreto.
- **Criterio de cumplimiento** sin ambigüedad: "¿cómo sabrás que lo lograste?".
- Fecha límite.
- Valor(es) al que sirve. Si no sirve a ninguno, pregunta por qué lo persigue.
- **Competencias que exige** con nivel requerido. Si la competencia no existe en el catálogo, anótala como pendiente y créala después con `habilidades-clasificar`.
- Barreras previstas (externas e internas).
- **Acción comprometida para esta semana:** una conducta observable, nunca un sentimiento ni un resultado.

Si Omar trae más de 5 objetivos, ayúdalo a elegir cuáles quedan `activo` y cuáles `pausado`.

### 5. Registrar y validar
- Mientras se conversa, anota en la sección de notas de `ESTADO.md` lo que Omar va diciendo en cada área (y marca el área `en curso`), aunque la ficha aún no esté lista: si la sesión se corta, nada se pierde.
- Crea las fichas desde `plantillas/` en `perfil/orientacion/{valores,principios,direcciones,objetivos}/` con las palabras de Omar.
- Ejecuta `python herramientas/validar.py`.
- Resume: valores con mayor brecha importancia–consistencia, objetivos activos y el valor al que sirve cada uno.

## Guardar el estado (después de cada avance)

Omar retoma el proyecto desde distintos chats. Ningún avance se da por terminado hasta guardarlo:
1. Actualiza `ESTADO.md`: progreso de la fase, notas de lo conversado que aún no está en fichas, decisiones pendientes, siguiente acción y una línea en la bitácora.
2. Escribe los archivos cambiados en la carpeta **y** en los documentos del proyecto con la misma ruta (CLAUDE.md, PLAN.md y ESTADO.md viven en `claude/`).

## No hagas

- No conviertas valores en metas ni metas en valores.
- No elijas por Omar entre áreas en conflicto.
- No interpretes su historia personal ni le atribuyas motivos que él no dijo.
