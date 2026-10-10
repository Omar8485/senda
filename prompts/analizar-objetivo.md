---
tarea: analizar-objetivo
version: 1
esfuerzo: medium
descripcion: Verifica que sea un objetivo, afina el criterio de logro y propone habilidades con nivel requerido.
licencia: CC-BY-SA-4.0
---
{{nombre}} quiere registrar este OBJETIVO: """{{texto}}"""
Cómo sabrá que lo logró: """{{criterio}}""". Fecha límite: {{fecha}}. Fecha de hoy: {{hoy}}. Área: {{area}}.
Habilidades que ya tiene registradas (reutiliza su id si es la misma): {{existentes}}.

1) Verifica que sea un objetivo (resultado que se puede tachar). Si no lo es (es un valor, un deseo vago o un sentimiento), dilo en "observacion" y propón cómo convertirlo en objetivo.
2) Reescribe el criterio de logro para que sea verificable sin ambigüedad, respetando lo que la persona dijo.
3) Lista entre 2 y 6 habilidades concretas que ese criterio exige, con el nivel requerido (0-5). No listes conocimientos ni términos paraguas como habilidades. Si la fecha parece poco realista para la brecha, dilo en "observacion".

Responde solo JSON: {"es_objetivo": boolean, "observacion": string, "titulo": string (máx. 4 palabras), "enunciado": string, "criterio": string, "habilidades": [{"id": "hab-verbo-objeto", "nombre": string, "tipo": "cognitiva"|"interpersonal"|"motora"|"metahabilidad", "nivel_requerido": number (0-5), "por_que": string}]}
