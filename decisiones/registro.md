# Registro de decisiones

Cada decisión conceptual que cambie o fije las reglas se registra aquí. Solo Omar mueve una decisión de `propuesta` a `aceptada` o `rechazada`.

Formato: **Contexto** · **Opciones** · **Decisión** · **Consecuencias** · **Estado**

---

## D-001 — Dos mapas conectados por una estrategia, y separación modelo/perfil
- **Contexto:** valores, objetivos, competencias y habilidades se mezclaban como si fueran nodos del mismo árbol.
- **Opciones:** (a) un único árbol de habilidades estilo videojuego; (b) dos mapas (orientación y desarrollo) conectados por una estrategia.
- **Decisión:** (b). Además, `modelo/` contiene lo genérico y `perfil/` la instancia de Omar.
- **Consecuencias:** las habilidades nunca aparecen en el mapa de orientación ni los valores en el de desarrollo. El modelo podría usarse con otra persona creando otro `perfil/`.
- **Estado:** **aceptada** (2026-10-10). Omar aceptó los dos mapas en la conversación original y avanzó sobre esta estructura.

## D-002 — Los procesos mentales cuentan como habilidad si son entrenables y dejan huella evaluable
- **Contexto:** pregunta abierta con que cerró la conversación original: ¿una habilidad es solo lo que se ejecuta de forma observable o incluye analizar, planificar, decidir?
- **Opciones:** (a) solo ejecuciones observables (modelo estrecho, deja fuera lo esencial); (b) todo proceso mental (modelo inflado: "recordar" o "percibir" serían habilidades); (c) procesos mentales sí, siempre que cumplan los cuatro tests de la regla 01 §2.2.
- **Decisión:** (c). Lo que no cumpla los tests probablemente es una aptitud.
- **Consecuencias:** "priorizar tareas" es habilidad (deja una lista evaluable); "memoria de trabajo" es aptitud.
- **Refinamiento de Omar (incorporado en regla 01 v0.2):** (1) la frontera entre función biológica y habilidad está en el **método**: recordar es aptitud, usar mnemotecnias es habilidad; (2) en dominios complejos la acción observable es solo la huella del proceso mental, así que separar pensar y hacer es una falsa dicotomía; (3) un proceso mental es habilidad si se descompone en una técnica aprendible, mejorable con práctica deliberada y medible por sus resultados.
- **Matiz de Claude al refinamiento:** el criterio de "técnica descomponible" se aplica al **aprendizaje**, no a la **verbalización**: en niveles expertos (Dreyfus) la técnica se vuelve tácita y el experto puede no saber explicarla; eso no la excluye. Y "pensamiento crítico" se trata como paraguas (caso 23), no como una habilidad única.
- **Estado:** **aceptada** (2026-10-10).

## D-003 — "Capacidad" no es una categoría del modelo
- **Contexto:** en la conversación original "capacidad" se usó con dos sentidos: aptitud con base biológica y "lo que puedo lograr en ciertas condiciones" (que es una competencia).
- **Opciones:** (a) mantenerla con definición propia; (b) eliminarla como categoría y usar aptitud o competencia.
- **Decisión:** (b).
- **Consecuencias:** se gana precisión; se pierde una palabra cómoda del lenguaje cotidiano, que sigue usándose fuera de las fichas.
- **Estado:** **aceptada** (2026-10-10).

## D-004 — Valores en sentido ACT y principios como categoría aparte
- **Contexto:** Omar planteó que los valores le parecen universales y dudó si lo universal serían los principios.
- **Opciones:** (a) valores universales definidos de antemano; (b) valores personales elegidos (ACT) más principios como restricciones normativas.
- **Decisión:** (b). Lo que tiende a ser universal son ciertos principios éticos y la estructura de tipos de valores (Schwartz); las prioridades y la forma concreta de cada valor son personales.
- **Consecuencias:** el mapa de orientación tiene valores (direcciones) y principios (límites). La estrategia nunca puede violar un principio, aunque mejore un objetivo.
- **Estado:** **aceptada** (2026-10-10).

## D-007 — Valor como cualidad de la acción, no de la persona
- **Contexto:** al preguntar en la Fase 5 "¿qué cualidad quieres que tenga tu forma de actuar?", Omar señaló la confusión: en la regla 01 "cualidad" es sinónimo de disposición, así que la pregunta parecía pedir disposiciones o habilidades. También señaló que los valores resultan muy abiertos y subjetivos.
- **Opciones:** (a) dejar la pregunta como estaba; (b) distinguir explícitamente cualidad de la acción (valor) de cualidad de la persona (disposición), preguntar "cómo quieres actuar" y anclar cada valor en acciones concretas de un día normal.
- **Decisión:** (b). Regla 01 §3.1 v0.3 y skill `habilidades-orientacion` actualizadas.
- **Consecuencias:** "ser respetuoso" se reformula como "actuar con respeto"; cada valor se registra con ejemplos de acciones concretas para que no quede abstracto.
- **Estado:** **aceptada** (2026-10-10). Surgió de una observación de Omar.

## D-008 — Los valores también generan habilidades, a través de situaciones
- **Contexto:** Omar definió el núcleo del modelo: desarrollar las habilidades que le permitan alcanzar sus objetivos **y seguir su dirección (valores) independientemente de los objetivos**. Ejemplo: la puntualidad exige estimar tiempos, decidir el medio de transporte, recortar un proyecto al mínimo viable, avisar a tiempo.
- **Decisión:** dos vías de derivación: objetivo → competencias → habilidades, y valor → situaciones donde se pone a prueba → habilidades. Cada habilidad derivada de un valor se clasifica como indispensable (situación frecuente y costosa de fallar; nivel 2–3) o especializar (multiplica otras o coincide con objetivos; nivel 4).
- **Consecuencias:** las fichas de valor guardan sus situaciones; la estrategia (regla 03) suma las habilidades indispensables de los valores a las candidatas, respetando el límite de 3 en desarrollo activo.
- **Estado:** **aceptada** (2026-10-10, propuesta por Omar).

## D-009 — XP separado del nivel; retos de Claude como evidencia con tope 3
- **Contexto:** el sistema será tipo videojuego. Si practicar subiera el nivel, el nivel dejaría de significar dominio.
- **Decisión:** el XP mide práctica (minutos, retos, evidencias) y sube el nivel de personaje; el nivel de cada habilidad solo cambia con evidencia. Un reto aprobado, generado y corregido por Claude, cuenta como evidencia externa de evaluación: sube como máximo un nivel por reto y hasta 3. Los retos no verificables por texto quedan como evidencia sin subir nivel. Los niveles 4–5 exigen evidencia externa revisada en el chat.
- **Estado:** separación XP/nivel **aceptada** por Omar (2026-10-10); los topes de los retos son **propuesta** de Claude.

## D-010 — Plataforma: app en claude.ai primero, migración local después
- **Contexto:** Omar eligió empezar en claude.ai y migrar a una app local cuando el diseño esté estable.
- **Decisión:** prototipo "Senda" como artifact con base de datos y consultas a Claude. La app es la fuente operativa de lo diario (XP, rutas, retos, evidencias); la carpeta guarda reglas, catálogo y fichas revisadas; Claude sincroniza a pedido.
- **Estado:** **aceptada** (2026-10-10).

## D-005 — Escala 0–5 anclada en Dreyfus, con topes por evidencia
- **Contexto:** la escala 1–5 de la conversación original no tenía nivel 0 ni regla de evidencia, lo que favorece autoevaluaciones infladas.
- **Decisión:** escala 0–5 con descriptores de Dreyfus, cinco dimensiones y topes por evidencia (regla 02). Conocimientos con escala aparte 0–3.
- **Estado:** **propuesta — requiere tu validación.**

## D-006 — Límite de 3 habilidades en desarrollo activo
- **Contexto:** riesgo explícito de la conversación original: terminar con muchas habilidades en nivel 1.
- **Decisión:** máximo 3 en "Desarrollar" y máximo 1 de ellas en subida 3→4 o superior (regla 03 §3).
- **Estado:** **propuesta — requiere tu validación.**

---

## Casos abiertos
_(Conceptos que no encajaron en el test de clasificación. Se discuten antes de forzarlos.)_
- Ninguno todavía.
