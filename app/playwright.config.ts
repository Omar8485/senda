// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { defineConfig, devices } from '@playwright/test'

// Las pruebas de interfaz corren sobre la compilación (npm run build), servida con vite preview.
// PW_CHROMIUM_PATH permite usar un Chromium ya instalado en lugar de descargarlo.
const executablePath = process.env.PW_CHROMIUM_PATH

export default defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    // Movimiento reducido: la animación de pulso del nodo actual impide que Playwright lo vea estable.
    { name: 'escritorio', use: { ...devices['Desktop Chrome'], contextOptions: { reducedMotion: 'reduce' } } },
    { name: 'movil', use: { ...devices['Pixel 7'], contextOptions: { reducedMotion: 'reduce' } } },
  ],
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
})
