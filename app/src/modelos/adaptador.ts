// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Interfaz común de los proveedores de IA (docs/arquitectura.md §6). La app no sabe de proveedores.

import type { z } from 'zod'
import type { Esfuerzo } from './prompts'

export interface Imagen {
  /** image/png, image/jpeg, image/webp o image/gif */
  tipo: string
  /** Contenido en base64, sin el prefijo data: */
  base64: string
}

export interface Pedido {
  sistema: string
  usuario: string
  esquema: z.ZodType
  esfuerzo: Esfuerzo
  imagenes?: Imagen[]
}

export interface Adaptador {
  proveedor: 'anthropic' | 'openai-compatible'
  modelo: string
  /** Devuelve el JSON de la respuesta, todavía sin validar. */
  generar(pedido: Pedido): Promise<unknown>
}

export type CodigoError = 'clave' | 'limite' | 'red' | 'rechazo' | 'formato' | 'proveedor'

/** Error con un mensaje para la persona y un código para decidir qué hacer. */
export class ErrorModelo extends Error {
  readonly codigo: CodigoError
  constructor(codigo: CodigoError, mensaje: string) {
    super(mensaje)
    this.name = 'ErrorModelo'
    this.codigo = codigo
  }
}

/** Extrae el primer objeto JSON de un texto (tolera bloques ``` y texto alrededor). */
export function extraerJSON(texto: string): unknown {
  const limpio = texto.replace(/```(?:json)?/gi, '').trim()
  try {
    return JSON.parse(limpio)
  } catch {
    const inicio = limpio.indexOf('{')
    const fin = limpio.lastIndexOf('}')
    if (inicio >= 0 && fin > inicio) {
      try {
        return JSON.parse(limpio.slice(inicio, fin + 1))
      } catch {
        // cae al error de abajo
      }
    }
    throw new ErrorModelo('formato', 'La respuesta del modelo no era un JSON válido.')
  }
}
