// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { abrirDB, type SendaDB } from './db'
import { idNuevo, slug } from './ids'
import { convertirPrototipo } from './prototipo'
import { agregar, guardar } from './repositorio'
import { borrarTodo, exportar, importar, validarRespaldo } from './respaldo'
import ejemplo from './ejemplos/prototipo-inventado.json'

let db: SendaDB
let n = 0
beforeEach(() => { db = abrirDB(`prueba-${++n}`) })
afterEach(async () => { await db.delete() })

describe('ids', () => {
  it('slug en kebab-case sin tildes ni eñes', () => {
    expect(slug('Año de Cumplir a Tiempo!')).toBe('ano-de-cumplir-a-tiempo')
    expect(slug('¿?')).toBe('x')
  })

  it('idNuevo evita choques', () => {
    const usados = new Set(['val-calma', 'val-calma-2'])
    expect(idNuevo('val', 'Calma', (id) => usados.has(id))).toBe('val-calma-3')
  })
})

describe('repositorio', () => {
  it('guardar valida, pone campos de control y sube la versión', async () => {
    const a = await guardar(db, 'valores', { id: 'val-a', tipo: 'valor', enunciado: 'Escuchar antes de responder' } as never)
    expect(a.version).toBe(1)
    expect(a.estado).toBe('activo')
    const b = await guardar(db, 'valores', { ...a, corto: 'Escuchar' })
    expect(b.version).toBe(2)
    expect(b.creado).toBe(a.creado)
  })

  it('guardar rechaza datos que no cumplen el esquema', async () => {
    await expect(guardar(db, 'habilidades', { id: 'hab-x', nombre: 'X', nivel: 7 } as never)).rejects.toThrow()
  })

  it('las evidencias solo se agregan', async () => {
    const e = await agregar(db, 'evidencias', {
      id: 'ev-1', habilidad: 'hab-a', fecha: '2026-10-01', tipo: 'autoobservacion', externa: false, contexto: 'casa', descripcion: 'hice algo',
    } as never)
    expect(e.version).toBe(1)
    await expect(agregar(db, 'evidencias', { ...e })).rejects.toThrow(/no se modifican/)
  })
})

describe('respaldo', () => {
  it('exportar e importar conservan todo, sin claves de API', async () => {
    await guardar(db, 'perfil', { id: 'perfil', nombre: 'Ana' } as never)
    await guardar(db, 'valores', { id: 'val-a', tipo: 'valor', enunciado: 'Escuchar' } as never)
    await agregar(db, 'eventos_xp', { fecha: '2026-10-01', cantidad: 20, motivo: 'práctica' } as never)
    await db.secretos.put({ id: 'clave-anthropic', valor: 'clave-de-prueba' })

    const r = await exportar(db)
    expect(JSON.stringify(r)).not.toContain('clave-de-prueba')
    expect(r.datos.valores).toHaveLength(1)

    const otra = abrirDB(`prueba-otra-${n}`)
    const res = await importar(otra, JSON.parse(JSON.stringify(r)))
    expect(res).toMatchObject({ ok: true, conteo: { valores: 1, eventos_xp: 1, perfil: 1 } })
    expect(await otra.valores.get('val-a')).toMatchObject({ enunciado: 'Escuchar' })
    await otra.delete()
  })

  it('un respaldo inválido no toca la base y explica el error', async () => {
    await guardar(db, 'valores', { id: 'val-a', tipo: 'valor', enunciado: 'Escuchar' } as never)
    const res = await importar(db, { formato: 'otro' })
    expect(res.ok).toBe(false)
    expect(res.errores.join(' ')).toMatch(/formato/)
    expect(await db.valores.count()).toBe(1)
  })

  it('borrarTodo elimina datos y claves', async () => {
    await guardar(db, 'valores', { id: 'val-a', tipo: 'valor', enunciado: 'Escuchar' } as never)
    await db.secretos.put({ id: 'k', valor: 'v' })
    await borrarTodo(db)
    expect(await db.valores.count()).toBe(0)
    expect(await db.secretos.count()).toBe(0)
  })
})

describe('importador del prototipo', () => {
  const r = convertirPrototipo(ejemplo, { nombre: 'Ana', ahora: new Date('2026-10-10T12:00:00Z') })

  it('produce un respaldo válido', () => {
    expect(validarRespaldo(r).errores).toEqual([])
  })

  it('migra perfil, valores y principios', () => {
    expect(r.datos.perfil[0]).toMatchObject({ nombre: 'Ana', avatar: 'a3', minutos_dia: 45, mayor_de_edad: false })
    const v = r.datos.valores.find((x) => x.id === 'val-cumplir-a-tiempo')!
    expect(v).toMatchObject({ origen: 'prototipo', area: 'transversal', importancia: 9, pendiente_ficha: true })
    // Las situaciones pasan de nombres de habilidad a identificadores.
    expect(v.situaciones[0].habilidades).toEqual(['hab-estimar-tiempos-de-tareas'])
    expect(r.datos.valores.find((x) => x.id === 'prin-no-mentir')!.tipo).toBe('principio')
    expect(r.datos.valores.find((x) => x.id === 'val-viejo')).toMatchObject({ estado: 'archivado', area: undefined })
  })

  it('separa las evidencias y marca los retos de Senda', () => {
    const evs = r.datos.evidencias.filter((e) => e.habilidad === 'hab-estimar-tiempos-de-tareas')
    expect(evs.map((e) => e.fuente)).toEqual(['reto-senda', 'manual'])
    expect(r.datos.habilidades.find((h) => h.id === 'hab-estimar-tiempos-de-tareas')).toMatchObject({ nivel: 2, sospechado: 3, requerido: 3 })
    expect(r.datos.habilidades.find((h) => h.id === 'hab-tocar-guitarra')).toMatchObject({ nivel: null, estado: 'pausada' })
  })

  it('un logro con evidencia queda firmado; uno sin evidencia vuelve a activo', () => {
    const o = r.datos.objetivos.find((x) => x.id === 'obj-terminar-curso')!
    expect(o.estado).toBe('logrado')
    const ev = r.datos.evidencias.find((e) => e.id === o.evidencia_logro)!
    expect(ev).toMatchObject({ objetivo: 'obj-terminar-curso', fuente: 'logro', externa: true })
    expect(ev.evaluacion?.firma.version_prompt).toBe('prototipo-v0.1')
    expect(r.datos.objetivos.find((x) => x.id === 'obj-sin-evidencia')!.estado).toBe('activo')
  })

  it('conserva el XP total repartido en eventos', () => {
    const total = r.datos.eventos_xp.reduce((s, e) => s + e.cantidad, 0)
    expect(total).toBe(320)
    expect(r.datos.eventos_xp.find((e) => e.habilidades.includes('hab-estimar-tiempos-de-tareas'))!.cantidad).toBe(120)
    expect(r.datos.eventos_xp.every((e) => e.fecha === '2026-10-08')).toBe(true)
  })

  it('migra las rutas con el estado de cada nodo', () => {
    expect(r.datos.rutas[0]).toMatchObject({ fuente: 'val-cumplir-a-tiempo' })
    expect(r.datos.rutas[0].unidades[0].nodos.map((x) => x.estado)).toEqual(['hecho', 'pendiente'])
  })

  it('se puede importar a la base', async () => {
    expect((await importar(db, r)).ok).toBe(true)
    expect(await db.habilidades.count()).toBe(2)
  })

  it('rechaza lo que no es una base', () => {
    expect(() => convertirPrototipo(null, { nombre: 'Ana' })).toThrow(/formato/)
  })
})
