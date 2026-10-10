# Senda — diseño del sistema (v0.1)

> Estado: **prototipo v0.1** publicado el 2026-10-10. App: https://claude.ai/artifact/JS7eTwNbd4sACDn6qd5KvZ
> Decisiones que lo sustentan: D-008, D-009 y D-010 (`decisiones/registro.md`).

## Qué es
Un sistema con un modelo detrás: Omar ve su personaje con sus habilidades (estilo juego de simulación), agrega valores y objetivos, el modelo deriva qué habilidades necesita, genera un plan diario y lo va evaluando. El progreso se dibuja como una ruta tipo camino de lecciones.

## Núcleo del modelo (D-008)
Las habilidades se derivan por dos vías:
1. **Objetivo → competencias → habilidades** (con nivel requerido por el criterio de cumplimiento).
2. **Valor → situaciones donde se pone a prueba → habilidades** (independiente de los objetivos).

Cada habilidad derivada de un valor se clasifica como:
- **Indispensable:** la situación es frecuente y fallar cuesta caro. Basta un nivel funcional (2–3).
- **Especializar:** solo si la habilidad multiplica muchas otras o coincide con objetivos activos (nivel 4).

## Progreso: XP y nivel son cosas distintas (D-009)
- **XP (experiencia):** se gana practicando. 1 XP por minuto de sesión, +50 por reto aprobado, +15 por reto intentado, +20 por evidencia registrada. Sube el "nivel de personaje" (cada 500 XP). Es motivación, no dominio.
- **Nivel de habilidad (0–5):** solo cambia con evidencia, según la regla 02.
  - Un **reto aprobado** generado y corregido por Claude cuenta como evidencia externa de tipo evaluación y puede subir **un nivel por reto, hasta 3**.
  - Retos no verificables por texto (hablar, escuchar) quedan como evidencia sin subir nivel.
  - **Niveles 4 y 5** solo se asignan revisando evidencia externa (examen, tercero) con Claude en el chat.
- **Racha:** días seguidos con al menos una sesión completada.

## Ritmo
- Sesiones diarias de lunes a viernes, máximo 60 min (Omar), con 2–4 tareas concretas.
- Sábado: recuperación (terminar lo pendiente).
- Domingo: repaso semanal + reto.
- Rutas de 2 semanas; al terminar, se genera la siguiente con lo aprendido.

## Pantallas (v0.1)
| Pestaña | Qué hace |
|---|---|
| Inicio | Personaje, XP, racha, valores, y la ficha de habilidades agrupada por origen, con nivel, nivel declarado sin evidencia y nivel requerido. Botones "Ponerme a prueba" y "Subir evidencia". |
| Ruta | Camino serpenteante por unidades (semanas). Nodos: sesión, recuperación, repaso, reto. Solo el siguiente nodo está disponible. |
| Valor nuevo | Omar escribe lo que elige vivir → Claude lo clasifica (valor, principio, disposición…), propone la formulación, encuentra 3–5 situaciones y las habilidades que exigen → Omar acepta o desmarca → se crean las habilidades → Claude genera la ruta de 2 semanas. |

## Cambios v0.1.x (comentarios de Omar)
- "Mi brújula" y "Mis límites": valores y principios editables en cualquier momento, con origen visible ("De dónde salió") e historial de cambios. Archivar en vez de borrar.
- Enfoque: pestañas Objetivos / Valores / Todas; se elige uno y se ve su cadena (objetivo → criterio → habilidades; valor → situaciones → habilidades). Valores sin habilidades ofrecen "Derivar habilidades con Claude" sin duplicar el valor.
- Objetivos: se agregan desde "Agregar → Un objetivo" (Claude verifica, afina el criterio y propone habilidades con nivel requerido). Estados en curso / logrado; marcar como logrado exige evidencia (texto + enlace y/o imagen) evaluada por Claude contra cada parte del criterio; si el criterio depende de un resultado externo, una afirmación sin respaldo no aprueba. Solo con evaluación aprobada se habilita "Marcar como logrado" (+100 XP); los intentos fallidos se guardan en `intentos_logro` y el logro en `evidencia_logro`. Se puede reabrir. Los valores no se completan. Regla: todo objetivo responde al menos a un valor; la relación se ve en los dos sentidos (objetivo → valor, valor → objetivos que lo sirven).
- Avatar: tres ilustraciones a elegir o foto propia (recortada a 256 px y guardada en `jugador/estado.avatar_img`).

## Datos (base del artifact)
| Ruta | Contenido |
|---|---|
| `jugador/estado` | xp, racha, ultimo_dia, minutos_dia |
| `valores/<id>` | valores y principios (`tipo`), con `pendiente_ficha: true` si nacieron en la app |
| `habilidades/<id>` | nombre, tipo, clase, grupo, nivel, sospechado, requerido, confianza, xp, estado, fuentes, evidencias, rúbrica |
| `objetivos/<id>` | titulo, enunciado, criterio, fecha_limite, estado, valores |
| `rutas/<id>` | título, origen, unidades → nodos (tipo, título, tareas, habilidades, estado, fecha) |

## Fuente de verdad (D-010)
- **La app** es la fuente operativa de lo que cambia a diario: XP, rutas, retos, evidencias y lo creado desde "Valor nuevo".
- **La carpeta** guarda las reglas, el catálogo y las fichas revisadas.
- **Sincronización:** cuando Omar pida "sincroniza Senda", Claude lee la base del artifact, crea o actualiza las fichas (`pendiente_ficha: true` → ficha creada), revisa niveles con evidencia externa y actualiza `ESTADO.md`.

## Limitaciones conocidas de v0.1
- Evidencias solo como texto o enlace (sin subir archivos).
- Sin recordatorios: se pueden agregar como tarea programada diaria.
- La generación de la ruta siguiente aún no tiene botón propio.
- Áreas de vida pendientes (5) no se piden desde la app.

## Próximos pasos propuestos
1. Probar una semana real y ajustar (Omar).
2. Botón "Generar siguientes 2 semanas" que use lo completado y los repasos.
3. Subida de archivos como evidencia.
4. Recordatorio diario.
5. Migración a app local cuando el diseño se estabilice.
