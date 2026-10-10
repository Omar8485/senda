// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Adaptador OpenAI-compatible (/chat/completions): OpenAI, Gemini, OpenRouter, Ollama, LM Studio…
// Cada proveedor decide si acepta llamadas desde el navegador (CORS); ver docs/arquitectura.md §6.2.

import { ErrorModelo, extraerJSON, type Adaptador, type Pedido } from './adaptador'

/** Direcciones conocidas para completar el formulario. El modelo lo escribe la persona. */
export const PROVEEDORES_COMPATIBLES = [
  { nombre: 'OpenAI', base_url: 'https://api.openai.com/v1' },
  { nombre: 'Google Gemini', base_url: 'https://generativelanguage.googleapis.com/v1beta/openai' },
  { nombre: 'OpenRouter', base_url: 'https://openrouter.ai/api/v1' },
  { nombre: 'Ollama (en tu equipo)', base_url: 'http://localhost:11434/v1' },
  { nombre: 'LM Studio (en tu equipo)', base_url: 'http://localhost:1234/v1' },
] as const

export interface OpcionesCompatible {
  base_url: string
  modelo: string
  /** Opcional: los modelos locales no la necesitan. */
  clave?: string
  fetch?: typeof fetch
}

export function adaptadorCompatible({ base_url, modelo, clave, fetch: f = globalThis.fetch.bind(globalThis) }: OpcionesCompatible): Adaptador {
  const url = `${base_url.replace(/\/+$/, '')}/chat/completions`
  return {
    proveedor: 'openai-compatible',
    modelo,
    async generar({ sistema, usuario, imagenes }: Pedido) {
      const contenido = imagenes?.length
        ? [
            ...imagenes.map((img) => ({ type: 'image_url', image_url: { url: `data:${img.tipo};base64,${img.base64}` } })),
            { type: 'text', text: usuario },
          ]
        : usuario
      let r: Response
      try {
        r = await f(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json', ...(clave ? { authorization: `Bearer ${clave}` } : {}) },
          body: JSON.stringify({
            model: modelo,
            messages: [{ role: 'system', content: sistema }, { role: 'user', content: contenido }],
            response_format: { type: 'json_object' },
          }),
        })
      } catch {
        throw new ErrorModelo('red', `No se pudo conectar con ${base_url}. Revisa la dirección, tu conexión y que el proveedor acepte llamadas desde el navegador.`)
      }
      if (r.status === 401 || r.status === 403) throw new ErrorModelo('clave', 'La clave no es válida o no tiene permiso. Revísala en Configuración.')
      if (r.status === 429) throw new ErrorModelo('limite', 'Demasiadas consultas seguidas. Espera un momento.')
      if (!r.ok) throw new ErrorModelo('proveedor', `Error del proveedor (${r.status}). Intenta de nuevo.`)
      const datos = (await r.json().catch(() => null)) as { choices?: { message?: { content?: string; refusal?: string } }[] } | null
      const msg = datos?.choices?.[0]?.message
      if (msg?.refusal) throw new ErrorModelo('rechazo', 'El modelo declinó responder esta petición.')
      if (typeof msg?.content !== 'string') throw new ErrorModelo('formato', 'La respuesta del proveedor no tiene el formato esperado.')
      return extraerJSON(msg.content)
    },
  }
}
