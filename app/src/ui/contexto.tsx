// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ReactNode } from 'react'
import type { SendaDB } from '../datos/db'
import { DBContexto } from './contexto-db'

export function ProveedorDB({ db, children }: { db: SendaDB; children: ReactNode }) {
  return <DBContexto.Provider value={db}>{children}</DBContexto.Provider>
}
