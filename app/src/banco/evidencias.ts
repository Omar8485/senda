// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Evidencias de referencia del banco (B.2c). La fuente es banco/evidencias-de-referencia.md (no se
// duplica): de cada caso se toman el objetivo, la evidencia, el respaldo, el veredicto esperado y
// el acuerdo de Omar. Las variables del prompt salen de la misma función que usa la app.

import type { Adaptador, Imagen } from '../modelos/adaptador'
import { generarJSON } from '../modelos/cliente'
import { variablesLogro } from '../servicios/acciones'

export const PERSONA_PREDETERMINADA = 'Alex Ejemplo'

export interface CasoEvidencia {
  id: string
  titulo: string
  persona: string
  objetivo: string
  criterio: string
  fecha: string
  habilidades: { nombre: string; nivel: number; meta: number }[]
  evidencia: string
  enlace: string | null
  /** Nombre del archivo en banco/imagenes/, o null. */
  imagen: string | null
  /** true si el veredicto esperado es APROBAR. */
  esperado: boolean
  /** true si la línea Acuerdo empieza con ✔. Solo estos cuentan para el resultado oficial. */
  acordado: boolean
}

export interface ResultadoEvidencia {
  id: string
  esperado: boolean
  /** Veredicto del modelo; null si falló (error de formato, proveedor o imagen no admitida). */
  obtenido: boolean | null
  acierto: boolean
  acordado: boolean
  intentos: number | null
  falta?: string
  error?: string
}

const NADA = /^(ningun[oa]|no)$/i

function campo(bloque: Map<string, string>, nombre: string, id: string): string {
  const v = bloque.get(nombre)
  if (v === undefined || v === '') throw new Error(`${id}: falta el campo "${nombre}".`)
  return v
}

/** "expresarse oralmente en inglés: nivel 2, meta 4; otra: nivel 1, meta 3" */
export function leerHabilidades(texto: string, id: string): CasoEvidencia['habilidades'] {
  if (NADA.test(texto)) return []
  return texto.split(';').map((parte) => {
    const m = /^(.+?):\s*nivel\s*(\d)\s*,\s*meta\s*(\d)\s*$/i.exec(parte.trim())
    if (!m) throw new Error(`${id}: no se entiende la habilidad "${parte.trim()}" (formato: nombre: nivel N, meta M).`)
    return { nombre: m[1].trim(), nivel: Number(m[2]), meta: Number(m[3]) }
  })
}

/** Lee los casos de banco/evidencias-de-referencia.md. Falla si un caso está mal escrito. */
export function leerEvidencias(markdown: string): CasoEvidencia[] {
  const casos: CasoEvidencia[] = []
  const partes = markdown.replace(/\r\n/g, '\n').split(/^### /m).slice(1)
  for (const parte of partes) {
    const [encabezado, ...lineas] = parte.split('\n')
    const m = /^(E-\d+)\s*·\s*(.+)$/.exec(encabezado.trim())
    if (!m) continue
    const id = m[1]
    const bloque = new Map<string, string>()
    for (const l of lineas) {
      const c = /^- \*\*(.+?):\*\*\s*(.*)$/.exec(l.trim())
      if (c) bloque.set(c[1].toLowerCase(), c[2].trim())
    }
    const veredicto = campo(bloque, 'veredicto esperado', id).toUpperCase()
    if (veredicto !== 'APROBAR' && veredicto !== 'NO APROBAR') throw new Error(`${id}: el veredicto debe ser APROBAR o NO APROBAR.`)
    const enlace = campo(bloque, 'enlace', id)
    const imagen = campo(bloque, 'imagen', id).replace(/`/g, '')
    casos.push({
      id,
      titulo: m[2].trim(),
      persona: bloque.get('persona') || PERSONA_PREDETERMINADA,
      objetivo: campo(bloque, 'objetivo', id),
      criterio: campo(bloque, 'criterio', id),
      fecha: campo(bloque, 'fecha límite', id),
      habilidades: leerHabilidades(campo(bloque, 'habilidades', id), id),
      evidencia: campo(bloque, 'evidencia', id),
      enlace: NADA.test(enlace) ? null : enlace,
      imagen: NADA.test(imagen) ? null : imagen,
      esperado: veredicto === 'APROBAR',
      acordado: campo(bloque, 'acuerdo', id).startsWith('✔'),
    })
  }
  return casos
}

/** Variables del prompt evaluar-logro para un caso, con la misma función que usa la app. */
export function variablesCaso(c: CasoEvidencia): Record<string, string> {
  return variablesLogro({
    nombre: c.persona,
    objetivo: { titulo: c.objetivo, enunciado: '', criterio: c.criterio, fecha_limite: c.fecha },
    habilidades: c.habilidades,
    descripcion: c.evidencia,
    enlace: c.enlace,
    conImagen: c.imagen !== null,
  })
}

/** Corre un caso contra el modelo. Nunca lanza: un error queda registrado en el resultado. */
export async function evaluarCaso(
  adaptador: Adaptador,
  c: CasoEvidencia,
  cargarImagen: (nombre: string) => Promise<Imagen>,
): Promise<ResultadoEvidencia> {
  const base = { id: c.id, esperado: c.esperado, acordado: c.acordado }
  try {
    const imagenes = c.imagen ? [await cargarImagen(c.imagen)] : undefined
    const r = await generarJSON(adaptador, 'evaluar-logro', variablesCaso(c), { imagenes })
    return { ...base, obtenido: r.resultado.aprobado, acierto: r.resultado.aprobado === c.esperado, intentos: r.intentos ?? null, falta: r.resultado.falta }
  } catch (e) {
    return { ...base, obtenido: null, acierto: false, intentos: null, error: e instanceof Error ? e.message : String(e) }
  }
}
