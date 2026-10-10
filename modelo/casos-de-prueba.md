# Casos de prueba de la ontología

> Estado: **v0.1 — propuesta de Claude, pendiente de validación de Omar.**
> Funcionan como pruebas unitarias: después de cambiar cualquier regla, se vuelve a clasificar cada caso. Si alguno cambia de categoría, se discute antes de aceptar el cambio.

Columna **Acuerdo**: `?` pendiente · `✔` Omar está de acuerdo · `✘` Omar discrepa (anotar por qué y abrir decisión).

| # | Concepto | Clasificación esperada | Razón (paso del test, regla 01 §5) | Acuerdo |
|---|---|---|---|---|
| 1 | **Liderazgo** | PARAGUAS → (a) competencia "dirigir un equipo hacia un objetivo en un contexto dado"; (b) habilidades: delegar, dar retroalimentación, comunicar una dirección; (c) como "valor" corporativo suele nombrar un valor distinto (servicio, responsabilidad) | Paso 0: tiene al menos cuatro sentidos (habilidades, competencia, función social, ideal) | ? |
| 2 | **Inglés** | CAMPO | Paso 3: agrupa conocimientos (gramática, vocabulario) y habilidades (escuchar, hablar, leer, escribir) | ? |
| 3 | Gramática del inglés | CONOCIMIENTO | Paso 2: se verifica con preguntas sin hablar | ? |
| 4 | Comprender inglés oral sin subtítulos | HABILIDAD (cognitiva) | Paso 5a: entrenable, aislable (un audio de 10 min), evaluable, disociable de la gramática | ? |
| 5 | Conversar en inglés en reuniones técnicas | COMPETENCIA | Paso 5b: integra comprensión, expresión, vocabulario técnico y manejo de la interacción en un contexto real | ? |
| 6 | **Paciencia** | DISPOSICIÓN | Paso 4b: tendencia estable; se traduce a habilidades entrenables ("pausar antes de responder") | ? |
| 7 | Honestidad | VALOR o PRINCIPIO según cómo se formule | Paso 1: "actuar con transparencia" es dirección continua (valor); "no falsear datos" es restricción (principio) | ? |
| 8 | Negociar acuerdos | HABILIDAD (interpersonal) | Paso 5a: se puede practicar en un caso simulado de 30 min con retroalimentación | ? |
| 9 | Manejar empresas | COMPETENCIA amplia (o DIRECCIÓN, si se formula como trayectoria de vida) | Paso 1c o 5b según la formulación; nunca habilidad | ? |
| 10 | Contabilidad | CAMPO | Paso 3 | ? |
| 11 | Analizar estados financieros | HABILIDAD (cognitiva) | Paso 5a: produce un análisis evaluable; disociable de conocer las normas contables | ? |
| 12 | Programar en Python | PARAGUAS → campo "Python" + habilidades (escribir funciones correctas, depurar, leer código ajeno) | Paso 0: "programar" agrupa demasiadas tareas distintas para una sola rúbrica | ? |
| 13 | Gestión financiera personal | COMPETENCIA | Paso 5b: integra presupuestar, comparar costos, evaluar deudas; no hay un ejercicio aislado que la cubra | ? |
| 14 | Aprender a aprender | PARAGUAS de METAHABILIDADES → diseñar práctica deliberada, autoevaluar el desempeño, buscar retroalimentación | Paso 0 y 5a: el nombre general no tiene rúbrica única; sus partes sí | ? |
| 15 | Memoria de trabajo | APTITUD | Paso 4a: base biológica, poco entrenable; se planifica en torno a ella | ? |
| 16 | Curiosidad | DISPOSICIÓN | Paso 4b | ? |
| 17 | Transferencia del aprendizaje | NO ES ENTIDAD: es una **propiedad** de las habilidades (dimensión 4 de la regla 02) | Error de categoría detectado en la lista original de 20 | ? |
| 18 | Ser más productivo | NO CLASIFICABLE tal cual: deseo vago. Preguntar: ¿qué resultado (objetivo)? ¿qué conducta (acción)? | Paso 6 | ? |
| 19 | Estar tranquilo | NO ES VALOR: es un estado emocional. Si importa, preguntar qué haría distinto estando tranquilo | Paso 1d, test del sentimiento | ? |
| 20 | Priorizar tareas | HABILIDAD (cognitiva) | Paso 5a: proceso mental que deja huella evaluable (una lista ordenada con criterio) — aplica D-002 | ? |
| 21 | Recordar | APTITUD (función cognitiva basal) | Paso 4a: base biológica; no hay método en el nombre | ✔ (D-002, refinamiento de Omar) |
| 22 | Usar mnemotecnias para retener información | HABILIDAD (metahabilidad) | Paso 5a: método deliberado sobre una aptitud; entrenable y evaluable por lo que se recuerda | ✔ (D-002, refinamiento de Omar) |
| 23 | Pensamiento crítico | PARAGUAS → habilidades: evaluar la solidez de un argumento, evaluar la calidad de una evidencia, detectar sesgos propios en una decisión | Paso 0: agrupa técnicas distintas con rúbricas distintas. Contraste: "análisis costo-beneficio" sí es una HABILIDAD única | ? (Omar lo citó como habilidad; Claude propone tratarlo como paraguas) |

## Cómo agregar un caso

Cuando una clasificación genere dudas o discusión, se agrega aquí con su razón. Los casos difíciles son los más valiosos.
