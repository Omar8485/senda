# Regla 01 — Ontología: qué es cada cosa

> Estado: **v0.3 — Fase 1 cerrada (2026-10-10).** D-001, D-002, D-003, D-004 y D-007 aceptadas.
> Cambiar esta regla exige una entrada en `decisiones/registro.md`.

Esta regla define las categorías del modelo y el test para decidir a cuál pertenece un concepto. Es la base de todo lo demás: si dos conceptos de distinta categoría terminan en la misma lista, el modelo deja de servir.

---

## 1. Arquitectura general

El modelo tiene **dos mapas conectados por una estrategia**. No es un solo árbol.

```
MAPA DE ORIENTACIÓN            ESTRATEGIA                 MAPA DE DESARROLLO
(¿hacia dónde y por qué?)      (¿qué desarrollo,          (¿con qué cuento y
                                hasta qué nivel,           qué me falta?)
valores ─┐                      en qué orden?)
principios (límites)            brechas = nivel requerido   campos
direcciones ─→ objetivos ──→    − nivel actual       ←──   competencias
                  │             prioridades                  ├─ habilidades
                  └→ acciones   plan de práctica             ├─ conocimientos
                     comprometidas                           └─ disposiciones
                                                           aptitudes (restricción)
```

- El **mapa de orientación** responde: ¿qué considero importante?, ¿qué vida quiero construir?, ¿qué resultados concretos quiero lograr?
- El **mapa de desarrollo** responde: ¿qué sé?, ¿qué sé hacer?, ¿qué puedo demostrar?, ¿qué me falta y hasta qué nivel?
- La **estrategia** conecta ambos: los objetivos exigen competencias; las competencias se descomponen en habilidades y conocimientos con un nivel requerido; la diferencia con el nivel actual es la brecha.

Separación adicional: **`modelo/` es genérico** (vale para cualquier persona: definiciones, fichas, rúbricas) y **`perfil/` es la instancia de Omar** (sus valores, objetivos, niveles y evidencias). Como una clase y su instancia.

---

## 2. Categorías del mapa de desarrollo

### 2.1 Conocimiento
**Definición operativa:** conjunto de hechos, conceptos, principios o teorías que una persona comprende o recuerda sobre un campo. Es *saber que*.
**Señal:** se puede verificar con preguntas sin que la persona ejecute ninguna tarea.
**Ejemplos:** reglas del pasado simple en inglés; estructura de un balance; qué exige la LOEPS a una cooperativa de segmento 1.
**Escala propia (0–3):** 0 ninguno · 1 nociones (reconoce términos) · 2 comprende (lo explica con sus palabras y responde preguntas) · 3 domina (maneja casos límite, detecta errores ajenos, puede enseñarlo). Se usa una escala distinta a la de habilidades **a propósito**, para que nadie confunda "sé mucho de esto" con "sé hacerlo".

### 2.2 Habilidad
**Definición operativa:** capacidad aprendida para ejecutar un tipo de tarea acotada con un nivel de calidad observable, que mejora con práctica y retroalimentación. Es *saber hacer*.
**Se escribe como:** verbo + objeto (+ condición si hace falta). "Redactar informes técnicos", "estimar costos de un proyecto", "escuchar para identificar la necesidad real de un usuario".
**Tests (deben cumplirse los cuatro):**
1. **Entrenable mediante un método:** existe una técnica o método aprendible que mejora con práctica deliberada, no solo con información. En niveles altos el método puede volverse tácito (el experto ya no sabe explicarlo); lo que importa es que se pueda aprender, no que siempre se pueda verbalizar.
2. **Aislable:** se puede diseñar un ejercicio de práctica de menos de ~1 hora centrado solo en ella.
3. **Evaluable:** produce una ejecución o una huella (producto, decisión, texto, cálculo) cuya calidad un tercero podría juzgar.
4. **Disociable del conocimiento:** alguien podría tener el conocimiento y aun así fallar al ejecutarla.

**Procesos mentales** (analizar, planificar, priorizar, decidir, interpretar) **sí cuentan como habilidad** cuando cumplen los cuatro tests; por ejemplo, "priorizar tareas" deja una lista ordenada que se puede evaluar. Ver D-002. Tres precisiones:

- **Función básica frente a método.** Las funciones cognitivas basales (recordar, atender, percibir, velocidad de procesamiento) son **aptitudes**. El **método deliberado** para usarlas sí es habilidad: usar mnemotecnias, estructurar información para recordarla, gestionar a propósito el foco de atención.
- **No hay dicotomía entre pensar y hacer.** En dominios complejos (programar, negociar, diagnosticar, jugar ajedrez) la acción visible —teclear, hablar, mover una pieza— es trivial frente al trabajo mental previo: estructurar el problema, anticipar consecuencias, filtrar ruido y decidir. La ejecución observable es la **huella** de ese proceso, y es lo que se evalúa.
- **Función general frente a técnica.** "Pensar" es una función humana general; "análisis costo-beneficio" es una habilidad porque aplica un marco estructurado que se entrena del nivel 1 al 5. Cuando el nombre abarca muchas técnicas distintas ("pensamiento crítico"), es un término paraguas y se descompone (paso 0 del test).

**Subtipos:** `cognitiva` (procesos internos estructurados) · `interpersonal` · `motora` (ejecución física o técnica directa) · `metahabilidad` (habilidades metacognitivas: su objeto son otras habilidades o el propio pensamiento, como diseñar la propia práctica o autoevaluar el desempeño).

### 2.3 Competencia
**Definición operativa:** integración demostrada de habilidades, conocimientos y disposiciones, con criterio propio, para lograr un resultado en un contexto real. (Basada en la definición del Marco Europeo de Cualificaciones, EQF.)
**Se escribe como:** resultado + contexto. "Gestionar de punta a punta un proyecto de automatización en una cooperativa", "conversar en inglés en reuniones técnicas".
**Señal que la separa de la habilidad:** no se puede practicar aislada en un ejercicio corto; solo se demuestra en una situación completa. Siempre combina ≥2 habilidades y ≥1 conocimiento.
**Por qué importa:** los **objetivos exigen competencias**; las **habilidades son lo que se entrena**. Se puede tener cada pieza y no ser competente, porque falta la integración (esto lo detectaste tú en la conversación original).

### 2.4 Disposición (cualidad, rasgo o actitud)
**Definición operativa:** tendencia relativamente estable a sentir, pensar o actuar de cierta manera. Describe *cómo tiende a ser* una persona, no *qué sabe hacer*.
**Señal:** se "tiene" sin practicarla deliberadamente; facilita o dificulta ciertas habilidades, pero no las sustituye.
**Ejemplos:** paciencia, curiosidad, escrupulosidad, tolerancia al riesgo, actitud hacia el aprendizaje.
**Regla:** las disposiciones se registran como **facilitadores u obstáculos** de una competencia, nunca como metas de desarrollo directas. "Ser más paciente" se traduce a habilidades entrenables ("pausar antes de responder en una discusión").

### 2.5 Aptitud
**Definición operativa:** capacidad básica con fuerte componente biológico, poco entrenable, que condiciona la velocidad de aprendizaje o el techo de ciertas habilidades. Equivale a *abilities* en O\*NET.
**Ejemplos:** memoria de trabajo, velocidad de procesamiento, agudeza auditiva, fuerza física.
**Regla:** las aptitudes son **restricciones o ventajas del terreno**, no metas. No se planifica "subir la memoria de trabajo"; se planifica en torno a ella (p. ej., externalizar memoria con notas).

### 2.6 Campo
**Definición operativa:** sistema o disciplina que agrupa conocimientos y habilidades relacionados. No es ni habilidad ni conocimiento: es el **contenedor**.
**Ejemplos:** el idioma inglés, la contabilidad, Python, la regulación cooperativa ecuatoriana.
**Caso clave — los idiomas:** "inglés" es un campo. Vocabulario y gramática son **conocimientos**; comprensión auditiva, lectura, expresión oral y escrita son **habilidades**; "negociar con un cliente en inglés" es una **competencia**. Por eso alguien puede saber mucha gramática y bloquearse al conversar.

---

## 3. Categorías del mapa de orientación

### 3.1 Valor
**Definición operativa (sentido ACT):** cualidad elegida de la propia **acción** (no de la persona), que funciona como dirección continua. **No se alcanza nunca**; se vive o no se vive en cada acción.
**Valor frente a disposición (D-007):** "soy respetuoso" describe a la persona (disposición, §2.4); "actuar con respeto" describe la acción (valor). Una disposición se tiene o no; un valor se elige y se practica en cada acción, incluso cuando la disposición no acompaña. Por eso las preguntas de orientación no usan la palabra "cualidad" a secas: preguntan **cómo quieres actuar**, no cómo quieres ser.
**Concreción:** un valor es amplio a propósito. Se vuelve concreto en dos lugares: en las **acciones que lo muestran** (ejemplos de un día normal) y en los **objetivos** que lo sirven.
**Se escribe como:** forma de actuar continua. "Aprender con profundidad", "contribuir al desarrollo de otros", "actuar con autonomía".
**Tests:**
- ¿Se puede tachar como "hecho"? Si se puede, no es un valor: es un objetivo.
- **Testigo secreto:** ¿lo seguirías eligiendo si nadie supiera nunca que lo haces? Si no, puede ser un mandato ajeno o una búsqueda de aprobación.
- ¿Es un sentimiento ("estar tranquilo")? Los sentimientos no son valores: son estados que llegan y se van.

### 3.2 Principio
**Definición operativa:** norma que **restringe** cómo se actúa, sea cual sea el objetivo. Funciona como límite, no como dirección.
**Ejemplos:** no falsear datos en un informe; no comprometer la confidencialidad de un usuario.
**Por qué se separa del valor:** responde a tu duda de la conversación original. Lo que tiende a ser universal son ciertos **principios** éticos y la **estructura** de los valores humanos (la investigación de Schwartz encuentra los mismos tipos de valores en muchas culturas), pero las **prioridades** de valores de cada persona son propias y elegidas. Ver D-004.

### 3.3 Dirección vital *(opcional)*
**Definición operativa:** trayectoria de varios años que concreta uno o más valores en un área de vida, y que se compone de objetivos sucesivos. No se completa, pero sí se puede abandonar o cambiar.
**Ejemplo:** "construir una carrera de especialista en automatización de operaciones financieras".
**Nota de rigor:** esta capa no existe en ACT (que va de valores a metas directamente); la agregó la conversación original. Se mantiene como opcional porque ayuda a agrupar objetivos, pero si genera confusión se elimina.

### 3.4 Objetivo
**Definición operativa:** resultado concreto, verificable y con fecha, que se persigue al servicio de un valor.
**Debe tener:** criterio de cumplimiento (cómo sabré que lo logré), fecha, área de vida, valor(es) al que sirve y competencias que exige.
**Ejemplo:** "aprobar una certificación profesional concreta antes de junio de 2027".

### 3.5 Acción comprometida y barrera
- **Acción comprometida:** conducta observable que se puede hacer **hoy**. Solo se comprometen acciones, nunca sentimientos ni resultados.
- **Barrera:** lo que dificulta la acción. **Externa** (tiempo, dinero, acceso) o **interna** (pensamientos, emociones, hábitos de evitación). Las internas no se eliminan; se les hace sitio.

### 3.6 Área de vida
Los diez dominios del Valued Living Questionnaire, para no dejar zonas de la vida fuera: familia de origen, pareja, crianza, amistades, trabajo, educación, recreación, espiritualidad, ciudadanía, cuidado físico.

---

## 4. Términos reservados (vocabulario estricto)

| Término | Significado único en este modelo | No usar para |
|---|---|---|
| **habilidad** | §2.2 | conocimientos, rasgos, campos |
| **competencia** | §2.3 | "habilidad grande" sin resultado ni contexto |
| **campo** | §2.6 | — |
| **área de vida** | §3.6 | campos de conocimiento |
| **nivel de dominio** | grado de desarrollo de una habilidad (regla 02) | conocimientos (usan su escala 0–3) |
| **valor** | §3.1 | principios, metas, sentimientos, "valores corporativos" |
| **capacidad** | **no es categoría.** Solo en lenguaje coloquial | — |

**Sobre "capacidad":** se usa en dos sentidos incompatibles (aptitud biológica y "lo que puedo lograr en ciertas condiciones", que es una competencia). Para evitar la confusión, el modelo no la usa como categoría. Ver D-003.

---

## 5. Test de clasificación (árbol de decisión)

Aplicar en orden. La primera respuesta afirmativa decide.

```
0. ¿El término tiene varios sentidos razonables?  (liderazgo, comunicación,
   inteligencia emocional, resiliencia...)
   → Es un TÉRMINO PARAGUAS. No se registra tal cual.
     Se enumeran sus sentidos y se clasifica cada uno por separado.

1. ¿Describe algo que se elige y orienta, no algo que se posee?
   a. ¿Restringe cómo actúo, sea cual sea el fin?        → PRINCIPIO
   b. ¿Se puede tachar como logrado y tiene fecha?        → OBJETIVO
   c. ¿Es una trayectoria de años compuesta de objetivos?  → DIRECCIÓN
   d. ¿Es una cualidad continua de la acción?             → VALOR
   e. ¿Es una conducta concreta que se puede hacer hoy?   → ACCIÓN

2. ¿Es "saber que", verificable sin ejecutar nada?        → CONOCIMIENTO

3. ¿Es un sistema que agrupa conocimientos y habilidades? → CAMPO

4. ¿Es una tendencia estable de cómo se es?
   a. ¿Con fuerte base biológica y poco entrenable?       → APTITUD
   b. Si no                                               → DISPOSICIÓN

5. ¿Es "saber hacer"?
   a. ¿Cumple los 4 tests de §2.2 (entrenable, aislable,
      evaluable, disociable)?                             → HABILIDAD
   b. ¿Solo se demuestra integrando varias piezas para
      lograr un resultado en un contexto real?            → COMPETENCIA

6. Ninguna aplica → no forzar. Registrar como caso abierto en
   `decisiones/registro.md` y discutirlo.
```

**Errores frecuentes que el test debe atrapar:**
- Una **propiedad** de las habilidades presentada como habilidad ("transferencia", "consistencia").
- Una **competencia** presentada como habilidad ("gestión financiera personal", "autocuidado").
- Una **disposición** presentada como habilidad ("paciencia", "proactividad").
- Un **valor corporativo** que en realidad nombra una competencia o una función ("liderazgo" como valor de empresa).

Los casos resueltos que sirven de prueba están en `modelo/casos-de-prueba.md`. Si una nueva clasificación contradice un caso de prueba, se discute antes de cambiar nada.

---

## 6. Dos tipos de importancia que no se deben mezclar

La conversación original cerró con esta pregunta: ¿"fundamental" significa necesario para la autonomía o útil para aprender otras cosas? Son ejes distintos y cada habilidad se puntúa en ambos por separado:

- **Autonomía (0–3):** costo de no tenerla para vivir sin depender innecesariamente de otros. Cocinar puntúa alto.
- **Multiplicador (0–3):** cuántas otras habilidades acelera o habilita. Aprender a aprender puntúa alto.

Una habilidad puede ser alta en uno y baja en el otro. Mezclarlos produce un árbol mal diseñado.

---

## 7. Funciones universales (hipótesis de trabajo)

Lo universal no parece ser una lista fija de habilidades, sino un conjunto de **funciones** que toda persona necesita cubrir y que cada una resuelve con habilidades distintas. Lista provisional para la Fase 2 en `modelo/familias.md`.
