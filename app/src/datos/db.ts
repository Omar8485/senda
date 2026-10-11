// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Base local en IndexedDB (Dexie). Los datos viven en el dispositivo (docs/arquitectura.md §1).

import { Dexie, type EntityTable } from 'dexie'
import type { Registros } from './esquemas'

/** Claves de API: solo en el dispositivo, nunca en el respaldo ni en la sincronización. */
export interface Secreto {
  id: string
  valor: string
}

export type SendaDB = Dexie & {
  [T in keyof Registros]: EntityTable<Registros[T], 'id'>
} & { secretos: EntityTable<Secreto, 'id'> }

export function abrirDB(nombre = 'senda'): SendaDB {
  const db = new Dexie(nombre) as SendaDB
  db.version(1).stores({
    perfil: 'id',
    valores: 'id, tipo, estado',
    objetivos: 'id, estado',
    habilidades: 'id, estado, *fuentes',
    evidencias: 'id, habilidad, objetivo, fecha',
    rutas: 'id, fuente',
    eventos_xp: 'id, fecha',
    secretos: 'id',
  })
  return db
}
