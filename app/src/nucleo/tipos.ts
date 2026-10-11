// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

/** Nivel de una habilidad en la escala 0-5 (regla 02 §1). */
export type NivelHabilidad = 0 | 1 | 2 | 3 | 4 | 5

/** Tipos de evidencia de la regla 02 §3. */
export type TipoEvidencia =
  | 'producto'
  | 'resultado'
  | 'retroalimentacion'
  | 'evaluacion'
  | 'autoobservacion'
  | 'formacion'

export type Confianza = 'baja' | 'media' | 'alta'

export interface Evidencia {
  tipo: TipoEvidencia
  /** No depende solo del juicio de la persona (regla 02 §3). */
  externa: boolean
  /** Contexto en el que se ejecutó la habilidad; dos evidencias con el mismo contexto cuentan como uno. */
  contexto: string
  /** `reto-senda`: reto generado y corregido por el modelo dentro de la app (D-009). */
  fuente?: 'reto-senda' | 'logro' | 'manual'
}
