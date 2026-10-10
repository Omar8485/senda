// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { abrirDB, type SendaDB } from '../datos/db'
import { guardar } from '../datos/repositorio'
import type { Adaptador, Pedido } from '../modelos/adaptador'
import { xpTotal } from '../nucleo'
import {
  aceptarObjetivo, aceptarValor, analizarValor, autoevaluar, completarNodo, crearReto, editarValor, evaluarLogro,
  evaluarReto, generarRuta, marcarLogrado, nodoActual, registrarEvidencia,
} from './acciones'
import { adaptadorActual, guardarConfigModelo, tieneClave } from './config-modelo'

/** Modelo falso: responde según la tarea, reconocida por el texto del prompt. */
function modeloFalso(respuestas: Record<string, unknown>): Adaptador & { pedidos: Pedido[] } {
  const pedidos: Pedido[] = []
  return {
    proveedor: 'anthropic', modelo: 'modelo-falso', pedidos,
    async generar(p) {
      pedidos.push(p)
      const clave = Object.keys(respuestas).find((k) => p.usuario.includes(k))
      if (!clave) throw new Error(`Sin respuesta para: ${p.usuario.slice(0, 60)}`)
      return respuestas[clave]
    },
  }
}

const analisisValor = {
  clasificacion: 'valor', explicacion: 'Es una cualidad de la acción.', enunciado: 'Cumplir a tiempo lo que comprometo', corto: 'Cumplir a tiempo',
  contextos: [
    { situacion: 'Entregas del trabajo', habilidades: [
      { id: 'hab-estimar-tiempos', nombre: 'Estimar tiempos', tipo: 'cognitiva', clase: 'indispensable', nivel_minimo: 3, por_que: 'Para planificar' },
      { id: 'Hab Mal Escrita!', nombre: 'Decir que no', tipo: 'interpersonal', clase: 'indispensable', nivel_minimo: 7, por_que: 'Para no sobrecargarse' },
    ] },
  ],
}

let db: SendaDB
let n = 0
beforeEach(async () => {
  db = abrirDB(`acciones-${++n}`)
  await guardar(db, 'perfil', { id: 'perfil', nombre: 'Ana' } as never)
})
afterEach(async () => { await db.delete() })

async function crearValor() {
  const m = modeloFalso({ 'elige vivir': analisisValor })
  const a = await analizarValor(m, db, { texto: 'quiero ser puntual', area: 'transversal' })
  expect(m.pedidos[0].usuario).toContain('Ana')
  return aceptarValor(db, { analisis: a.resultado, enunciado: a.resultado.enunciado, texto: 'quiero ser puntual', area: 'transversal', elegidas: a.resultado.contextos[0].habilidades })
}

describe('valores', () => {
  it('crea el valor y sus habilidades con ids válidos y niveles recortados', async () => {
    const r = await crearValor()
    expect(r).toMatchObject({ id: 'val-cumplir-a-tiempo', creadas: 2 })
    expect(r.habilidades).toEqual(['hab-estimar-tiempos', 'hab-decir-que-no'])
    expect(await db.habilidades.get('hab-decir-que-no')).toMatchObject({ requerido: 5, nivel: null, fuentes: ['val-cumplir-a-tiempo'] })
    const v = await db.valores.get('val-cumplir-a-tiempo')
    expect(v?.situaciones[0].habilidades).toEqual(['hab-estimar-tiempos', 'hab-decir-que-no'])
  })

  it('editar guarda historial solo si algo cambió', async () => {
    const { id } = await crearValor()
    await editarValor(db, id, { importancia: 8 })
    const v = await editarValor(db, id, { importancia: 8 })
    expect(v.historial.map((h) => h.cambio)).toEqual(['creado en Senda', 'editado: importancia'])
  })
})

describe('objetivos y logro', () => {
  const analisisObj = { es_objetivo: true, observacion: '', titulo: 'Terminar curso', enunciado: 'Terminar el curso', criterio: 'Certificado emitido', habilidades: [
    { id: 'hab-estimar-tiempos', nombre: 'Estimar tiempos', tipo: 'cognitiva', nivel_requerido: 4, por_que: 'x' },
  ] }

  it('exige al menos un valor', async () => {
    await expect(aceptarObjetivo(db, { ...analisisObj, fecha: null, area: 'educacion', valores: [], texto: 't', elegidas: [] })).rejects.toThrow(/al menos a un valor/)
  })

  it('reutiliza habilidades existentes y sube el nivel requerido', async () => {
    const { id: vid } = await crearValor()
    const r = await aceptarObjetivo(db, { ...analisisObj, fecha: '2026-12-01', area: 'educacion', valores: [vid], texto: 't', elegidas: analisisObj.habilidades as never })
    expect(r.creadas).toBe(0)
    expect(await db.habilidades.get('hab-estimar-tiempos')).toMatchObject({ requerido: 4, fuentes: ['val-cumplir-a-tiempo', r.id] })
  })

  it('sin evidencia aprobada no hay logro; con ella sí, y suma 100 XP', async () => {
    const { id: vid } = await crearValor()
    const { id } = await aceptarObjetivo(db, { ...analisisObj, fecha: null, area: 'educacion', valores: [vid], texto: 't', elegidas: [] })

    const rechazo = modeloFalso({ LOGRADO: { aprobado: false, explicacion: 'No hay respaldo.', falta: 'el certificado' } })
    const r1 = await evaluarLogro(rechazo, db, { objetivo: id, descripcion: 'Ya terminé el curso, lo juro' })
    expect(r1.evidencia).toBeUndefined()
    expect((await db.objetivos.get(id))?.intentos_logro).toHaveLength(1)
    await expect(marcarLogrado(db, id, 'ev-inventada')).rejects.toThrow(/evidencia aprobada/)

    const aprueba = modeloFalso({ LOGRADO: { aprobado: true, explicacion: 'El enlace lo respalda.', falta: '' } })
    const r2 = await evaluarLogro(aprueba, db, { objetivo: id, descripcion: 'Certificado recibido', enlace: 'https://ejemplo.org/c' })
    const ev = await db.evidencias.get(r2.evidencia!)
    expect(ev).toMatchObject({ fuente: 'logro', externa: true })
    expect(ev?.evaluacion?.firma.modelo).toBe('modelo-falso')
    await marcarLogrado(db, id, r2.evidencia!)
    expect((await db.objetivos.get(id))?.estado).toBe('logrado')
    expect(xpTotal(await db.eventos_xp.toArray())).toBe(100)
  })
})

describe('rutas', () => {
  it('genera, filtra habilidades desconocidas y completa sesiones con XP por minuto', async () => {
    const { id, habilidades } = await crearValor()
    const m = modeloFalso({ 'ruta de práctica': {
      titulo: 'Ruta', descripcion: 'd',
      unidades: [{ titulo: 'Semana 1', nodos: [
        { tipo: 'sesion', titulo: 'S1', tareas: [{ texto: 'a', min: 20 }, { texto: 'b', min: 10.4 }], habilidades: ['hab-estimar-tiempos', 'hab-inventada'] },
        { tipo: 'reto', titulo: 'R', tareas: [], habilidades: ['hab-estimar-tiempos'] },
      ] }],
    } })
    const r = await generarRuta(m, db, { fuente: id, habilidades })
    expect(r.unidades[0].nodos[0].habilidades).toEqual(['hab-estimar-tiempos'])
    expect(nodoActual(r)).toEqual({ u: 0, n: 0 })
    await expect(completarNodo(db, r.id, 0, 0, [])).rejects.toThrow(/al menos una tarea/)
    const hecha = await completarNodo(db, r.id, 0, 0, [0, 1])
    expect(nodoActual(hecha)).toEqual({ u: 0, n: 1 })
    expect(xpTotal(await db.eventos_xp.toArray())).toBe(30)
  })
})

describe('retos (D-009)', () => {
  const reto = { titulo: 'Plan semanal', instrucciones: 'Haz un plan', material: '', criterios: ['a', 'b', 'c'], verificable_por_texto: true }

  async function retar(respuestas: unknown, verificable = true) {
    await crearValor()
    const r = await crearReto(modeloFalso({ 'Prepara UN reto': { ...reto, verificable_por_texto: verificable } }), db, 'hab-estimar-tiempos')
    expect(r.meta).toBe(1)
    return evaluarReto(modeloFalso({ 'Evalúa con rigor': respuestas }), db, { habilidad: 'hab-estimar-tiempos', reto: r, respuesta: 'mi plan' })
  }

  it('aprobado: sube un nivel aunque el modelo diga más, y confianza media sin rúbrica', async () => {
    const r = await retar({ aprobado: true, puntaje: 95, nivel_demostrado: 5, fortalezas: '', mejorar: '' })
    expect(r).toMatchObject({ nivelAntes: null, nivelDespues: 1, xp: 50 })
    expect(await db.habilidades.get('hab-estimar-tiempos')).toMatchObject({ nivel: 1, confianza: 'media' })
    const evs = await db.evidencias.where('habilidad').equals('hab-estimar-tiempos').toArray()
    expect(evs[0]).toMatchObject({ fuente: 'reto-senda', externa: true, tipo: 'evaluacion' })
  })

  it('no aprobado: el nivel no cambia y suma 15 XP', async () => {
    const r = await retar({ aprobado: false, puntaje: 40, nivel_demostrado: 0, fortalezas: '', mejorar: '' })
    expect(r).toMatchObject({ nivelDespues: null, xp: 15 })
  })

  it('no verificable por texto: queda como evidencia sin subir nivel', async () => {
    const r = await retar({ aprobado: true, puntaje: 90, nivel_demostrado: 2, fortalezas: '', mejorar: '' }, false)
    expect(r).toMatchObject({ nivelDespues: null, verificable: false })
  })

  it('un reto nunca lleva más allá de 3', async () => {
    await crearValor()
    const h = (await db.habilidades.get('hab-estimar-tiempos'))!
    await guardar(db, 'habilidades', { ...h, nivel: 3 })
    const r = await crearReto(modeloFalso({ 'Prepara UN reto': reto }), db, h.id)
    const res = await evaluarReto(modeloFalso({ 'Evalúa con rigor': { aprobado: true, puntaje: 99, nivel_demostrado: 4, fortalezas: '', mejorar: '' } }), db, { habilidad: h.id, reto: r, respuesta: 'x' })
    expect(res.nivelDespues).toBe(3)
  })
})

describe('evidencia y autoevaluación (regla 02)', () => {
  it('la evidencia no cambia el nivel; la autoevaluación lo recorta al tope', async () => {
    await crearValor()
    await registrarEvidencia(db, { habilidad: 'hab-estimar-tiempos', descripcion: 'Estimé mi semana', contexto: 'trabajo', tipo: 'autoobservacion', externa: false })
    expect(await db.habilidades.get('hab-estimar-tiempos')).toMatchObject({ nivel: null, revision_pendiente: true })

    const r1 = await autoevaluar(db, 'hab-estimar-tiempos', 4)
    expect(r1.registrado).toEqual({ nivel: 2, sospechado: 4, confianza: 'baja' })

    await registrarEvidencia(db, { habilidad: 'hab-estimar-tiempos', descripcion: 'Planifiqué un viaje', contexto: 'casa', tipo: 'autoobservacion', externa: false })
    const r2 = await autoevaluar(db, 'hab-estimar-tiempos', 4)
    expect(r2.registrado).toEqual({ nivel: 3, sospechado: 4, confianza: 'media' })
    expect(xpTotal(await db.eventos_xp.toArray())).toBe(40)
  })
})

describe('configuración del modelo', () => {
  it('guarda la clave aparte y construye el adaptador', async () => {
    expect(await adaptadorActual(db)).toBeNull()
    await guardarConfigModelo(db, { proveedor: 'anthropic', modelo: 'claude-opus-5-5' }, 'clave-de-prueba')
    expect(await tieneClave(db, { proveedor: 'anthropic', modelo: 'claude-opus-5-5' })).toBe(true)
    expect((await db.perfil.get('perfil'))?.modelo).toEqual({ proveedor: 'anthropic', modelo: 'claude-opus-5-5' })
    expect(JSON.stringify(await db.perfil.get('perfil'))).not.toContain('clave-de-prueba')
    expect((await adaptadorActual(db))?.modelo).toBe('claude-opus-5-5')

    await guardarConfigModelo(db, { proveedor: 'openai-compatible', modelo: 'llama', base_url: 'http://localhost:11434/v1' })
    expect((await adaptadorActual(db))?.proveedor).toBe('openai-compatible')
  })
})
