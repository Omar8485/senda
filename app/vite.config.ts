/// <reference types="vitest/config" />
// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Política de seguridad de contenido (docs/arquitectura.md §10): sin scripts ni recursos de terceros.
// Solo en la compilación, porque el servidor de desarrollo de Vite inyecta scripts en línea.
// Cuando lleguen los adaptadores de modelos (B.1), connect-src sumará los dominios de los proveedores.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

function politicaDeSeguridad(): Plugin {
  return {
    name: 'senda-csp',
    apply: 'build',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' },
    ],
  }
}

export default defineConfig({
  // Rutas relativas: la misma compilación sirve en omar8485.github.io/senda/ y en la raíz de un dominio.
  base: './',
  plugins: [react(), politicaDeSeguridad()],
  test: {
    include: ['src/**/*.test.ts'],
  },
})
