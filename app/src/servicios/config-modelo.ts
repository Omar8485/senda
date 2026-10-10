// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Configuración del modelo de IA que eligió la persona. La clave queda en la tabla local
// `secretos`: nunca va al respaldo ni sale del dispositivo salvo hacia el proveedor elegido.

import type { SendaDB } from '../datos/db'
import type { Perfil } from '../datos/esquemas'
import { guardar } from '../datos/repositorio'
import type { Adaptador } from '../modelos/adaptador'
import { adaptadorAnthropic } from '../modelos/anthropic'
import { adaptadorCompatible } from '../modelos/openai'

export type ConfigModelo = NonNullable<Perfil['modelo']>

const idClave = (c: ConfigModelo) => (c.proveedor === 'anthropic' ? 'clave-anthropic' : `clave-compatible:${c.base_url ?? ''}`)

export async function guardarConfigModelo(db: SendaDB, config: ConfigModelo, clave?: string) {
  const perfil = await db.perfil.get('perfil')
  if (!perfil) throw new Error('Primero crea tu perfil.')
  await guardar(db, 'perfil', { ...perfil, modelo: config })
  if (clave !== undefined) {
    if (clave.trim()) await db.secretos.put({ id: idClave(config), valor: clave.trim() })
    else await db.secretos.delete(idClave(config))
  }
}

export async function tieneClave(db: SendaDB, config: ConfigModelo): Promise<boolean> {
  return !!(await db.secretos.get(idClave(config)))
}

export async function borrarClaves(db: SendaDB) {
  await db.secretos.clear()
}

/** Construye el adaptador del modelo elegido, o null si falta configurar algo. */
export async function adaptadorActual(db: SendaDB, f?: typeof fetch): Promise<Adaptador | null> {
  const config = (await db.perfil.get('perfil'))?.modelo
  if (!config) return null
  const clave = (await db.secretos.get(idClave(config)))?.valor
  if (config.proveedor === 'anthropic') {
    return clave ? adaptadorAnthropic({ clave, modelo: config.modelo, fetch: f }) : null
  }
  if (!config.base_url) return null
  return adaptadorCompatible({ base_url: config.base_url, modelo: config.modelo, clave, fetch: f })
}
