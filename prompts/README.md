# Prompts de Senda

Cada tarea que usa un modelo de IA tiene aquí su prompt, versionado y fuera del código (docs/arquitectura.md §4). Cualquiera puede mejorarlos, y el banco de pruebas (fase B.2) medirá cada cambio.

## Formato

Markdown con encabezado YAML:

```
---
tarea: evaluar-reto        # igual al nombre del archivo
version: 1                 # súbela en cada cambio que altere el comportamiento
esfuerzo: high             # low | medium | high: cuánto razona el modelo (si el proveedor lo admite)
descripcion: Qué hace la tarea.
licencia: CC-BY-SA-4.0
---
Texto del prompt con {{variables}}.
```

- `reglas.md` es el mensaje de sistema de todas las tareas: resume las reglas del método (`reglas/01` a `03`).
- Las variables `{{asi}}` las completa la app (`app/src/modelos/prompts.ts`). Si falta una, la app falla en lugar de enviar un prompt incompleto.
- La forma de la respuesta se describe en el prompt **y** se valida en la app con un esquema (`app/src/modelos/salidas.ts`). Si cambias los campos de un JSON, cambia los dos y sube la versión.
- Cada evaluación queda firmada con `tarea@version` del prompt y de las reglas, más el proveedor y el modelo que la hizo.

## Tareas

| Archivo | Qué hace |
|---|---|
| `analizar-valor.md` | Clasifica lo que la persona elige vivir, lo formula como valor y deriva situaciones → habilidades (D-008) |
| `analizar-objetivo.md` | Verifica que sea un objetivo, afina el criterio de logro y propone habilidades con nivel requerido |
| `generar-ruta.md` | Diseña una ruta de práctica de 2 semanas |
| `crear-reto.md` | Prepara un reto corto para el siguiente nivel de una habilidad |
| `evaluar-reto.md` | Evalúa la respuesta a un reto (el núcleo aplica después los topes de D-009) |
| `evaluar-logro.md` | Evalúa si la evidencia demuestra el criterio de un objetivo |
