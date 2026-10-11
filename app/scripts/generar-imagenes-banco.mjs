// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// Genera las imágenes de banco/imagenes/ para las evidencias de referencia
// (banco/evidencias-de-referencia.md), con el Chromium de Playwright.
// Son documentos INVENTADOS de un examen que no existe, marcados como ficticios en la propia imagen.
// Uso: node scripts/generar-imagenes-banco.mjs  (PW_CHROMIUM_PATH opcional)

import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const destino = new URL('../../banco/imagenes/', import.meta.url)

const marca = `<div class="marca">EJEMPLO FICTICIO · Banco de pruebas de Senda · No es un documento real</div>`

const estilos = `
  body { margin: 0; font: 16px/1.4 system-ui, sans-serif; color: #1d2433; background: #f4f1ea; }
  .hoja { width: 560px; margin: 20px; padding: 24px 28px; background: #fff; border: 1px solid #c9c2b4; position: relative; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .sub { color: #5b6476; font-size: 13px; margin-bottom: 16px; }
  table { border-collapse: collapse; width: 100%; }
  td { padding: 6px 0; border-bottom: 1px solid #eee; }
  td:last-child { text-align: right; font-weight: 600; }
  .total td { font-size: 20px; border-bottom: none; padding-top: 12px; }
  .marca { margin-top: 18px; padding: 6px 10px; background: #fde9e7; color: #9b2c22; font-size: 12px; font-weight: 700; text-align: center; letter-spacing: .02em; }
  ul { margin: 8px 0 0; padding-left: 20px; }
`

function resultado({ nombre, fecha, secciones, total, nivel }) {
  const filas = secciones.map(([s, v]) => `<tr><td>${s}</td><td>${v}</td></tr>`).join('')
  return `<div class="hoja">
    <h1>Examen de Inglés de Ejemplo (EIE)</h1>
    <div class="sub">Informe de resultados · Examen inventado para pruebas</div>
    <table>
      <tr><td>Nombre</td><td>${nombre}</td></tr>
      <tr><td>Fecha del examen</td><td>${fecha}</td></tr>
      ${filas}
      <tr class="total"><td>Puntaje total</td><td>${total}</td></tr>
      ${nivel ? `<tr><td>Nivel asignado</td><td>${nivel}</td></tr>` : ''}
    </table>
    ${marca}
  </div>`
}

const SECCIONES_86 = [['Comprensión auditiva', '22 / 25'], ['Lectura', '23 / 25'], ['Expresión escrita', '20 / 25'], ['Expresión oral', '21 / 25']]
const SECCIONES_72 = [['Comprensión auditiva', '18 / 25'], ['Lectura', '20 / 25'], ['Expresión escrita', '17 / 25'], ['Expresión oral', '17 / 25']]

const IMAGENES = {
  'resultado-86-alex.png': resultado({ nombre: 'Alex Ejemplo', fecha: '2026-09-20', secciones: SECCIONES_86, total: '86 / 100' }),
  'resultado-72-alex.png': resultado({ nombre: 'Alex Ejemplo', fecha: '2026-09-20', secciones: SECCIONES_72, total: '72 / 100' }),
  'resultado-86-sam.png': resultado({ nombre: 'Sam Ejemplo', fecha: '2026-09-20', secciones: SECCIONES_86, total: '86 / 100' }),
  'resultado-c1-alex.png': resultado({
    nombre: 'Alex Ejemplo', fecha: '2026-11-08',
    secciones: [['Comprensión auditiva', 'C1'], ['Lectura', 'C1'], ['Expresión escrita', 'B2'], ['Expresión oral', 'C1 · Aprobada']],
    total: '81 / 100', nivel: 'C1',
  }),
  'lista-pendientes.png': `<div class="hoja">
    <h1>Pendientes de la semana</h1>
    <div class="sub">Nota personal</div>
    <ul><li>Comprar café</li><li>Llamar al taller</li><li>Repasar vocabulario de inglés</li><li>Pagar el internet</li></ul>
    ${marca}
  </div>`,
}

await mkdir(destino, { recursive: true })
const browser = await chromium.launch(process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {})
const page = await browser.newPage({ viewport: { width: 600, height: 200 }, deviceScaleFactor: 1 })
for (const [nombre, html] of Object.entries(IMAGENES)) {
  await page.setContent(`<html><head><style>${estilos}</style></head><body>${html}</body></html>`)
  await page.locator('.hoja').screenshot({ path: new URL(nombre, destino).pathname })
}
await browser.close()
console.log(`${Object.keys(IMAGENES).length} imágenes generadas en banco/imagenes/`)
