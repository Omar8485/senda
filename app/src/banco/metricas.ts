// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Métricas y etiquetas del banco de pruebas (docs/arquitectura.md §7).

import type { ResultadoEvidencia } from './evidencias'

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

export interface ResumenEvidencias {
  casos: number
  acordados: number
  /** Logros aprobados que no debían aprobarse, sobre los casos acordados. null si no hay negativos acordados. */
  aprobacionIndebidaAcordados: number | null
  /** Lo mismo sobre todos los casos (provisional mientras haya casos sin acuerdo). */
  aprobacionIndebida: number
  /** Logros rechazados que debían aprobarse, sobre todos los casos. Mide si el modelo es inútil por exceso de rigor. */
  rechazoIndebido: number
  /** Respuestas que cumplieron el formato sin reintento. */
  formato: number
  /** Casos en que el modelo no respondió (por ejemplo, no admite imágenes). */
  errores: number
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
  evidencias?: ResumenEvidencias
  notas: string[]
}

const proporcion = (n: number, d: number) => (d ? n / d : 0)

/** Resumen de la prueba de evidencias (B.2c). */
export function resumirEvidencias(resultados: ResultadoEvidencia[]): ResumenEvidencias {
  const aprobados = (rs: ResultadoEvidencia[]) => rs.filter((r) => r.obtenido === true).length
  const negativos = resultados.filter((r) => !r.esperado)
  const negativosAcordados = negativos.filter((r) => r.acordado)
  const positivos = resultados.filter((r) => r.esperado)
  return {
    casos: resultados.length,
    acordados: resultados.filter((r) => r.acordado).length,
    aprobacionIndebidaAcordados: negativosAcordados.length ? proporcion(aprobados(negativosAcordados), negativosAcordados.length) : null,
    aprobacionIndebida: proporcion(aprobados(negativos), negativos.length),
    rechazoIndebido: proporcion(positivos.filter((r) => r.obtenido !== true).length, positivos.length),
    formato: proporcion(resultados.filter((r) => r.intentos === 1).length, resultados.length),
    errores: resultados.filter((r) => r.obtenido === null).length,
  }
}

/**
 * Resumen y etiqueta del banco. `bancoCompleto` indica que existen todas las pruebas (falta la de
 * retos, B.2b). Sin banco completo, o sin casos acordados, el resultado es siempre "Sin certificar".
 */
export function resumir(
  resultados: ResultadoCaso[],
  opciones: { bancoCompleto: boolean; evidencias?: ResumenEvidencias },
): Resumen {
  const acordados = resultados.filter((r) => r.acordado)
  const aciertoAcordados = acordados.length ? proporcion(acordados.filter((r) => r.acierto).length, acordados.length) : null
  const aciertoTodos = proporcion(resultados.filter((r) => r.acierto).length, resultados.length)
  const formato = proporcion(resultados.filter((r) => r.intentos === 1).length, resultados.length)
  const notas: string[] = []
  if (acordados.length < resultados.length) notas.push(`${resultados.length - acordados.length} de ${resultados.length} casos de clasificación aún no tienen el acuerdo de Omar: el acierto sobre todos es provisional.`)
  const ev = opciones.evidencias
  if (!opciones.bancoCompleto) {
    notas.push(ev
      ? 'Falta la prueba de evaluación de retos (respuestas de referencia pendientes): no se puede certificar.'
      : 'Faltan las pruebas de evaluación de retos y de evidencia: no se puede medir la aprobación indebida.')
  }
  if (ev && ev.acordados < ev.casos) notas.push(`${ev.casos - ev.acordados} de ${ev.casos} evidencias de referencia aún no tienen el acuerdo de Omar: la aprobación indebida sobre todas es provisional.`)
  if (ev?.errores) notas.push(`${ev.errores} evidencias sin respuesta del modelo (¿admite imágenes?). Cuentan como fallos.`)

  let etiqueta: Resumen['etiqueta'] = 'Sin certificar'
  const indebida = ev?.aprobacionIndebidaAcordados ?? null
  if (opciones.bancoCompleto && ev && aciertoAcordados !== null && indebida !== null) {
    const pasa = aciertoAcordados >= UMBRALES.clasificacion && formato >= UMBRALES.formato
      && ev.formato >= UMBRALES.formato && indebida <= UMBRALES.aprobacionIndebida
    const cerca = aciertoAcordados >= UMBRALES.clasificacion - 0.1 && formato >= UMBRALES.formato - 0.1
      && ev.formato >= UMBRALES.formato - 0.1 && indebida <= UMBRALES.aprobacionIndebida + 0.1
    etiqueta = pasa ? 'Recomendado' : cerca ? 'Aceptable' : 'Experimental'
  }
  return { casos: resultados.length, acordados: acordados.length, aciertoAcordados, aciertoTodos, formato, etiqueta, ...(ev ? { evidencias: ev } : {}), notas }
}
