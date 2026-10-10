// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// XP y racha (D-009): miden práctica y se calculan desde los eventos.
// No tocan el nivel de ninguna habilidad; por eso este módulo no importa nada de niveles.

export interface EventoXp {
  /** Fecha ISO (AAAA-MM-DD). */
  fecha: string
  cantidad: number
  motivo: string
  habilidad?: string
}

export function xpTotal(eventos: readonly EventoXp[]): number {
  return eventos.reduce((total, e) => total + Math.max(0, e.cantidad), 0)
}

function diaAnterior(fecha: string): string {
  const d = new Date(`${fecha}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

/**
 * Días seguidos con práctica que terminan hoy o ayer
 * (la racha no se rompe hasta que pasa un día completo sin practicar).
 */
export function racha(eventos: readonly EventoXp[], hoy: string): number {
  const dias = new Set(eventos.filter((e) => e.cantidad > 0).map((e) => e.fecha))
  let dia = dias.has(hoy) ? hoy : diaAnterior(hoy)
  let cuenta = 0
  while (dias.has(dia)) {
    cuenta++
    dia = diaAnterior(dia)
  }
  return cuenta
}
