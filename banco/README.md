# Banco de pruebas de modelos

Mide si un modelo de IA es lo bastante riguroso para usarse en Senda (docs/arquitectura.md §7). Así, "el modelo que elijas" no destruye el rigor del método.

## Qué mide hoy

| Prueba | Fuente | Estado |
|---|---|---|
| **Clasificación** de conceptos con el test de la regla 01 | `modelo/casos-de-prueba.md`, leído tal cual (no se duplica) | ✔ lista |
| **Formato**: respuestas que cumplen el esquema sin reintento | Todas las pruebas | ✔ lista |
| **Evaluación de retos**: tasa de aprobación indebida | Respuestas de referencia (buenas, flojas y tramposas) con veredicto conocido | Pendiente: Omar decidió escribirlas más adelante (pregunta 4 de la arquitectura) |
| **Evaluación de evidencia**: no aprobar afirmaciones sin respaldo | Evidencias de referencia | Pendiente |

Mientras falten las dos últimas, el resultado es siempre **"Sin certificar"**, aunque la clasificación salga perfecta.

**Resultado oficial y provisional.** Solo cuentan para el resultado oficial los casos que Omar marcó con ✔ en `modelo/casos-de-prueba.md`. El acierto sobre todos los casos se informa como provisional.

## Umbrales iniciales (a calibrar)

- Clasificación ≥ 85 % (sobre casos acordados).
- Formato ≥ 95 %.
- Aprobación indebida ≤ 5 % (cuando exista la prueba).

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
- `app/src/banco/metricas.ts`: umbrales, resumen y etiqueta.
- `app/src/banco/correr.banco.ts`: corre las pruebas con el modelo configurado (`npm run banco`).
- `prompts/clasificar-concepto.md`: el prompt que se mide.
