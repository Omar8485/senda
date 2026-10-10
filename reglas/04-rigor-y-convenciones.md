# Regla 04 — Rigor y convenciones

## 1. Reglas epistemológicas

1. **Todo es provisional y versionado.** Ninguna definición es "la verdad"; es la mejor versión actual. Cada regla tiene número de versión y estado.
2. **Las fuentes se citan.** Cuando una definición se apoya en un marco existente (O\*NET, ESCO, EQF, Dreyfus, ACT, Schwartz), se indica. Cuando es una propuesta propia, se dice que es propia. Ver `fuentes/referencias.md`.
3. **Discrepar con las fuentes está permitido**, pero se registra la razón en el registro de decisiones.
4. **Ningún nivel sin evidencia.** Ver regla 02.
5. **No forzar clasificaciones.** Si un concepto no encaja, se registra como caso abierto. Un caso abierto es más útil que una clasificación falsa.
6. **Cambios a la ontología solo por decisión registrada.** Cualquier cambio a las reglas 01–03 pasa por `decisiones/registro.md` con: contexto, opciones consideradas, decisión, consecuencias y estado (`propuesta` → `aceptada` / `rechazada`). Solo Omar acepta decisiones.
7. **Los casos de prueba son la red de seguridad.** Después de cambiar una regla, se revisan todos los casos de `modelo/casos-de-prueba.md`. Si alguno cambia de categoría, el cambio se discute.

## 2. Límites del modelo

- El modelo **no es un instrumento psicológico validado**. Sirve para pensar y decidir, no para diagnosticar.
- **No se infieren rasgos de personalidad** a partir de conversaciones. Las disposiciones solo se registran si Omar las declara.
- El trabajo con valores **no es terapia**. Se usan herramientas de ACT como marco de reflexión; si aparece material doloroso (duelos, crisis), se puede omitir el ejercicio y se recomienda acompañamiento profesional.
- Los valores son **de Omar**. Claude puede preguntar, contrastar y señalar posibles mandatos ajenos, pero nunca proponer qué valores debería tener.

## 3. Convenciones de archivos

- **Idioma:** español neutro. Sin voseo.
- **Una ficha por entidad**, en Markdown con encabezado YAML (ver `plantillas/`).
- **Identificadores:** `prefijo-nombre-en-kebab-case`, sin tildes ni eñes.

| Prefijo | Entidad | Carpeta |
|---|---|---|
| `hab-` | habilidad | `modelo/catalogo/habilidades/` |
| `comp-` | competencia | `modelo/catalogo/competencias/` |
| `con-` | conocimiento | `modelo/catalogo/conocimientos/` |
| `campo-` | campo | `modelo/catalogo/campos/` |
| `val-` | valor | `perfil/orientacion/valores/` |
| `prin-` | principio | `perfil/orientacion/principios/` |
| `dir-` | dirección vital | `perfil/orientacion/direcciones/` |
| `obj-` | objetivo | `perfil/orientacion/objetivos/` |
| `inv-` | registro de inventario (nivel + evidencias) | `perfil/inventario/` |

- **El nombre del archivo es el identificador:** `hab-negociar-acuerdos.md`.
- **Fechas** en formato ISO: `2026-10-10`.
- **Referencias** entre fichas siempre por identificador, nunca por nombre.
- **Validación:** antes de cerrar una sesión de trabajo, ejecutar `python herramientas/validar.py`. Requiere `pip install pyyaml`.
