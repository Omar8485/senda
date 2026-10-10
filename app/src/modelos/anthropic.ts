// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Adaptador para los modelos Claude, con el SDK oficial desde el navegador.
// La clave la pone cada persona y queda solo en su dispositivo (docs/arquitectura.md §6.2).

import Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import { ErrorModelo, extraerJSON, type Adaptador, type Pedido } from './adaptador'

/** Modelos que se ofrecen en el selector. El primero es el predeterminado. */
export const MODELOS_ANTHROPIC = [
  { id: 'claude-opus-5-5', nombre: 'Claude Opus 5.5' },
  { id: 'claude-sonnet-5-5', nombre: 'Claude Sonnet 5.5' },
  { id: 'claude-haiku-5-5', nombre: 'Claude Haiku 5.5' },
  { id: 'claude-fable-5-1', nombre: 'Claude Fable 5.1' },
] as const

/**
 * Modelos con respaldo automático del lado del servidor: si un clasificador de seguridad
 * declina la petición, la API la repite en otro modelo dentro de la misma llamada.
 */
const CON_RESPALDO = new Set(['claude-opus-5-5', 'claude-fable-5-1', 'claude-opus-5', 'claude-sonnet-5-5'])

export interface OpcionesAnthropic {
  clave: string
  modelo: string
  /** Para pruebas: fetch simulado. */
  fetch?: typeof fetch
}

export function adaptadorAnthropic({ clave, modelo, fetch: f }: OpcionesAnthropic): Adaptador {
  const client = new Anthropic({ apiKey: clave, dangerouslyAllowBrowser: true, maxRetries: 2, ...(f ? { fetch: f } : {}) })

  return {
    proveedor: 'anthropic',
    modelo,
    async generar({ sistema, usuario, esquema, esfuerzo, imagenes }: Pedido) {
      const contenido: Anthropic.Beta.BetaContentBlockParam[] = [
        ...(imagenes ?? []).map((img) => ({
          type: 'image' as const,
          source: { type: 'base64' as const, media_type: img.tipo as 'image/png', data: img.base64 },
        })),
        { type: 'text' as const, text: usuario },
      ]
      try {
        const respaldo = CON_RESPALDO.has(modelo)
        const r = await client.beta.messages.create({
          model: modelo,
          max_tokens: 16000,
          system: sistema,
          messages: [{ role: 'user', content: contenido }],
          output_config: { effort: esfuerzo, format: betaZodOutputFormat(esquema) },
          ...(respaldo ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const } : {}),
        })
        if (r.stop_reason === 'refusal') {
          throw new ErrorModelo('rechazo', 'El modelo declinó responder esta petición. Revisa el texto o prueba con otro modelo.')
        }
        if (r.stop_reason === 'max_tokens') {
          throw new ErrorModelo('formato', 'La respuesta del modelo quedó cortada. Intenta de nuevo.')
        }
        // Se valida después con Zod en generarJSON; aquí solo se extrae el JSON.
        const texto = r.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('')
        return extraerJSON(texto)
      } catch (e) {
        throw traducirError(e)
      }
    },
  }
}

function traducirError(e: unknown): Error {
  if (e instanceof ErrorModelo) return e
  if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) {
    return new ErrorModelo('clave', 'La clave de Anthropic no es válida o no tiene permiso. Revísala en Configuración.')
  }
  if (e instanceof Anthropic.RateLimitError) return new ErrorModelo('limite', 'Demasiadas consultas seguidas. Espera un momento.')
  if (e instanceof Anthropic.BadRequestError) return new ErrorModelo('proveedor', `El proveedor rechazó la petición: ${e.message}`)
  if (e instanceof Anthropic.APIConnectionError) return new ErrorModelo('red', 'No se pudo conectar con Anthropic. Revisa tu conexión.')
  if (e instanceof Anthropic.APIError) return new ErrorModelo('proveedor', `Error del proveedor (${e.status ?? '?'}). Intenta de nuevo.`)
  if (e instanceof SyntaxError) return new ErrorModelo('formato', 'La respuesta del modelo no era un JSON válido.')
  return e instanceof Error ? e : new Error(String(e))
}
