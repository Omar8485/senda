// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// Corre el banco de pruebas contra un modelo real. Se ejecuta con `npm run banco` y variables de
// entorno (ver banco/README.md). La clave nunca se escribe en ningún archivo.

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { expect, test } from 'vitest'
import casosMd from '../../../modelo/casos-de-prueba.md?raw'
import type { Adaptador } from '../modelos/adaptador'
import { adaptadorAnthropic } from '../modelos/anthropic'
import { generarJSON } from '../modelos/cliente'
import { adaptadorCompatible } from '../modelos/openai'
import { versionPrompt } from '../modelos/prompts'
import { leerCasos } from './casos'
import { resumir, type ResultadoCaso } from './metricas'

const env = process.env
const proveedor = env.SENDA_BANCO_PROVEEDOR ?? 'anthropic'
const modelo = env.SENDA_BANCO_MODELO ?? ''
const clave = env.SENDA_BANCO_CLAVE ?? ''

function adaptador(): Adaptador | null {
  if (!modelo) return null
  if (proveedor === 'anthropic') return clave ? adaptadorAnthropic({ clave, modelo }) : null
  if (!env.SENDA_BANCO_URL) return null
  return adaptadorCompatible({ base_url: env.SENDA_BANCO_URL, modelo, clave: clave || undefined })
}

const a = adaptador()

test.skipIf(!a)('banco de clasificación', async () => {
  const casos = leerCasos(casosMd)
  const resultados: ResultadoCaso[] = []
  for (const c of casos) {
    try {
      const r = await generarJSON(a!, 'clasificar-concepto', { concepto: c.concepto })
      resultados.push({ ...c, obtenida: r.resultado.categoria, acierto: c.esperadas.includes(r.resultado.categoria), intentos: r.intentos ?? null })
    } catch (e) {
      resultados.push({ ...c, obtenida: null, acierto: false, intentos: null, error: e instanceof Error ? e.message : String(e) })
    }
  }
  const resumen = resumir(resultados, { bancoCompleto: false })
  const informe = {
    formato: 'senda-banco', version_formato: 1, fecha: new Date().toISOString(),
    proveedor, modelo, version_prompt: versionPrompt('clasificar-concepto'),
    resumen, resultados,
  }
  const dir = path.resolve(process.cwd(), '../banco/resultados')
  await mkdir(dir, { recursive: true })
  const archivo = path.join(dir, `${informe.fecha.slice(0, 10)}-${modelo.replace(/[^a-zA-Z0-9.-]/g, '_')}.json`)
  await writeFile(archivo, JSON.stringify(informe, null, 2) + '\n')
  console.log(`\nBanco: ${modelo} · acierto oficial ${resumen.aciertoAcordados ?? 'sin casos acordados'} · provisional ${resumen.aciertoTodos.toFixed(2)} · formato ${resumen.formato.toFixed(2)} · ${resumen.etiqueta}\nInforme: ${archivo}`)
  expect(resultados).toHaveLength(casos.length)
}, 600_000)
