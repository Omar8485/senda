// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, it } from 'vitest'
import { confianza, nivelTrasReto, registrarNivel, topeNivel } from './niveles'
import type { Evidencia } from './tipos'

const propia = (contexto: string): Evidencia => ({ tipo: 'autoobservacion', externa: false, contexto })
const curso = (contexto: string): Evidencia => ({ tipo: 'formacion', externa: true, contexto })
const externa = (contexto: string): Evidencia => ({ tipo: 'retroalimentacion', externa: true, contexto })
const reto = (contexto: string): Evidencia => ({ tipo: 'evaluacion', externa: true, contexto, fuente: 'reto-senda' })

describe('topeNivel (regla 02 §3)', () => {
  it('sin evidencia, el tope es 0', () => {
    expect(topeNivel([])).toBe(0)
  })

  it('cursos y lecturas solos no prueban ejecución, aunque sean externos', () => {
    expect(topeNivel([curso('curso A'), curso('curso B'), curso('curso C')])).toBe(0)
  })

  it('una autoobservación concreta respalda hasta 2', () => {
    expect(topeNivel([propia('trabajo')])).toBe(2)
  })

  it('varias autoobservaciones en el mismo contexto no pasan de 2', () => {
    expect(topeNivel([propia('trabajo'), propia('Trabajo '), propia('trabajo')])).toBe(2)
  })

  it('dos contextos distintos respaldan 3', () => {
    expect(topeNivel([propia('trabajo'), propia('casa')])).toBe(3)
  })

  it('una evidencia externa respalda 3', () => {
    expect(topeNivel([externa('trabajo')])).toBe(3)
  })

  it('un reto de Senda cuenta como externo para 3 (D-009)', () => {
    expect(topeNivel([reto('app')])).toBe(3)
  })

  it('4 exige evidencia externa más dos contextos', () => {
    expect(topeNivel([externa('trabajo'), propia('casa')])).toBe(4)
  })

  it('los retos de Senda no alcanzan para 4 (D-009)', () => {
    expect(topeNivel([reto('app'), propia('trabajo'), propia('casa')])).toBe(3)
  })

  it('el código nunca registra 5 de forma automática', () => {
    const muchas = [externa('a'), externa('b'), externa('c'), propia('d')]
    expect(topeNivel(muchas)).toBe(4)
  })
})

describe('registrarNivel', () => {
  it('recorta el nivel propuesto y anota el sospechado', () => {
    expect(registrarNivel(4, [propia('trabajo')])).toEqual({ nivel: 2, sospechado: 4, confianza: 'baja' })
  })

  it('respeta el propuesto si la evidencia alcanza', () => {
    expect(registrarNivel(3, [externa('trabajo')])).toEqual({ nivel: 3, confianza: 'alta' })
  })

  it('no sube un nivel que nadie propuso', () => {
    expect(registrarNivel(1, [externa('a'), propia('b')]).nivel).toBe(1)
  })
})

describe('confianza', () => {
  it('baja con solo autoobservación, media con varios contextos, alta con externa', () => {
    expect(confianza([propia('a')])).toBe('baja')
    expect(confianza([propia('a'), propia('b')])).toBe('media')
    expect(confianza([propia('a'), externa('a')])).toBe('alta')
  })

  it('la formación no aporta confianza', () => {
    expect(confianza([curso('a')])).toBe('baja')
  })
})

describe('nivelTrasReto (D-009)', () => {
  it('sube como máximo un nivel por reto', () => {
    expect(nivelTrasReto(0, 3)).toBe(1)
    expect(nivelTrasReto(1, 3)).toBe(2)
  })

  it('no supera lo demostrado', () => {
    expect(nivelTrasReto(1, 1)).toBe(1)
  })

  it('no supera el tope de los retos', () => {
    expect(nivelTrasReto(3, 5)).toBe(3)
  })

  it('nunca baja el nivel actual', () => {
    expect(nivelTrasReto(4, 2)).toBe(4)
  })
})
