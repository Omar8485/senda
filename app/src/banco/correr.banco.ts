// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// Corre el banco de pruebas contra un modelo real. Se ejecuta con `npm run banco` y variables de
// entorno (ver banco/README.md). La clave nunca se escribe en ningún archivo.

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { expect, test } from 'vitest'
import evidenciasMd from '../../../banco/evidencias-de-referencia.md?raw'
import casosMd from '../../../modelo/casos-de-prueba.md?raw'
import type { Adaptador } from '../modelos/adaptador'
import { adaptadorAnthropic } from '../modelos/anthropic'
import { generarJSON } from '../modelos/cliente'
import { adaptadorCompatible } from '../modelos/openai'
import { versionPrompt } from '../modelos/prompts'
import { leerCasos } from './casos'
import { evaluarCaso, leerEvidencias, type ResultadoEvidencia } from './evidencias'
import { resumir, resumirEvidencias, type ResultadoCaso } from './metricas'

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

async function cargarImagen(nombre: string) {
  const datos = await readFile(path.resolve(process.cwd(), '../banco/imagenes', nombre))
  return { tipo: 'image/png', base64: datos.toString('base64') }
}

test.skipIf(!a)('banco de clasificación y evidencias', async () => {
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
  const evidencias = leerEvidencias(evidenciasMd)
  const resultadosEvidencias: ResultadoEvidencia[] = []
  for (const c of evidencias) resultadosEvidencias.push(await evaluarCaso(a!, c, cargarImagen))

  // bancoCompleto: false hasta que exista la prueba de retos (B.2b).
  const resumen = resumir(resultados, { bancoCompleto: false, evidencias: resumirEvidencias(resultadosEvidencias) })
  const informe = {
    formato: 'senda-banco', version_formato: 2, fecha: new Date().toISOString(),
    proveedor, modelo,
    version_prompt: { clasificacion: versionPrompt('clasificar-concepto'), evidencias: versionPrompt('evaluar-logro') },
    resumen, resultados, resultados_evidencias: resultadosEvidencias,
  }
  const dir = path.resolve(process.cwd(), '../banco/resultados')
  await mkdir(dir, { recursive: true })
  const archivo = path.join(dir, `${informe.fecha.slice(0, 10)}-${modelo.replace(/[^a-zA-Z0-9.-]/g, '_')}.json`)
  await writeFile(archivo, JSON.stringify(informe, null, 2) + '\n')
  const ev = resumen.evidencias!
  console.log(`\nBanco: ${modelo} · ${resumen.etiqueta}`
    + `\n  Clasificación: acierto oficial ${resumen.aciertoAcordados ?? 'sin casos acordados'} · provisional ${resumen.aciertoTodos.toFixed(2)} · formato ${resumen.formato.toFixed(2)}`
    + `\n  Evidencias: aprobación indebida oficial ${ev.aprobacionIndebidaAcordados ?? 'sin casos acordados'} · provisional ${ev.aprobacionIndebida.toFixed(2)} · rechazo indebido ${ev.rechazoIndebido.toFixed(2)} · formato ${ev.formato.toFixed(2)}`
    + `\nInforme: ${archivo}`)
  expect(resultados).toHaveLength(casos.length)
  expect(resultadosEvidencias).toHaveLength(evidencias.length)
}, 600_000)
