// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Prompts versionados: viven en /prompts (raíz del repositorio), fuera del código.

const archivos = import.meta.glob('../../../prompts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export type Esfuerzo = 'low' | 'medium' | 'high'

export interface Prompt {
  tarea: string
  version: number
  esfuerzo: Esfuerzo
  descripcion: string
  plantilla: string
}

/** Lee el encabezado YAML simple (clave: valor) y el cuerpo de un prompt. */
export function leerPrompt(texto: string): Prompt {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(texto.replace(/\r\n/g, '\n'))
  if (!m) throw new Error('El prompt no tiene encabezado YAML.')
  const meta: Record<string, string> = {}
  for (const linea of m[1].split('\n')) {
    const i = linea.indexOf(':')
    if (i > 0) meta[linea.slice(0, i).trim()] = linea.slice(i + 1).replace(/\s+#.*$/, '').trim()
  }
  const version = Number(meta.version)
  if (!meta.tarea || !Number.isInteger(version) || version < 1) throw new Error('El prompt necesita tarea y version.')
  const esfuerzo = (['low', 'medium', 'high'].includes(meta.esfuerzo) ? meta.esfuerzo : 'medium') as Esfuerzo
  return { tarea: meta.tarea, version, esfuerzo, descripcion: meta.descripcion ?? '', plantilla: m[2].trim() }
}

const PROMPTS = new Map(
  Object.entries(archivos)
    .filter(([ruta]) => !ruta.endsWith('/README.md'))
    .map(([, texto]) => {
      const p = leerPrompt(texto)
      return [p.tarea, p] as const
    }),
)

export type Tarea = 'analizar-valor' | 'analizar-objetivo' | 'generar-ruta' | 'crear-reto' | 'evaluar-reto' | 'evaluar-logro' | 'clasificar-concepto'

export function prompt(tarea: Tarea | 'reglas'): Prompt {
  const p = PROMPTS.get(tarea)
  if (!p) throw new Error(`No existe el prompt ${tarea}.`)
  return p
}

/** Completa las {{variables}}. Falla si falta alguna: nunca se envía un prompt incompleto. */
export function rellenar(plantilla: string, variables: Record<string, string | number>): string {
  const faltan = new Set<string>()
  const texto = plantilla.replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (_, k: string) => {
    if (!(k in variables)) {
      faltan.add(k)
      return ''
    }
    return String(variables[k])
  })
  if (faltan.size) throw new Error(`Faltan variables del prompt: ${[...faltan].join(', ')}.`)
  return texto
}

/** Identificador de versión para la firma: tarea@version+reglas@version. */
export function versionPrompt(tarea: Tarea): string {
  const r = prompt('reglas')
  return `${tarea}@${prompt(tarea).version}+reglas@${r.version}`
}
