// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import evidenciasMd from '../../../banco/evidencias-de-referencia.md?raw'
import casosMd from '../../../modelo/casos-de-prueba.md?raw'
import type { Adaptador, Pedido } from '../modelos/adaptador'
import { prompt, rellenar } from '../modelos/prompts'
import { categoriasEsperadas, leerCasos } from './casos'
import { evaluarCaso, leerEvidencias, leerHabilidades, variablesCaso, type ResultadoEvidencia } from './evidencias'
import { resumir, resumirEvidencias, type ResultadoCaso } from './metricas'

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
  // Evidencias sin aprobaciones indebidas, para aislar la clasificación.
  const evidencias = resumirEvidencias(Array.from({ length: 10 }, (_, i) => ({ id: `E-${i}`, esperado: i < 3, obtenido: i < 3, acierto: true, acordado: true, intentos: 1 })))

  it('sin el banco completo, nunca certifica', () => {
    const s = resumir([r(true, true), r(true, true)], { bancoCompleto: false })
    expect(s.etiqueta).toBe('Sin certificar')
    expect(s.notas.join(' ')).toMatch(/aprobación indebida/)
  })

  it('separa el acierto oficial (acordados) del provisional', () => {
    const s = resumir([r(true, true), r(false, false), r(false, false, 2)], { bancoCompleto: true, evidencias })
    expect(s.aciertoAcordados).toBe(1)
    expect(s.aciertoTodos).toBeCloseTo(1 / 3)
    expect(s.formato).toBeCloseTo(2 / 3)
    expect(s.etiqueta).toBe('Experimental')
  })

  it('recomienda solo si pasa los umbrales', () => {
    expect(resumir(Array.from({ length: 20 }, () => r(true, true)), { bancoCompleto: true, evidencias }).etiqueta).toBe('Recomendado')
    expect(resumir(Array.from({ length: 20 }, () => r(true, true)), { bancoCompleto: true }).etiqueta).toBe('Sin certificar')
  })
})

describe('evidencias de referencia (B.2c)', () => {
  const casos = leerEvidencias(evidenciasMd)

  it('lee todos los casos, con veredictos de los dos tipos', () => {
    expect(casos.map((c) => c.id)).toEqual(Array.from({ length: casos.length }, (_, i) => `E-${String(i + 1).padStart(2, '0')}`))
    expect(casos.length).toBeGreaterThanOrEqual(12)
    expect(casos.filter((c) => c.esperado).length).toBeGreaterThanOrEqual(3)
    expect(casos.filter((c) => !c.esperado).length).toBeGreaterThanOrEqual(8)
    expect(casos.find((c) => c.id === 'E-02')).toMatchObject({ imagen: 'resultado-72-alex.png', enlace: null, esperado: false, persona: 'Alex Ejemplo' })
    expect(casos.find((c) => c.id === 'E-06')?.habilidades).toEqual([{ nombre: 'expresarse oralmente en inglés', nivel: 2, meta: 4 }])
  })

  it('toda imagen citada existe en banco/imagenes', () => {
    const dir = path.resolve(__dirname, '../../../banco/imagenes')
    for (const c of casos.filter((c) => c.imagen)) expect(existsSync(path.join(dir, c.imagen!)), c.id).toBe(true)
  })

  it('cada caso completa el prompt real de la app sin variables faltantes', () => {
    for (const c of casos) {
      const texto = rellenar(prompt('evaluar-logro').plantilla, variablesCaso(c))
      expect(texto).toContain(c.criterio)
      expect(texto).toContain(c.imagen ? 'Imagen adjunta: sí' : 'Imagen adjunta: no')
    }
  })

  it('rechaza casos mal escritos en lugar de adivinar', () => {
    expect(() => leerHabilidades('hablar: nivel dos', 'E-99')).toThrow(/E-99/)
    const roto = '### E-01 · Roto\n- **Objetivo:** x\n- **Veredicto esperado:** QUIZÁS\n'
    expect(() => leerEvidencias(roto)).toThrow(/APROBAR/)
  })

  it('corre un caso con la imagen y registra los errores sin lanzar', async () => {
    let pedido: Pedido | undefined
    const falso: Adaptador = { proveedor: 'openai-compatible', modelo: 'falso', generar: async (p) => { pedido = p; return { aprobado: true, explicacion: 'x', falta: '' } } }
    const e02 = casos.find((c) => c.id === 'E-02')!
    const r = await evaluarCaso(falso, e02, async (nombre) => ({ tipo: 'image/png', base64: `img:${nombre}` }))
    expect(pedido?.imagenes).toEqual([{ tipo: 'image/png', base64: 'img:resultado-72-alex.png' }])
    expect(r).toMatchObject({ obtenido: true, acierto: false, intentos: 1 })

    const sinVision: Adaptador = { ...falso, generar: async () => { throw new Error('el modelo no admite imágenes') } }
    expect(await evaluarCaso(sinVision, e02, async () => ({ tipo: 'image/png', base64: '' }))).toMatchObject({ obtenido: null, acierto: false, error: 'el modelo no admite imágenes' })
  })
})

describe('métricas de evidencias', () => {
  const ev = (esperado: boolean, obtenido: boolean | null, acordado = true): ResultadoEvidencia =>
    ({ id: 'E', esperado, obtenido, acierto: obtenido === esperado, acordado, intentos: obtenido === null ? null : 1 })
  const clasif: ResultadoCaso = { numero: 1, concepto: 'x', esperadas: ['habilidad'], obtenida: 'habilidad', acierto: true, acordado: true, intentos: 1 }

  it('mide la aprobación indebida (oficial y provisional) y el rechazo indebido', () => {
    const s = resumirEvidencias([ev(false, true), ev(false, false), ev(false, true, false), ev(false, null), ev(true, false), ev(true, true)])
    expect(s.aprobacionIndebidaAcordados).toBeCloseTo(1 / 3)
    expect(s.aprobacionIndebida).toBeCloseTo(2 / 4)
    expect(s.rechazoIndebido).toBeCloseTo(1 / 2)
    expect(s.errores).toBe(1)
  })

  it('sin negativos acordados no hay resultado oficial y no se certifica', () => {
    const s = resumirEvidencias([ev(false, false, false), ev(true, true, false)])
    expect(s.aprobacionIndebidaAcordados).toBeNull()
    expect(resumir(Array(20).fill(clasif), { bancoCompleto: true, evidencias: s }).etiqueta).toBe('Sin certificar')
  })

  it('una sola aprobación indebida impide "Recomendado"', () => {
    const limpias = resumirEvidencias([...Array(12).fill(ev(false, false)), ...Array(4).fill(ev(true, true))])
    const una = resumirEvidencias([ev(false, true), ...Array(11).fill(ev(false, false)), ...Array(4).fill(ev(true, true))])
    expect(resumir(Array(20).fill(clasif), { bancoCompleto: true, evidencias: limpias }).etiqueta).toBe('Recomendado')
    expect(resumir(Array(20).fill(clasif), { bancoCompleto: true, evidencias: una }).etiqueta).toBe('Aceptable')
  })

  it('mientras falte la prueba de retos, nunca certifica aunque las evidencias salgan perfectas', () => {
    const limpias = resumirEvidencias(Array(10).fill(ev(false, false)))
    const s = resumir(Array(20).fill(clasif), { bancoCompleto: false, evidencias: limpias })
    expect(s.etiqueta).toBe('Sin certificar')
    expect(s.notas.join(' ')).toMatch(/retos/)
  })
})
