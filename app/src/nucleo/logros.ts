// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Reglas de objetivos: no hay logro sin evidencia aprobada, y todo objetivo responde a un valor.

export interface EvaluacionLogro {
  aprobado: boolean
  explicacion: string
  falta: string
  /** D-011: se cumplió después de la fecha límite. No invalida el logro. */
  con_retraso?: boolean
  /** D-011: preguntas de verificación para un logro sin resultado externo. */
  preguntas?: string[]
}

/** Un objetivo solo se puede marcar como logrado con una evaluación aprobada de su evidencia. */
export function puedeMarcarLogrado(evaluacion: EvaluacionLogro | null | undefined): boolean {
  return evaluacion?.aprobado === true
}

/** Valores válidos de un objetivo: los que existen y no están archivados. */
export function valoresVigentes(
  idsValores: readonly string[],
  valores: ReadonlyMap<string, { estado: string; tipo: string }>,
): string[] {
  return idsValores.filter((id) => {
    const v = valores.get(id)
    return v !== undefined && v.estado !== 'archivado' && v.tipo === 'valor'
  })
}

/** Error si un objetivo nuevo no responde a ningún valor vigente. */
export function validarObjetivoNuevo(
  idsValores: readonly string[],
  valores: ReadonlyMap<string, { estado: string; tipo: string }>,
): string | null {
  return valoresVigentes(idsValores, valores).length === 0
    ? 'Todo objetivo debe responder al menos a un valor.'
    : null
}
