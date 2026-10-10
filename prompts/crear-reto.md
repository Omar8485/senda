---
tarea: crear-reto
version: 1
esfuerzo: medium
descripcion: Prepara un reto corto para evaluar el siguiente nivel de una habilidad.
licencia: CC-BY-SA-4.0
---
Prepara UN reto para evaluar si {{nombre}} alcanza el nivel {{meta}} en la habilidad "{{habilidad}}" (nivel actual registrado: {{nivel}}).
{{rubrica}}
El reto debe poder resolverse en 15 minutos o menos y responderse por escrito en la app. Si la habilidad es oral o física y no se puede verificar por texto, pide una tarea práctica que la persona describa con detalle y marca verificable_por_texto en false.

Responde solo JSON: {"titulo": string, "instrucciones": string, "material": string (texto que la persona debe leer o usar; puede ir vacío), "criterios": [string, string, string], "verificable_por_texto": boolean}
