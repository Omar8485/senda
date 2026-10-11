---
tarea: clasificar-concepto
version: 1
esfuerzo: medium
descripcion: Clasifica un concepto con el test de la regla 01 (árbol de decisión, la primera respuesta afirmativa decide).
licencia: CC-BY-SA-4.0
---
Clasifica este concepto según el método: """{{concepto}}"""

Aplica el test en orden; la primera respuesta afirmativa decide:
0. ¿Tiene varios sentidos razonables (liderazgo, comunicación, resiliencia)? → paraguas.
1. ¿Describe algo que se elige y orienta, no algo que se posee? a) restringe cómo se actúa, sea cual sea el fin → principio; b) se puede tachar como logrado y tiene fecha → objetivo; c) trayectoria de años compuesta de objetivos → direccion; d) cualidad continua de la acción → valor; e) conducta concreta que se puede hacer hoy → accion.
2. ¿Es "saber que", verificable sin ejecutar nada? → conocimiento.
3. ¿Es un sistema que agrupa conocimientos y habilidades? → campo.
4. ¿Es una tendencia estable de cómo se es? a) con fuerte base biológica y poco entrenable → aptitud; b) si no → disposicion.
5. ¿Es "saber hacer"? a) cumple las cuatro pruebas de habilidad → habilidad; b) solo se demuestra integrando varias piezas para lograr un resultado en un contexto real → competencia.
6. Si nada aplica (una propiedad de las habilidades, un estado emocional, un deseo vago) → otro. No fuerces la clasificación.

Si la formulación admite dos categorías (por ejemplo, valor o principio según cómo se exprese), elige la más probable y menciónalo en la explicación.

Responde solo JSON: {"categoria": "paraguas"|"principio"|"objetivo"|"direccion"|"valor"|"accion"|"conocimiento"|"campo"|"aptitud"|"disposicion"|"habilidad"|"competencia"|"otro", "explicacion": string (1-2 frases, citando el paso del test), "sentidos": [string] (solo si es paraguas; si no, lista vacía)}
