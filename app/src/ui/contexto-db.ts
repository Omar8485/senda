// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { createContext, useContext } from 'react'
import type { SendaDB } from '../datos/db'

export const DBContexto = createContext<SendaDB | null>(null)

export function useDB(): SendaDB {
  const db = useContext(DBContexto)
  if (!db) throw new Error('useDB fuera de ProveedorDB')
  return db
}
