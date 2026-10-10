// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, it } from 'vitest'
import { racha, xpTotal, type EventoXp } from './xp'

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
