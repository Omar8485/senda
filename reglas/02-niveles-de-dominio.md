# Regla 02 — Niveles de dominio y evidencia

> Estado: **v0.1 — borrador de Fase 3**, adelantado porque las skills lo necesitan.
> Cambiar esta regla exige una entrada en `decisiones/registro.md`.

Un nivel describe **lo que una persona puede hacer de forma demostrable**, no cuánto sabe, cuántas horas practicó ni cuántos cursos tomó.

---

## 1. Escala genérica de habilidades (0–5)

Anclada en el modelo de adquisición de habilidades de Dreyfus (novato → experto), con un nivel 0 agregado.

| Nivel | Nombre | Qué puede hacer | Dreyfus |
|---|---|---|---|
| **0** | Sin exposición | Nunca lo ha intentado o solo ha oído hablar de ello. | — |
| **1** | Novato | Ejecuta casos simples siguiendo instrucciones o reglas explícitas. Necesita supervisión. Resultados inconsistentes. | Novato |
| **2** | Básico funcional | Resuelve casos habituales sencillos con apoyo puntual. Empieza a reconocer situaciones sin que se las señalen. Falla bajo presión o ante lo atípico. | Principiante avanzado |
| **3** | Competente | Resuelve los casos habituales de forma **autónoma y consistente**. Planifica, elige enfoque y se hace responsable del resultado. | Competente |
| **4** | Avanzado | Maneja casos complejos o atípicos. Adapta el enfoque al contexto, anticipa problemas y puede enseñar a otros. | Diestro |
| **5** | Experto | Resuelve situaciones nuevas y de alto riesgo. Su criterio es fiable aunque no siempre pueda explicarlo. Crea métodos que otros adoptan. | Experto |

**No linealidad:** pasar de 1 a 2 puede tomar semanas; de 4 a 5, años. La escala es ordinal: un 4 no es "el doble" de un 2.

---

## 2. Las cinco dimensiones que justifican un nivel

Para asignar un nivel se revisan cinco dimensiones. El nivel final es el que describe de forma honesta el **conjunto**, no el promedio de la mejor dimensión.

1. **Autonomía:** ¿necesita instrucciones, apoyo puntual o ninguno?
2. **Consistencia:** ¿lo logra una vez o de forma repetida?
3. **Complejidad:** ¿casos simples, habituales, atípicos o nuevos?
4. **Transferencia:** ¿funciona en contextos distintos al que lo aprendió?
5. **Juicio:** ¿sabe cuándo conviene aplicar la habilidad y cuándo no?

---

## 3. Reglas de evidencia (topes)

La autoevaluación sin evidencia es poco fiable, sobre todo en los extremos. Por eso los niveles tienen **topes según la evidencia disponible**:

| Nivel que se quiere asignar | Evidencia mínima |
|---|---|
| 1–2 | Autoobservación descrita con un ejemplo concreto (qué, cuándo, resultado). |
| **3** | ≥ 2 evidencias en **contextos distintos**, o 1 evidencia externa. |
| **4** | ≥ 1 evidencia **externa** (resultado medible, retroalimentación de alguien competente, evaluación formal) **más** ≥ 2 contextos distintos. |
| **5** | Reconocimiento externo sostenido (pares, mercado, publicaciones, enseñanza a otros con resultados). |

**Reglas duras:**
- Horas, cursos o lecturas **solas** nunca justifican más de nivel 2.
- Un certificado es evidencia **externa de conocimiento**; solo cuenta como evidencia de habilidad si el examen exigía ejecutar la tarea.
- Si no se alcanza la evidencia, se registra el nivel que sí la tiene y en notas el nivel que se **sospecha**.
- Cada nivel lleva **confianza**: `baja` (solo autoobservación), `media` (evidencia propia en varios contextos), `alta` (evidencia externa).

### Tipos de evidencia
`producto` (algo hecho que se puede revisar) · `resultado` (efecto medible) · `retroalimentacion` (juicio de un tercero competente) · `evaluacion` (examen o prueba práctica) · `autoobservacion` (registro propio de una ejecución concreta) · `formacion` (curso, lectura u horas de estudio: se registra, pero **no cuenta** como evidencia de ejecución).
Una evidencia es **externa** si no depende solo del juicio de Omar. Un **reto aprobado en Senda** (generado y corregido por Claude, verificable por texto) cuenta como evidencia externa de tipo `evaluacion`, con tope de nivel 3 (D-009).

---

## 4. Contexto y vigencia

- **Nivel por contexto:** cuando una habilidad se comporta distinto según el contexto, se registran niveles por contexto (negociar con proveedores: 3; negociar un conflicto familiar: 1). El nivel general es el del contexto relevante para los objetivos activos.
- **Vigencia:** las habilidades se deterioran sin uso. Se registra `ultima_practica`. Si pasan más de 12 meses sin práctica, el nivel queda marcado **"en riesgo"** y debe revisarse antes de usarse en una estrategia.

---

## 5. Escala de conocimientos (0–3)

Los conocimientos usan su propia escala (ver regla 01, §2.1): 0 ninguno · 1 nociones · 2 comprende · 3 domina. Evidencia para 3: explicar un caso límite o detectar un error ajeno de forma verificable.

---

## 6. Rúbricas específicas

La escala genérica es el esqueleto. Cada habilidad prioritaria tendrá en su ficha (`modelo/catalogo/habilidades/`) una **rúbrica específica** con indicadores observables por nivel. Sin rúbrica específica, la evaluación se hace con la genérica y la confianza no puede ser `alta`.
