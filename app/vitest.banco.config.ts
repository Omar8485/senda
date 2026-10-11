// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Configuración aparte para el banco de pruebas: llama a modelos reales, así que no corre con `npm test`.

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: { include: ['src/banco/**/*.banco.ts'], testTimeout: 600_000 },
})
