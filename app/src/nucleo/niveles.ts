// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Topes de nivel por evidencia (regla 02 §3) y retos de Senda (D-009).
// El modelo propone un nivel; este código decide cuál se registra.

import type { Confianza, Evidencia, NivelHabilidad } from './tipos'

/** Tope de un reto aprobado en Senda (D-009, propuesta pendiente de Omar). */
export const TOPE_RETO: NivelHabilidad = 3

/** La formación (cursos, lecturas, horas) se registra pero no prueba ejecución. */
function deEjecucion(evidencias: readonly Evidencia[]): Evidencia[] {
  return evidencias.filter((e) => e.tipo !== 'formacion')
}

function contextosDistintos(evidencias: readonly Evidencia[]): number {
  return new Set(evidencias.map((e) => e.contexto.trim().toLowerCase())).size
}

/**
 * Nivel máximo que respalda la evidencia disponible.
 *
 * - Sin evidencia de ejecución: 0. Interpretación de la regla 02: los niveles 1-2
 *   exigen un ejemplo concreto ejecutado; la formación sola no alcanza.
 * - 1-2: al menos una evidencia de ejecución.
 * - 3: dos contextos distintos, o una evidencia externa (un reto de Senda cuenta).
 * - 4: evidencia externa revisada (no un reto de Senda, D-009) más dos contextos.
 * - 5: exige reconocimiento externo sostenido, que no se decide de forma automática;
 *   el código nunca registra más de 4.
 */
export function topeNivel(evidencias: readonly Evidencia[]): NivelHabilidad {
  const ejecucion = deEjecucion(evidencias)
  if (ejecucion.length === 0) return 0

  const contextos = contextosDistintos(ejecucion)
  const externaRevisada = ejecucion.some((e) => e.externa && e.fuente !== 'reto-senda')
  const externa = ejecucion.some((e) => e.externa)

  if (externaRevisada && contextos >= 2) return 4
  if (externa || contextos >= 2) return 3
  return 2
}

export interface NivelRegistrado {
  nivel: NivelHabilidad
  /** Nivel propuesto que la evidencia no alcanza a respaldar (regla 02: se anota, no se registra). */
  sospechado?: NivelHabilidad
  confianza: Confianza
}

/**
 * Confianza del nivel según la evidencia (regla 02 §3). Sin rúbrica específica de la habilidad,
 * la confianza no puede ser alta (regla 02 §6).
 */
export function confianza(evidencias: readonly Evidencia[], opciones: { conRubrica?: boolean } = {}): Confianza {
  const ejecucion = deEjecucion(evidencias)
  if (ejecucion.some((e) => e.externa)) return opciones.conRubrica ? 'alta' : 'media'
  if (contextosDistintos(ejecucion) >= 2) return 'media'
  return 'baja'
}

/** Registra el nivel propuesto recortado por el tope; si no alcanza, lo deja como sospechado. */
export function registrarNivel(
  propuesto: NivelHabilidad,
  evidencias: readonly Evidencia[],
  opciones: { conRubrica?: boolean } = {},
): NivelRegistrado {
  const tope = topeNivel(evidencias)
  const resultado: NivelRegistrado = {
    nivel: Math.min(propuesto, tope) as NivelHabilidad,
    confianza: confianza(evidencias, opciones),
  }
  if (propuesto > tope) resultado.sospechado = propuesto
  return resultado
}

/**
 * Nivel tras aprobar un reto de Senda (D-009): sube como máximo un nivel por reto,
 * nunca por encima de lo demostrado ni de TOPE_RETO, y nunca baja el nivel actual.
 */
export function nivelTrasReto(
  actual: NivelHabilidad,
  demostrado: NivelHabilidad,
): NivelHabilidad {
  const nuevo = Math.min(actual + 1, demostrado, TOPE_RETO)
  return Math.max(actual, nuevo) as NivelHabilidad
}

/** Recorta un número cualquiera (por ejemplo, el que propone un modelo) a la escala 0-5. */
export function aNivel(x: unknown): NivelHabilidad {
  const n = typeof x === 'number' && Number.isFinite(x) ? Math.round(x) : 0
  return Math.max(0, Math.min(5, n)) as NivelHabilidad
}
