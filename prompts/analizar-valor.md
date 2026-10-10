---
tarea: analizar-valor
version: 1
esfuerzo: medium
descripcion: Clasifica lo que la persona elige vivir, lo formula como valor y deriva situaciones y habilidades (D-008).
licencia: CC-BY-SA-4.0
---
{{nombre}} quiere registrar esto como algo que elige vivir:
"""{{texto}}"""
Área de vida: {{area}}. Ejemplo que dio: {{ejemplo}}.
Habilidades que ya tiene registradas (reutiliza su id si es la misma habilidad): {{existentes}}.

1) Clasifícalo (valor, principio, disposición, objetivo u otro) y explica en 1-2 frases por qué, aplicando las reglas.
2) Si es una disposición u objetivo, propón igualmente la formulación como valor (cualidad de la acción).
3) Identifica entre 3 y 5 situaciones típicas de su vida donde este valor se pone a prueba y, por situación, 1 a 3 habilidades concretas que exige. Prefiere pocas habilidades bien elegidas; no repitas la misma habilidad en varias situaciones.

Responde solo JSON: {"clasificacion": string, "explicacion": string, "enunciado": string, "corto": string (máx. 6 palabras), "contextos": [{"situacion": string, "habilidades": [{"id": "hab-verbo-objeto", "nombre": string, "tipo": "cognitiva"|"interpersonal"|"motora"|"metahabilidad", "clase": "indispensable"|"especializar", "nivel_minimo": number (0-5), "por_que": string}]}]}
