// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Exportar e importar todo en JSON (docs/arquitectura.md §1.3). Las claves de API no viajan.

import type { SendaDB } from './db'
import { respaldo, TABLAS, type Respaldo } from './esquemas'

export async function exportar(db: SendaDB): Promise<Respaldo> {
  const datos = Object.fromEntries(
    await Promise.all(TABLAS.map(async (t) => [t, await db[t].toArray()] as const)),
  ) as Respaldo['datos']
  return respaldo.parse({ formato: 'senda-respaldo', version_formato: 1, exportado: new Date().toISOString(), datos })
}

export interface ResultadoImportacion {
  ok: boolean
  /** Errores de validación legibles, con la ruta del dato que falla. */
  errores: string[]
  conteo?: Record<string, number>
}

/** Valida un respaldo sin tocar la base. */
export function validarRespaldo(json: unknown): { respaldo?: Respaldo; errores: string[] } {
  const r = respaldo.safeParse(json)
  if (r.success) return { respaldo: r.data, errores: [] }
  return { errores: r.error.issues.slice(0, 20).map((i) => `${i.path.join('.') || '(raíz)'}: ${i.message}`) }
}

/** Reemplaza todo el contenido de la base por el respaldo. Las claves de API se conservan. */
export async function importar(db: SendaDB, json: unknown): Promise<ResultadoImportacion> {
  const { respaldo: r, errores } = validarRespaldo(json)
  if (!r) return { ok: false, errores }
  await db.transaction('rw', TABLAS.map((t) => db[t]), async () => {
    for (const t of TABLAS) {
      await db[t].clear()
      await (db[t] as unknown as import('dexie').Table<unknown, string>).bulkAdd(r.datos[t])
    }
  })
  return { ok: true, errores: [], conteo: Object.fromEntries(TABLAS.map((t) => [t, r.datos[t].length])) }
}

/** Borra todos los datos del dispositivo, claves incluidas (pantalla "Mis datos"). */
export async function borrarTodo(db: SendaDB): Promise<void> {
  await db.transaction('rw', [...TABLAS.map((t) => db[t]), db.secretos], async () => {
    for (const t of TABLAS) await db[t].clear()
    await db.secretos.clear()
  })
}
