// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, it, vi } from 'vitest'
import { ErrorModelo, extraerJSON, type Adaptador } from './adaptador'
import { adaptadorAnthropic } from './anthropic'
import { generarJSON } from './cliente'
import { adaptadorCompatible } from './openai'
import { leerPrompt, prompt, rellenar, versionPrompt } from './prompts'

const evaluacion = { aprobado: true, puntaje: 82, nivel_demostrado: 2, fortalezas: 'claro', mejorar: 'más ejemplos' }

const varsReto = { nombre: 'Ana', habilidad: 'Estimar tiempos', meta: 2, reto: '{}', respuesta: 'mi respuesta' }

function respuestaJSON(cuerpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(cuerpo), { status, headers: { 'content-type': 'application/json' } })
}

function mensajeAnthropic(texto: string, stop_reason = 'end_turn') {
  return {
    id: 'msg_prueba', type: 'message', role: 'assistant', model: 'claude-opus-5-5',
    content: [{ type: 'text', text: texto }], stop_reason, stop_sequence: null,
    usage: { input_tokens: 10, output_tokens: 10 },
  }
}

describe('prompts', () => {
  it('todos los prompts del repositorio se leen y tienen versión', () => {
    for (const t of ['reglas', 'analizar-valor', 'analizar-objetivo', 'generar-ruta', 'crear-reto', 'evaluar-reto', 'evaluar-logro'] as const) {
      expect(prompt(t).version).toBeGreaterThanOrEqual(1)
    }
    expect(prompt('evaluar-reto').esfuerzo).toBe('high')
    expect(versionPrompt('evaluar-reto')).toMatch(/^evaluar-reto@\d+\+reglas@\d+$/)
  })

  it('los prompts son genéricos: no nombran a una persona concreta', () => {
    for (const t of ['reglas', 'analizar-valor', 'analizar-objetivo', 'generar-ruta', 'crear-reto', 'evaluar-reto', 'evaluar-logro'] as const) {
      expect(prompt(t).plantilla).not.toMatch(/Omar/)
    }
  })

  it('rellenar falla si falta una variable', () => {
    expect(rellenar('Hola {{nombre}}', { nombre: 'Ana' })).toBe('Hola Ana')
    expect(() => rellenar('{{a}} {{b}}', { a: 1 })).toThrow(/b/)
  })

  it('leerPrompt exige encabezado', () => {
    expect(() => leerPrompt('sin encabezado')).toThrow()
    expect(leerPrompt('---\ntarea: x\nversion: 2   # comentario\n---\ncuerpo')).toMatchObject({ tarea: 'x', version: 2, plantilla: 'cuerpo' })
  })
})

describe('extraerJSON', () => {
  it('tolera bloques de código y texto alrededor', () => {
    expect(extraerJSON('```json\n{"a":1}\n```')).toEqual({ a: 1 })
    expect(extraerJSON('Aquí va: {"a":2} listo')).toEqual({ a: 2 })
    expect(() => extraerJSON('nada')).toThrow(ErrorModelo)
  })
})

describe('generarJSON', () => {
  it('valida, firma y no reintenta si la respuesta es correcta', async () => {
    const generar = vi.fn().mockResolvedValue(evaluacion)
    const a: Adaptador = { proveedor: 'anthropic', modelo: 'claude-opus-5-5', generar }
    const r = await generarJSON(a, 'evaluar-reto', varsReto)
    expect(r.resultado).toEqual(evaluacion)
    expect(r.firma).toMatchObject({ proveedor: 'anthropic', modelo: 'claude-opus-5-5', version_prompt: versionPrompt('evaluar-reto') })
    expect(generar).toHaveBeenCalledTimes(1)
    const pedido = generar.mock.calls[0][0]
    expect(pedido.sistema).toContain('No infles')
    expect(pedido.usuario).toContain('Ana')
    expect(pedido.esfuerzo).toBe('high')
  })

  it('reintenta una vez con el error y luego falla', async () => {
    const generar = vi.fn().mockResolvedValueOnce({ aprobado: 'sí' }).mockResolvedValueOnce(evaluacion)
    const a: Adaptador = { proveedor: 'openai-compatible', modelo: 'x', generar }
    expect((await generarJSON(a, 'evaluar-reto', varsReto)).resultado.aprobado).toBe(true)
    expect(generar.mock.calls[1][0].usuario).toMatch(/no cumplía el formato/)

    const siempreMal = vi.fn().mockResolvedValue({})
    await expect(generarJSON({ ...a, generar: siempreMal }, 'evaluar-reto', varsReto)).rejects.toMatchObject({ codigo: 'formato' })
    expect(siempreMal).toHaveBeenCalledTimes(2)
  })

  it('no reintenta errores que no son de formato', async () => {
    const generar = vi.fn().mockRejectedValue(new ErrorModelo('clave', 'clave mala'))
    await expect(generarJSON({ proveedor: 'anthropic', modelo: 'm', generar }, 'evaluar-reto', varsReto)).rejects.toMatchObject({ codigo: 'clave' })
    expect(generar).toHaveBeenCalledTimes(1)
  })
})

describe('adaptador Anthropic', () => {
  it('envía la petición al API de mensajes con salida estructurada y respaldo', async () => {
    const f = vi.fn(async (_url: string | URL | Request, _init?: RequestInit) => respuestaJSON(mensajeAnthropic(JSON.stringify(evaluacion))))
    const a = adaptadorAnthropic({ clave: 'clave-de-prueba', modelo: 'claude-opus-5-5', fetch: f as unknown as typeof fetch })
    const r = await generarJSON(a, 'evaluar-reto', varsReto)
    expect(r.resultado).toEqual(evaluacion)
    const [url, init] = f.mock.calls[0]
    expect(String(url)).toContain('/v1/messages')
    const headers = new Headers(init!.headers)
    expect(headers.get('x-api-key')).toBe('clave-de-prueba')
    expect(headers.get('anthropic-dangerous-direct-browser-access')).toBe('true')
    expect(headers.get('anthropic-beta')).toContain('server-side-fallback-2026-07-01')
    const body = JSON.parse(String(init!.body))
    expect(body).toMatchObject({ model: 'claude-opus-5-5', fallbacks: 'default', output_config: { effort: 'high' } })
    expect(body.output_config.format.type).toBe('json_schema')
  })

  it('Haiku no lleva respaldo del servidor', async () => {
    const f = vi.fn(async (_url: string | URL | Request, _init?: RequestInit) => respuestaJSON(mensajeAnthropic(JSON.stringify(evaluacion))))
    const a = adaptadorAnthropic({ clave: 'k', modelo: 'claude-haiku-5-5', fetch: f as unknown as typeof fetch })
    await generarJSON(a, 'evaluar-reto', varsReto)
    const body = JSON.parse(String(f.mock.calls[0][1]!.body))
    expect(body.fallbacks).toBeUndefined()
  })

  it('traduce un rechazo y una clave inválida', async () => {
    const rechazo = vi.fn(async () => respuestaJSON(mensajeAnthropic('', 'refusal')))
    await expect(adaptadorAnthropic({ clave: 'k', modelo: 'claude-opus-5-5', fetch: rechazo as unknown as typeof fetch })
      .generar({ sistema: 's', usuario: 'u', esquema: (await import('./salidas')).SALIDAS['evaluar-reto'], esfuerzo: 'low' }))
      .rejects.toMatchObject({ codigo: 'rechazo' })

    const mala = vi.fn(async () => respuestaJSON({ type: 'error', error: { type: 'authentication_error', message: 'invalid x-api-key' } }, 401))
    await expect(adaptadorAnthropic({ clave: 'k', modelo: 'claude-opus-5-5', fetch: mala as unknown as typeof fetch })
      .generar({ sistema: 's', usuario: 'u', esquema: (await import('./salidas')).SALIDAS['evaluar-reto'], esfuerzo: 'low' }))
      .rejects.toMatchObject({ codigo: 'clave' })
  })
})

describe('adaptador OpenAI-compatible', () => {
  it('llama a /chat/completions con modo JSON y la clave opcional', async () => {
    const f = vi.fn(async (_url: string | URL | Request, _init?: RequestInit) =>
      respuestaJSON({ choices: [{ message: { content: '```json\n' + JSON.stringify(evaluacion) + '\n```' } }] }))
    const a = adaptadorCompatible({ base_url: 'http://localhost:11434/v1/', modelo: 'modelo-local', fetch: f as unknown as typeof fetch })
    const r = await generarJSON(a, 'evaluar-reto', varsReto)
    expect(r.resultado.puntaje).toBe(82)
    expect(r.firma.proveedor).toBe('openai-compatible')
    const [url, init] = f.mock.calls[0]
    expect(url).toBe('http://localhost:11434/v1/chat/completions')
    expect(new Headers(init!.headers).get('authorization')).toBeNull()
    expect(JSON.parse(String(init!.body))).toMatchObject({ model: 'modelo-local', response_format: { type: 'json_object' } })
  })

  it('traduce errores HTTP y de red', async () => {
    const esquema = (await import('./salidas')).SALIDAS['evaluar-reto']
    const p = { sistema: 's', usuario: 'u', esquema, esfuerzo: 'low' as const }
    const con = (f: () => Promise<Response>) => adaptadorCompatible({ base_url: 'https://x.test/v1', modelo: 'm', clave: 'k', fetch: f as unknown as typeof fetch })
    await expect(con(async () => new Response('', { status: 401 })).generar(p)).rejects.toMatchObject({ codigo: 'clave' })
    await expect(con(async () => new Response('', { status: 429 })).generar(p)).rejects.toMatchObject({ codigo: 'limite' })
    await expect(con(async () => { throw new TypeError('failed') }).generar(p)).rejects.toMatchObject({ codigo: 'red' })
  })
})
