// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, it } from 'vitest'
import { nivelPersonaje, racha, xpHabilidad, xpTotal, type EventoXp } from './xp'

const ev = (fecha: string, cantidad = 10): EventoXp => ({ fecha, cantidad, motivo: 'práctica' })

describe('xpTotal', () => {
  it('suma los eventos e ignora cantidades negativas', () => {
    expect(xpTotal([ev('2026-10-01', 10), ev('2026-10-02', 25), ev('2026-10-03', -5)])).toBe(35)
  })

  it('es 0 sin eventos', () => {
    expect(xpTotal([])).toBe(0)
  })
})

describe('racha', () => {
  it('cuenta días seguidos que terminan hoy', () => {
    expect(racha([ev('2026-10-08'), ev('2026-10-09'), ev('2026-10-10')], '2026-10-10')).toBe(3)
  })

  it('no se rompe si hoy todavía no hay práctica', () => {
    expect(racha([ev('2026-10-08'), ev('2026-10-09')], '2026-10-10')).toBe(2)
  })

  it('se rompe con un día completo sin práctica', () => {
    expect(racha([ev('2026-10-07'), ev('2026-10-08')], '2026-10-10')).toBe(0)
  })

  it('varios eventos el mismo día cuentan como un día', () => {
    expect(racha([ev('2026-10-10'), ev('2026-10-10'), ev('2026-10-09')], '2026-10-10')).toBe(2)
  })

  it('cruza el cambio de mes', () => {
    expect(racha([ev('2026-09-30'), ev('2026-10-01')], '2026-10-01')).toBe(2)
  })
})

describe('nivelPersonaje', () => {
  it('sube cada 500 XP y empieza en 1', () => {
    expect(nivelPersonaje(0)).toEqual({ nivel: 1, enNivel: 0, faltan: 500 })
    expect(nivelPersonaje(1250)).toEqual({ nivel: 3, enNivel: 250, faltan: 250 })
  })
})

describe('xpHabilidad', () => {
  it('reparte cada evento entre sus habilidades', () => {
    const eventos: EventoXp[] = [
      { fecha: '2026-10-01', cantidad: 30, motivo: 'sesión', habilidades: ['hab-a', 'hab-b'] },
      { fecha: '2026-10-02', cantidad: 50, motivo: 'reto', habilidades: ['hab-a'] },
      { fecha: '2026-10-03', cantidad: 100, motivo: 'objetivo' },
    ]
    expect(xpHabilidad(eventos, 'hab-a')).toBe(65)
    expect(xpHabilidad(eventos, 'hab-b')).toBe(15)
    expect(xpHabilidad(eventos, 'hab-c')).toBe(0)
  })
})
