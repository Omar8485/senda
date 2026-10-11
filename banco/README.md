# Banco de pruebas de modelos

Mide si un modelo de IA es lo bastante riguroso para usarse en Senda (docs/arquitectura.md §7). Así, "el modelo que elijas" no destruye el rigor del método.

## Qué mide hoy

| Prueba | Fuente | Estado |
|---|---|---|
| **Clasificación** de conceptos con el test de la regla 01 | `modelo/casos-de-prueba.md`, leído tal cual (no se duplica) | ✔ lista |
| **Formato**: respuestas que cumplen el esquema sin reintento | Todas las pruebas | ✔ lista |
| **Evaluación de retos**: tasa de aprobación indebida | Respuestas de referencia (buenas, flojas y tramposas) con veredicto conocido | Pendiente: Omar decidió escribirlas más adelante (pregunta 4 de la arquitectura) |
| **Evaluación de evidencia**: no aprobar logros sin respaldo (aprobación indebida) ni rechazar los que lo tienen (rechazo indebido) | `banco/evidencias-de-referencia.md`: 15 casos inventados, con imágenes en `banco/imagenes/` | ✔ lista: 12 casos acordados por Omar (D-011) |

Mientras falte la prueba de retos, el resultado es siempre **"Sin certificar"**, aunque lo demás salga perfecto.

**Resultado oficial y provisional.** Solo cuentan para el resultado oficial los casos que Omar marcó con ✔ en `modelo/casos-de-prueba.md` y en `banco/evidencias-de-referencia.md`. El resultado sobre todos los casos se informa como provisional.

**Evidencias de referencia.** Cubren evidencia con respaldo, sin respaldo, inconsistente (la imagen contradice el puntaje, es de otra persona o no tiene relación), incompleta, fuera de plazo, vaga y con instrucciones escondidas. Las imágenes son de un examen inventado y llevan la marca "EJEMPLO FICTICIO"; se regeneran desde `app/` con `node scripts/generar-imagenes-banco.mjs`. Un modelo que no admite imágenes falla los casos que las llevan: el banco lo cuenta como error, no lo salta.

**Reglas de evidencia (D-011).** Un resultado externo exige imagen: un enlace solo no basta, porque el modelo no lo abre. La fecha límite no invalida un logro: se aprueba y se marca el retraso. Un logro autodeclarado pasa primero por preguntas de verificación (casos E-10, E-14 y E-15). En esos casos el acierto exige, además del veredicto, que el modelo pregunte o marque el retraso cuando corresponde.

## Umbrales iniciales (a calibrar)

- Clasificación ≥ 85 % (sobre casos acordados).
- Formato ≥ 95 %.
- Aprobación indebida ≤ 5 % sobre las evidencias acordadas. Con los casos negativos actuales, una sola aprobación indebida ya supera el umbral.

Con el banco completo: **Recomendado** si pasa todo, **Aceptable** si queda a menos de 10 puntos, **Experimental** si no.

## Cómo correrlo con tu modelo

Desde `app/`, con tu propia clave en una variable de entorno. La clave no se guarda en ningún archivo; nunca la escribas en el repositorio.

```
# Anthropic
SENDA_BANCO_MODELO=claude-opus-5-5 SENDA_BANCO_CLAVE=… npm run banco

# Compatible con OpenAI (OpenAI, Gemini, OpenRouter, Ollama…)
SENDA_BANCO_PROVEEDOR=openai-compatible SENDA_BANCO_URL=http://localhost:11434/v1 SENDA_BANCO_MODELO=… npm run banco
```

En PowerShell (Windows): `$env:SENDA_BANCO_MODELO="claude-opus-5-5"; $env:SENDA_BANCO_CLAVE="…"; npm run banco`, y después `Remove-Item Env:SENDA_BANCO_CLAVE`.

El informe queda en `banco/resultados/AAAA-MM-DD-<modelo>.json`, con el resumen y cada caso. No contiene la clave ni datos personales, así que se puede aportar al repositorio con un pull request.

## Código

- `app/src/banco/casos.ts`: lee la tabla de casos y extrae la categoría esperada y el acuerdo.
- `app/src/banco/evidencias.ts`: lee las evidencias de referencia y corre cada caso con las mismas variables que usa la app (`variablesLogro`, en `servicios/acciones.ts`).
- `app/src/banco/metricas.ts`: umbrales, resumen y etiqueta.
- `app/src/banco/correr.banco.ts`: corre las pruebas con el modelo configurado (`npm run banco`).
- `prompts/clasificar-concepto.md` y `prompts/evaluar-logro.md`: los prompts que se miden.
