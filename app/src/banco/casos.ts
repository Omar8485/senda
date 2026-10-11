// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Casos de clasificación del banco de pruebas. La fuente es modelo/casos-de-prueba.md (no se
// duplica): de cada fila se toma el concepto, la categoría esperada y si Omar marcó acuerdo.

import type { Categoria } from '../modelos/salidas'

export interface CasoClasificacion {
  numero: number
  concepto: string
  /** Categorías aceptadas (algunas filas admiten dos, por ejemplo "VALOR o PRINCIPIO"). */
  esperadas: Categoria[]
  /** true si la columna Acuerdo empieza con ✔. Solo estos cuentan para el resultado oficial. */
  acordado: boolean
}

const PALABRAS: [RegExp, Categoria][] = [
  [/\bPARAGUAS\b/, 'paraguas'], [/\bPRINCIPIO\b/, 'principio'], [/\bOBJETIVO\b/, 'objetivo'],
  [/\bDIRECCI[OÓ]N\b/, 'direccion'], [/\bVALOR\b/, 'valor'], [/\bACCI[OÓ]N\b/, 'accion'],
  [/\bCONOCIMIENTO\b/, 'conocimiento'], [/\bCAMPO\b/, 'campo'], [/\bAPTITUD\b/, 'aptitud'],
  [/\bDISPOSICI[OÓ]N\b/, 'disposicion'], [/\bHABILIDAD\b/, 'habilidad'], [/\bCOMPETENCIA\b/, 'competencia'],
]

/** Categorías esperadas a partir del texto de "Clasificación esperada". */
export function categoriasEsperadas(texto: string): Categoria[] {
  const t = texto.replace(/\*\*/g, '').trim()
  if (/^NO\b/.test(t)) return ['otro']
  const antesDeFlecha = t.split('→')[0]
  const encontradas: Categoria[] = []
  for (const [re, c] of PALABRAS) {
    const m = re.exec(antesDeFlecha)
    if (m) encontradas.push(c)
  }
  // Orden de aparición en el texto, para que la primera sea la principal.
  return encontradas.sort((a, b) => antesDeFlecha.search(PALABRAS.find((p) => p[1] === a)![0]) - antesDeFlecha.search(PALABRAS.find((p) => p[1] === b)![0]))
}

/** Lee la tabla de modelo/casos-de-prueba.md. */
export function leerCasos(markdown: string): CasoClasificacion[] {
  const casos: CasoClasificacion[] = []
  for (const linea of markdown.split('\n')) {
    const celdas = linea.split('|').map((c) => c.trim())
    // | # | Concepto | Clasificación esperada | Razón | Acuerdo |
    if (celdas.length < 7 || !/^\d+$/.test(celdas[1])) continue
    const esperadas = categoriasEsperadas(celdas[3])
    if (!esperadas.length) continue
    casos.push({ numero: Number(celdas[1]), concepto: celdas[2].replace(/\*\*/g, ''), esperadas, acordado: celdas[5].startsWith('✔') })
  }
  return casos
}
