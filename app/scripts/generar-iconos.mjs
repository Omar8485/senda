// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// Genera los PNG de la app instalable a partir de public/icono.svg, con el Chromium de Playwright.
// Uso: node scripts/generar-iconos.mjs  (PW_CHROMIUM_PATH opcional)

import { chromium } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const svg = await readFile(new URL('../public/icono.svg', import.meta.url), 'utf8')
const browser = await chromium.launch(process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {})
for (const [nombre, lado, margen] of [['icono-192.png', 192, 0], ['icono-512.png', 512, 0], ['icono-maskable-512.png', 512, 0.1], ['apple-touch-icon.png', 180, 0]]) {
  const page = await browser.newPage({ viewport: { width: lado, height: lado } })
  const interior = Math.round(lado * (1 - 2 * margen))
  await page.setContent(`<html><body style="margin:0;background:#0e7c6b;display:grid;place-items:center;height:${lado}px">
    <div style="width:${interior}px;height:${interior}px">${svg.replace('<svg ', `<svg width="${interior}" height="${interior}" `)}</div></body></html>`)
  await page.screenshot({ path: new URL(`../public/${nombre}`, import.meta.url).pathname })
  await page.close()
}
await browser.close()
console.log('Iconos generados en public/')
