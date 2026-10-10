// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// generarJSON: la única puerta de la app hacia los modelos (docs/arquitectura.md §6.1).
// Completa el prompt versionado, llama al adaptador, valida con el esquema (un reintento con el
// error) y devuelve el resultado firmado con proveedor, modelo y versión del prompt.

import type { FirmaModelo } from '../datos/esquemas'
import { ErrorModelo, type Adaptador, type Imagen } from './adaptador'
import { prompt, rellenar, versionPrompt, type Tarea } from './prompts'
import { SALIDAS, type Salida } from './salidas'

export interface Firmado<T> {
  resultado: T
  firma: FirmaModelo
}

export async function generarJSON<T extends Tarea>(
  adaptador: Adaptador,
  tarea: T,
  variables: Record<string, string | number>,
  opciones: { imagenes?: Imagen[] } = {},
): Promise<Firmado<Salida<T>>> {
  const p = prompt(tarea)
  const esquema = SALIDAS[tarea]
  const sistema = prompt('reglas').plantilla
  const usuario = rellenar(p.plantilla, variables)

  let error = ''
  for (let intento = 0; intento < 2; intento++) {
    const texto = error
      ? `${usuario}\n\nTu respuesta anterior no cumplía el formato pedido (${error}). Responde de nuevo solo con el JSON pedido.`
      : usuario
    let crudo: unknown
    try {
      crudo = await adaptador.generar({ sistema, usuario: texto, esquema, esfuerzo: p.esfuerzo, imagenes: opciones.imagenes })
    } catch (e) {
      if (e instanceof ErrorModelo && e.codigo === 'formato' && intento === 0) {
        error = e.message
        continue
      }
      throw e
    }
    const r = esquema.safeParse(crudo)
    if (r.success) {
      return {
        resultado: r.data as Salida<T>,
        firma: { proveedor: adaptador.proveedor, modelo: adaptador.modelo, version_prompt: versionPrompt(tarea), fecha: new Date().toISOString() },
      }
    }
    error = r.error.issues.slice(0, 3).map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
  }
  throw new ErrorModelo('formato', 'El modelo no respondió con el formato esperado después de dos intentos. Intenta de nuevo o prueba con otro modelo.')
}
