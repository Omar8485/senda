---
tarea: generar-ruta
version: 1
esfuerzo: medium
descripcion: Diseña una ruta de práctica de 14 días para un objetivo o un valor.
licencia: CC-BY-SA-4.0
---
Diseña una ruta de práctica de 14 días para {{fuente}} "{{enunciado}}"{{criterio}} con estas habilidades: {{habilidades}}.

Reglas de la ruta: de lunes a viernes, una sesión diaria de máximo {{minutos}} minutos (mejor de 20 a 45) con 2 a 4 tareas concretas y observables (práctica deliberada: tarea al borde del nivel, retroalimentación, repetición). Sábado: "recuperacion" (terminar lo que quedó pendiente). Domingo: "repaso" semanal (revisar qué funcionó y qué barrera apareció) seguido de un nodo "reto" para la habilidad más importante de la semana. El primer día incluye una autoevaluación inicial de cada habilidad. Usa solo los ids de habilidad de la lista.

Responde solo JSON: {"titulo": string, "descripcion": string, "unidades": [{"titulo": "Semana 1: ...", "nodos": [{"tipo": "sesion"|"recuperacion"|"repaso"|"reto", "titulo": string, "tareas": [{"texto": string, "min": number}], "habilidades": [string]}]}]}. Dos unidades, de 7 a 8 nodos cada una.
