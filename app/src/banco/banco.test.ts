// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, it } from 'vitest'
import casosMd from '../../../modelo/casos-de-prueba.md?raw'
import { categoriasEsperadas, leerCasos } from './casos'
import { resumir, type ResultadoCaso } from './metricas'

describe('casos de clasificación', () => {
  it('interpreta la columna de clasificación esperada', () => {
    expect(categoriasEsperadas('**PARAGUAS** → (a) competencia …')).toEqual(['paraguas'])
    expect(categoriasEsperadas('VALOR o PRINCIPIO según cómo se formule')).toEqual(['valor', 'principio'])
    expect(categoriasEsperadas('COMPETENCIA amplia (o DIRECCIÓN, si se formula como trayectoria)')).toEqual(['competencia', 'direccion'])
    expect(categoriasEsperadas('HABILIDAD (cognitiva)')).toEqual(['habilidad'])
    expect(categoriasEsperadas('NO ES ENTIDAD: es una **propiedad**')).toEqual(['otro'])
    expect(categoriasEsperadas('APTITUD (función cognitiva basal)')).toEqual(['aptitud'])
  })

  it('lee todos los casos del modelo y el acuerdo de Omar', () => {
    const casos = leerCasos(casosMd)
    expect(casos.length).toBeGreaterThanOrEqual(23)
    expect(casos.find((c) => c.numero === 2)).toMatchObject({ concepto: 'Inglés', esperadas: ['campo'] })
    expect(casos.find((c) => c.numero === 21)).toMatchObject({ esperadas: ['aptitud'], acordado: true })
    expect(casos.find((c) => c.numero === 23)).toMatchObject({ esperadas: ['paraguas'], acordado: false })
    expect(casos.every((c) => c.esperadas.length > 0)).toBe(true)
  })
})

describe('métricas', () => {
  const r = (acierto: boolean, acordado: boolean, intentos = 1): ResultadoCaso => ({ numero: 1, concepto: 'x', esperadas: ['habilidad'], obtenida: 'habilidad', acierto, acordado, intentos })

  it('sin el banco completo, nunca certifica', () => {
    const s = resumir([r(true, true), r(true, true)], { bancoCompleto: false })
    expect(s.etiqueta).toBe('Sin certificar')
    expect(s.notas.join(' ')).toMatch(/aprobación indebida/)
  })

  it('separa el acierto oficial (acordados) del provisional', () => {
    const s = resumir([r(true, true), r(false, false), r(false, false, 2)], { bancoCompleto: true })
    expect(s.aciertoAcordados).toBe(1)
    expect(s.aciertoTodos).toBeCloseTo(1 / 3)
    expect(s.formato).toBeCloseTo(2 / 3)
    expect(s.etiqueta).toBe('Experimental')
  })

  it('recomienda solo si pasa los umbrales', () => {
    expect(resumir(Array.from({ length: 20 }, () => r(true, true)), { bancoCompleto: true }).etiqueta).toBe('Recomendado')
  })
})
