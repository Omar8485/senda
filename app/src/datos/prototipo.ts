// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Importador del prototipo de claude.ai (sistema/senda.html) al modelo de la v1.
//
// Acepta la base del artifact exportada como JSON, con las colecciones `valores`,
// `habilidades`, `objetivos` y `rutas` (cada una como mapa id → documento o como lista de
// documentos con `id`) y `jugador` (el documento `estado`, o un mapa que lo contiene).
//
// Pérdidas conocidas, documentadas en docs/construccion-v1.md:
// - El prototipo guardaba solo el XP total y la racha; la v1 calcula ambos desde eventos.
//   Se crea un evento por el XP de práctica de cada habilidad y otro por el resto del total,
//   fechados el último día con práctica. La racha vuelve a empezar.
// - Las imágenes de evidencia de logro no se guardaban en el prototipo; solo su nombre.

import { respaldo, AREAS, type Respaldo } from './esquemas'
import { hoy } from './ids'

type Doc = Record<string, unknown>

const TIPOS_EVIDENCIA = new Set(['producto', 'resultado', 'retroalimentacion', 'evaluacion', 'autoobservacion', 'formacion'])
const FIRMA_PROTOTIPO = { proveedor: 'anthropic', modelo: 'claude (prototipo en claude.ai)', version_prompt: 'prototipo-v0.1' }

function coleccion(x: unknown): [string, Doc][] {
  if (Array.isArray(x)) return x.filter((d): d is Doc => !!d && typeof d === 'object').map((d) => [String(d.id), d])
  if (x && typeof x === 'object') return Object.entries(x as Record<string, Doc>).filter(([, d]) => !!d && typeof d === 'object')
  return []
}

const str = (x: unknown): string | undefined => (typeof x === 'string' && x.trim() ? x : undefined)
const num = (x: unknown): number | undefined => (typeof x === 'number' && Number.isFinite(x) ? x : undefined)
const fecha = (x: unknown): string | undefined => (typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x) ? x : undefined)
const nivel = (x: unknown): number | null => {
  const n = num(x)
  return n === undefined ? null : Math.max(0, Math.min(5, Math.round(n)))
}
const area = (x: unknown) => (AREAS as readonly string[]).includes(x as string) ? (x as (typeof AREAS)[number]) : undefined
const escala = (x: unknown) => {
  const n = num(x)
  return n === undefined ? null : Math.max(1, Math.min(10, Math.round(n)))
}

export interface OpcionesPrototipo {
  /** El prototipo no guardaba el nombre: lo pone quien importa. */
  nombre: string
  /** Fecha de la importación (para pruebas). */
  ahora?: Date
}

/** Convierte la base del prototipo en un respaldo válido de la v1. Lanza un error legible si no se puede. */
export function convertirPrototipo(json: unknown, opciones: OpcionesPrototipo): Respaldo {
  if (!json || typeof json !== 'object') throw new Error('El archivo no tiene el formato de la base del prototipo.')
  const base = json as Doc
  const instante = (opciones.ahora ?? new Date()).toISOString()
  const hoyIso = hoy(opciones.ahora)
  const control = (creado?: string) => ({
    creado: creado ? `${creado}T00:00:00.000Z` : instante,
    actualizado: instante,
    version: 1,
    origen: 'prototipo' as const,
  })

  const habilidadesProto = coleccion(base.habilidades)
  const idPorNombre = new Map(habilidadesProto.map(([id, h]) => [String(h.nombre ?? '').toLowerCase(), id]))

  const valores = coleccion(base.valores).map(([id, v]) => ({
    id,
    ...control(fecha(v.fecha)),
    tipo: v.tipo === 'principio' ? ('principio' as const) : ('valor' as const),
    enunciado: str(v.enunciado) ?? str(v.corto) ?? id,
    corto: str(v.corto),
    area: area(v.area),
    importancia: escala(v.importancia),
    consistencia: escala(v.consistencia),
    fecha_consistencia: fecha(v.fecha_consistencia),
    situaciones: coleccion(v.contextos).map(([, c]) => ({
      situacion: String(c.situacion ?? ''),
      habilidades: (Array.isArray(c.habilidades) ? c.habilidades : [])
        .map((n) => idPorNombre.get(String(n).toLowerCase()) ?? String(n)),
    })),
    estado: v.estado === 'archivado' ? ('archivado' as const) : ('activo' as const),
    historial: coleccion(v.historial)
      .map(([, h]) => ({ fecha: fecha(h.fecha) ?? hoyIso, cambio: String(h.cambio ?? '') })),
    clasificacion: str(v.clasificacion),
    texto_original: str(v.texto_original),
    visibilidad: 'privado' as const,
    pendiente_ficha: v.pendiente_ficha === true ? true : undefined,
  }))

  const evidencias: Respaldo['datos']['evidencias'] = []
  let serie = 0
  const idEv = () => `ev-prototipo-${++serie}`

  const habilidades = habilidadesProto.map(([id, h]) => {
    for (const [, e] of coleccion(h.evidencias)) {
      const contexto = String(e.contexto ?? 'prototipo')
      evidencias.push({
        id: idEv(),
        ...control(fecha(e.fecha)),
        habilidad: id,
        fecha: fecha(e.fecha) ?? hoyIso,
        tipo: TIPOS_EVIDENCIA.has(e.tipo as string) ? (e.tipo as 'evaluacion') : 'autoobservacion',
        externa: e.externa === true,
        contexto,
        fuente: contexto === 'reto en Senda' ? 'reto-senda' : 'manual',
        descripcion: String(e.descripcion ?? ''),
      })
    }
    const ur = h.ultimo_reto as Doc | undefined
    return {
      id,
      ...control(),
      nombre: str(h.nombre) ?? id,
      tipo: ['cognitiva', 'interpersonal', 'motora', 'metahabilidad'].includes(h.tipo as string) ? (h.tipo as 'cognitiva') : undefined,
      clase: ['indispensable', 'especializar', 'objetivo'].includes(h.clase as string) ? (h.clase as 'objetivo') : undefined,
      nivel: nivel(h.nivel) as 0 | null,
      sospechado: nivel(h.sospechado) as 0 | null,
      confianza: ['baja', 'media', 'alta'].includes(h.confianza as string) ? (h.confianza as 'baja') : 'baja',
      requerido: nivel(h.requerido) as 0 | null,
      fuentes: Array.isArray(h.fuentes) ? h.fuentes.map(String) : [],
      estado: ['activa', 'pausada', 'descartada'].includes(h.estado as string) ? (h.estado as 'activa') : 'activa',
      motivo_pausa: str(h.motivo_pausa),
      rubrica: h.rubrica,
      revision_pendiente: h.revision_pendiente === true ? true : undefined,
      ultimo_reto: ur && fecha(ur.fecha)
        ? { fecha: fecha(ur.fecha)!, aprobado: ur.aprobado === true, puntaje: num(ur.puntaje) ?? 0 }
        : undefined,
      pendiente_ficha: h.pendiente_ficha === true ? true : undefined,
    }
  })

  const objetivos = coleccion(base.objetivos).map(([id, o]) => {
    let evidenciaLogro: string | null = null
    const el = o.evidencia_logro as Doc | undefined
    if (el && typeof el === 'object') {
      evidenciaLogro = idEv()
      const f = fecha(el.fecha) ?? fecha(o.fecha_logro) ?? hoyIso
      evidencias.push({
        id: evidenciaLogro,
        ...control(f),
        objetivo: id,
        fecha: f,
        tipo: 'resultado',
        externa: Boolean(el.enlace || el.imagen),
        contexto: 'evidencia de logro',
        fuente: 'logro',
        descripcion: String(el.descripcion ?? '') + (str(el.imagen) ? ` (imagen adjunta en el prototipo: ${el.imagen})` : ''),
        enlace: str(el.enlace),
        evaluacion: {
          firma: { ...FIRMA_PROTOTIPO, fecha: `${f}T00:00:00.000Z` },
          resultado: { aprobado: true, explicacion: String(el.evaluacion ?? ''), falta: '' },
        },
      })
    }
    const estado = o.estado === 'logrado' ? 'logrado' : o.estado === 'archivado' ? 'archivado' : 'activo'
    return {
      id,
      ...control(fecha(o.fecha)),
      titulo: str(o.titulo) ?? id,
      enunciado: String(o.enunciado ?? ''),
      criterio: String(o.criterio ?? ''),
      fecha_limite: fecha(o.fecha_limite) ?? null,
      area: area(o.area),
      valores: Array.isArray(o.valores) ? o.valores.map(String) : [],
      // Regla de la v1: sin evidencia aprobada no hay logro. Un logrado sin evidencia vuelve a activo.
      estado: estado === 'logrado' && !evidenciaLogro ? ('activo' as const) : (estado as 'activo'),
      fecha_logro: evidenciaLogro ? (fecha(o.fecha_logro) ?? null) : null,
      evidencia_logro: evidenciaLogro,
      intentos_logro: coleccion(o.intentos_logro).map(([, t]) => ({
        fecha: fecha(t.fecha) ?? hoyIso,
        descripcion: String(t.descripcion ?? ''),
        falta: String(t.falta ?? ''),
      })),
      texto_original: str(o.texto_original),
      visibilidad: 'privado' as const,
      pendiente_ficha: o.pendiente_ficha === true ? true : undefined,
    }
  })

  const rutas = coleccion(base.rutas).map(([id, r]) => ({
    id,
    ...control(fecha(r.creada)),
    titulo: String(r.titulo ?? id),
    descripcion: String(r.descripcion ?? ''),
    fuente: String(r.origen ?? r.fuente ?? ''),
    unidades: coleccion(r.unidades).map(([, u]) => ({
      titulo: String(u.titulo ?? ''),
      nodos: coleccion(u.nodos).map(([, n]) => ({
        tipo: ['sesion', 'recuperacion', 'repaso', 'reto'].includes(n.tipo as string) ? (n.tipo as 'sesion') : 'sesion',
        titulo: String(n.titulo ?? ''),
        nota: str(n.nota),
        tareas: coleccion(n.tareas).map(([, t]) => ({ texto: String(t.texto ?? ''), min: Math.max(0, num(t.min) ?? 0) })),
        habilidades: Array.isArray(n.habilidades) ? n.habilidades.map(String) : [],
        estado: n.estado === 'hecho' ? ('hecho' as const) : ('pendiente' as const),
        fecha: fecha(n.fecha),
        tareas_hechas: Array.isArray(n.tareas_hechas) ? n.tareas_hechas.filter((x) => Number.isInteger(x)) as number[] : undefined,
        minutos_reales: num(n.minutos_reales),
        resultado: n.resultado === 'aprobado' || n.resultado === 'no aprobado' ? n.resultado : undefined,
      })),
    })),
  }))

  const jugadorRaw = (base.jugador ?? {}) as Doc
  const jugador = (jugadorRaw.estado && typeof jugadorRaw.estado === 'object' ? jugadorRaw.estado : jugadorRaw) as Doc
  const fechaXp = fecha(jugador.ultimo_dia) ?? hoyIso
  const eventos_xp: Respaldo['datos']['eventos_xp'] = []
  let xpHabilidades = 0
  for (const [id, h] of habilidadesProto) {
    const xp = Math.max(0, Math.round(num(h.xp) ?? 0))
    if (!xp) continue
    xpHabilidades += xp
    eventos_xp.push({ id: `xp-prototipo-${id}`, ...control(fechaXp), fecha: fechaXp, cantidad: xp, motivo: 'XP de práctica migrado del prototipo', habilidades: [id] })
  }
  const resto = Math.max(0, Math.round(num(jugador.xp) ?? 0) - xpHabilidades)
  if (resto) eventos_xp.push({ id: 'xp-prototipo-total', ...control(fechaXp), fecha: fechaXp, cantidad: resto, motivo: 'XP migrado del prototipo', habilidades: [] })

  const avatar = ['a1', 'a2', 'a3', 'foto'].includes(jugador.avatar as string) ? (jugador.avatar as 'a1' | 'a2' | 'a3' | 'foto') : 'a1'
  const perfil = [{
    id: 'perfil',
    ...control(),
    nombre: opciones.nombre,
    avatar: avatar === 'foto' && !str(jugador.avatar_img)?.startsWith('data:image/') ? 'a1' : avatar,
    avatar_img: str(jugador.avatar_img)?.startsWith('data:image/') ? str(jugador.avatar_img) : undefined,
    idioma: 'es',
    minutos_dia: Math.max(10, Math.min(240, Math.round(num(jugador.minutos_dia) ?? 60))),
    mayor_de_edad: false,
  }]

  const r = respaldo.safeParse({
    formato: 'senda-respaldo',
    version_formato: 1,
    exportado: instante,
    datos: { perfil, valores, objetivos, habilidades, evidencias, rutas, eventos_xp },
  })
  if (!r.success) {
    const i = r.error.issues[0]
    throw new Error(`No se pudo convertir la base del prototipo: ${i.path.join('.')}: ${i.message}`)
  }
  return r.data
}
