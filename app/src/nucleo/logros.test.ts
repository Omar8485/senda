// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, it } from 'vitest'
import { puedeMarcarLogrado, validarObjetivoNuevo, valoresVigentes } from './logros'

const valores = new Map([
  ['val-a', { estado: 'activo', tipo: 'valor' }],
  ['val-b', { estado: 'archivado', tipo: 'valor' }],
  ['prin-c', { estado: 'activo', tipo: 'principio' }],
])

describe('puedeMarcarLogrado', () => {
  it('solo con una evaluación aprobada', () => {
    expect(puedeMarcarLogrado({ aprobado: true, explicacion: '', falta: '' })).toBe(true)
    expect(puedeMarcarLogrado({ aprobado: false, explicacion: '', falta: 'el certificado' })).toBe(false)
    expect(puedeMarcarLogrado(null)).toBe(false)
    expect(puedeMarcarLogrado(undefined)).toBe(false)
  })
})

describe('valores de un objetivo', () => {
  it('ignora valores archivados, inexistentes y principios', () => {
    expect(valoresVigentes(['val-a', 'val-b', 'prin-c', 'val-x'], valores)).toEqual(['val-a'])
  })

  it('exige al menos un valor vigente', () => {
    expect(validarObjetivoNuevo(['val-a'], valores)).toBeNull()
    expect(validarObjetivoNuevo(['val-b'], valores)).toMatch(/al menos a un valor/)
    expect(validarObjetivoNuevo([], valores)).toMatch(/al menos a un valor/)
  })
})
