// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Métricas y etiquetas del banco de pruebas (docs/arquitectura.md §7).

/** Umbrales iniciales, a calibrar. */
export const UMBRALES = { clasificacion: 0.85, formato: 0.95, aprobacionIndebida: 0.05 } as const

export interface ResultadoCaso {
  numero: number
  concepto: string
  esperadas: string[]
  obtenida: string | null
  acierto: boolean
  acordado: boolean
  intentos: number | null
  error?: string
}

export interface Resumen {
  casos: number
  acordados: number
  /** Acierto sobre los casos con acuerdo de Omar (resultado oficial). null si no hay casos acordados. */
  aciertoAcordados: number | null
  /** Acierto sobre todos los casos (provisional mientras haya casos sin acuerdo). */
  aciertoTodos: number
  /** Respuestas que cumplieron el formato sin reintento. */
  formato: number
  etiqueta: 'Recomendado' | 'Aceptable' | 'Experimental' | 'Sin certificar'
  notas: string[]
}

const proporcion = (n: number, d: number) => (d ? n / d : 0)

export function resumir(resultados: ResultadoCaso[], opciones: { bancoCompleto: boolean }): Resumen {
  const acordados = resultados.filter((r) => r.acordado)
  const aciertoAcordados = acordados.length ? proporcion(acordados.filter((r) => r.acierto).length, acordados.length) : null
  const aciertoTodos = proporcion(resultados.filter((r) => r.acierto).length, resultados.length)
  const formato = proporcion(resultados.filter((r) => r.intentos === 1).length, resultados.length)
  const notas: string[] = []
  if (acordados.length < resultados.length) notas.push(`${resultados.length - acordados.length} de ${resultados.length} casos de clasificación aún no tienen el acuerdo de Omar: el acierto sobre todos es provisional.`)
  if (!opciones.bancoCompleto) notas.push('Faltan las pruebas de evaluación de retos y de evidencia (respuestas de referencia pendientes): no se puede medir la aprobación indebida.')

  let etiqueta: Resumen['etiqueta'] = 'Sin certificar'
  if (opciones.bancoCompleto && aciertoAcordados !== null) {
    const pasa = aciertoAcordados >= UMBRALES.clasificacion && formato >= UMBRALES.formato
    const cerca = aciertoAcordados >= UMBRALES.clasificacion - 0.1 && formato >= UMBRALES.formato - 0.1
    etiqueta = pasa ? 'Recomendado' : cerca ? 'Aceptable' : 'Experimental'
  }
  return { casos: resultados.length, acordados: acordados.length, aciertoAcordados, aciertoTodos, formato, etiqueta, notas }
}
