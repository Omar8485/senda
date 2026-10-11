// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Acciones de la app: juntan el modelo de IA (que propone), el núcleo (que decide) y los datos.
// La interfaz solo llama a estas funciones; así cada regla queda probada sin interfaz.

import type { SendaDB } from '../datos/db'
import type { Area, Evidencia, Habilidad, Objetivo, Ruta, Valor } from '../datos/esquemas'
import { nombreArea } from '../datos/areas'
import { hoy, idNuevo, slug } from '../datos/ids'
import { agregar, guardar } from '../datos/repositorio'
import type { Adaptador, Imagen } from '../modelos/adaptador'
import { generarJSON, type Firmado } from '../modelos/cliente'
import type { Salida } from '../modelos/salidas'
import {
  aNivel, confianza, nivelTrasReto, puedeMarcarLogrado, registrarNivel, validarObjetivoNuevo, XP,
  type EvaluacionLogro, type NivelHabilidad,
} from '../nucleo'

// ---------- utilidades ----------

async function nombrePersona(db: SendaDB): Promise<string> {
  return (await db.perfil.get('perfil'))?.nombre || 'la persona'
}

async function listaExistentes(db: SendaDB, conNivel = false): Promise<string> {
  const hs = await db.habilidades.toArray()
  return hs.map((h) => `${h.id}: ${h.nombre}${conNivel ? ` (nivel ${h.nivel ?? 'por evaluar'})` : ''}`).join('; ') || 'ninguna'
}

/** Limpia un id propuesto por el modelo para que sea un identificador válido del modelo. */
function idHabilidad(propuesto: string, nombre: string): string {
  const limpio = propuesto.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 80)
  return /^hab-[a-z0-9]/.test(limpio) ? limpio : `hab-${slug(nombre)}`
}

async function sumarXP(db: SendaDB, cantidad: number, motivo: string, habilidades: string[] = []) {
  if (cantidad <= 0) return
  await agregar(db, 'eventos_xp', { fecha: hoy(), cantidad, motivo, habilidades } as never)
}

const conCambio = <T extends { historial: { fecha: string; cambio: string }[] }>(r: T, cambio: string) =>
  [...r.historial, { fecha: hoy(), cambio }].slice(-20)

// ---------- valores ----------

export function analizarValor(adaptador: Adaptador, db: SendaDB, e: { texto: string; area: Area; ejemplo?: string }) {
  return (async () =>
    generarJSON(adaptador, 'analizar-valor', {
      nombre: await nombrePersona(db),
      texto: e.texto,
      area: nombreArea(e.area),
      ejemplo: e.ejemplo?.trim() || 'ninguno',
      existentes: await listaExistentes(db),
    }))()
}

type HabilidadDeValor = Salida<'analizar-valor'>['contextos'][number]['habilidades'][number]

/** Guarda el valor (nuevo o existente) y crea o vincula las habilidades elegidas. */
export async function aceptarValor(
  db: SendaDB,
  e: { analisis: Salida<'analizar-valor'>; enunciado: string; texto: string; area: Area; elegidas: HabilidadDeValor[]; valorExistente?: string },
): Promise<{ id: string; habilidades: string[]; creadas: number }> {
  const previo = e.valorExistente ? await db.valores.get(e.valorExistente) : undefined
  const ocupados = new Set(await db.valores.toCollection().primaryKeys())
  const id = previo?.id ?? idNuevo('val', e.analisis.corto || e.enunciado, (x) => ocupados.has(x))
  const elegidas = e.elegidas.map((h) => ({ propuesta: h, id: idHabilidad(h.id, h.nombre) }))
  const idDe = new Map(elegidas.map((x) => [x.propuesta, x.id]))
  const situaciones = e.analisis.contextos
    .map((c) => ({ situacion: c.situacion, habilidades: c.habilidades.filter((h) => idDe.has(h)).map((h) => idDe.get(h)!) }))
    .filter((s) => s.habilidades.length)

  if (previo) {
    await guardar(db, 'valores', {
      ...previo, enunciado: e.enunciado, area: e.area, clasificacion: e.analisis.clasificacion, situaciones,
      historial: conCambio(previo, 'habilidades derivadas con el modelo'), pendiente_ficha: true,
    })
  } else {
    await guardar(db, 'valores', {
      id, tipo: 'valor', enunciado: e.enunciado, corto: e.analisis.corto, area: e.area, situaciones,
      clasificacion: e.analisis.clasificacion, texto_original: e.texto, historial: [{ fecha: hoy(), cambio: 'creado en Senda' }],
      pendiente_ficha: true,
    } as never)
  }
  const vinculo = await vincularHabilidades(db, id, elegidas.map(({ propuesta: h, id: hid }) => ({
    id: hid, nombre: h.nombre, tipo: h.tipo, clase: h.clase, requerido: aNivel(h.nivel_minimo),
  })))
  return { id, ...vinculo }
}

async function vincularHabilidades(
  db: SendaDB,
  fuente: string,
  hs: { id: string; nombre: string; tipo: Habilidad['tipo']; clase: Habilidad['clase']; requerido: NivelHabilidad }[],
): Promise<{ habilidades: string[]; creadas: number }> {
  let creadas = 0
  for (const h of hs) {
    const previa = await db.habilidades.get(h.id)
    if (previa) {
      await guardar(db, 'habilidades', {
        ...previa,
        fuentes: [...new Set([...previa.fuentes, fuente])],
        requerido: Math.max(previa.requerido ?? 0, h.requerido) as NivelHabilidad,
        estado: previa.estado === 'pausada' ? 'activa' : previa.estado,
      })
    } else {
      await guardar(db, 'habilidades', { id: h.id, nombre: h.nombre, tipo: h.tipo, clase: h.clase, requerido: h.requerido, fuentes: [fuente], pendiente_ficha: true } as never)
      creadas++
    }
  }
  return { habilidades: hs.map((h) => h.id), creadas }
}

export async function editarValor(db: SendaDB, id: string, cambios: Partial<Pick<Valor, 'enunciado' | 'corto' | 'area' | 'importancia' | 'consistencia'>>) {
  const v = await db.valores.get(id)
  if (!v) throw new Error('El valor no existe.')
  const campos = (Object.keys(cambios) as (keyof typeof cambios)[]).filter((k) => JSON.stringify(cambios[k] ?? null) !== JSON.stringify(v[k] ?? null))
  if (!campos.length) return v
  return guardar(db, 'valores', {
    ...v, ...cambios,
    ...(campos.includes('consistencia') ? { fecha_consistencia: hoy() } : {}),
    historial: conCambio(v, `editado: ${campos.join(', ')}`),
    pendiente_ficha: true,
  })
}

export async function archivarValor(db: SendaDB, id: string) {
  const v = await db.valores.get(id)
  if (!v) throw new Error('El valor no existe.')
  return guardar(db, 'valores', { ...v, estado: 'archivado', historial: conCambio(v, 'archivado'), pendiente_ficha: true })
}

// ---------- objetivos ----------

export async function analizarObjetivo(adaptador: Adaptador, db: SendaDB, e: { texto: string; criterio: string; fecha: string | null; area: Area }) {
  return generarJSON(adaptador, 'analizar-objetivo', {
    nombre: await nombrePersona(db),
    texto: e.texto,
    criterio: e.criterio || 'no lo dijo',
    fecha: e.fecha || 'sin fecha',
    hoy: hoy(),
    area: nombreArea(e.area),
    existentes: await listaExistentes(db, true),
  })
}

type HabilidadDeObjetivo = Salida<'analizar-objetivo'>['habilidades'][number]

export async function aceptarObjetivo(
  db: SendaDB,
  e: { titulo: string; enunciado: string; criterio: string; fecha: string | null; area: Area; valores: string[]; texto: string; elegidas: HabilidadDeObjetivo[] },
): Promise<{ id: string; habilidades: string[]; creadas: number }> {
  const valores = new Map((await db.valores.toArray()).map((v) => [v.id, v]))
  const error = validarObjetivoNuevo(e.valores, valores)
  if (error) throw new Error(error)
  const existentes = new Set(await db.objetivos.toCollection().primaryKeys())
  const id = idNuevo('obj', e.titulo, (x) => existentes.has(x))
  await guardar(db, 'objetivos', {
    id, titulo: e.titulo, enunciado: e.enunciado, criterio: e.criterio, fecha_limite: e.fecha || null, area: e.area,
    valores: e.valores, texto_original: e.texto, pendiente_ficha: true,
  } as never)
  return {
    id,
    ...(await vincularHabilidades(db, id, e.elegidas.map((h) => ({ id: idHabilidad(h.id, h.nombre), nombre: h.nombre, tipo: h.tipo, clase: 'objetivo', requerido: aNivel(h.nivel_requerido) })))),
  }
}

export async function asignarValoresObjetivo(db: SendaDB, id: string, ids: string[]) {
  const o = await db.objetivos.get(id)
  if (!o) throw new Error('El objetivo no existe.')
  const error = validarObjetivoNuevo(ids, new Map((await db.valores.toArray()).map((v) => [v.id, v])))
  if (error) throw new Error(error)
  return guardar(db, 'objetivos', { ...o, valores: ids, pendiente_ficha: true })
}

/** Pide al modelo que evalúe la evidencia. Si aprueba, guarda la evidencia firmada y devuelve su id. */
export async function evaluarLogro(
  adaptador: Adaptador,
  db: SendaDB,
  e: { objetivo: string; descripcion: string; enlace?: string; imagen?: Imagen & { nombre: string } },
): Promise<{ evaluacion: EvaluacionLogro; evidencia?: string }> {
  const o = await db.objetivos.get(e.objetivo)
  if (!o) throw new Error('El objetivo no existe.')
  const hs = await db.habilidades.where('fuentes').equals(o.id).toArray()
  const r = await generarJSON(adaptador, 'evaluar-logro', {
    nombre: await nombrePersona(db),
    titulo: o.titulo,
    enunciado: o.enunciado || '(sin enunciado)',
    criterio: o.criterio || '(sin criterio explícito; usa el enunciado)',
    fecha: o.fecha_limite ?? 'sin fecha',
    habilidades: JSON.stringify(hs.filter((h) => h.estado === 'activa').map((h) => ({ nombre: h.nombre, nivel: h.nivel, meta: h.requerido }))),
    evidencia: e.descripcion.slice(0, 4000),
    enlace: e.enlace?.trim() || 'ninguno',
    imagen: e.imagen ? 'sí (resultado o certificado adjunto)' : 'no',
  }, { imagenes: e.imagen ? [e.imagen] : undefined })

  if (!puedeMarcarLogrado(r.resultado)) {
    await guardar(db, 'objetivos', {
      ...o,
      intentos_logro: [...o.intentos_logro, { fecha: hoy(), descripcion: e.descripcion.slice(0, 500), falta: r.resultado.falta || r.resultado.explicacion }].slice(-10),
    })
    return { evaluacion: r.resultado }
  }
  const ev = await agregar(db, 'evidencias', {
    objetivo: o.id, fecha: hoy(), tipo: 'resultado', externa: Boolean(e.enlace?.trim() || e.imagen), contexto: 'evidencia de logro',
    fuente: 'logro', descripcion: e.descripcion.slice(0, 1000) + (e.imagen ? ` (imagen: ${e.imagen.nombre})` : ''),
    enlace: e.enlace?.trim() || undefined, evaluacion: r,
  } as never)
  return { evaluacion: r.resultado, evidencia: ev.id }
}

/** Marca un objetivo como logrado. Solo con una evidencia de logro aprobada y firmada. */
export async function marcarLogrado(db: SendaDB, objetivo: string, evidencia: string) {
  const o = await db.objetivos.get(objetivo)
  const ev = await db.evidencias.get(evidencia)
  const resultado = ev?.evaluacion?.resultado as EvaluacionLogro | undefined
  if (!o || !ev || ev.objetivo !== o.id || !puedeMarcarLogrado(resultado)) {
    throw new Error('Para marcar un objetivo como logrado hace falta una evidencia aprobada.')
  }
  await guardar(db, 'objetivos', { ...o, estado: 'logrado', fecha_logro: hoy(), evidencia_logro: ev.id, pendiente_ficha: true })
  await sumarXP(db, XP.objetivoLogrado, `objetivo logrado: ${o.titulo}`)
}

export async function reabrirObjetivo(db: SendaDB, id: string) {
  const o = await db.objetivos.get(id)
  if (!o) throw new Error('El objetivo no existe.')
  return guardar(db, 'objetivos', { ...o, estado: 'activo', fecha_logro: null, pendiente_ficha: true })
}

// ---------- rutas ----------

export async function generarRuta(adaptador: Adaptador, db: SendaDB, e: { fuente: string; habilidades: string[] }): Promise<Ruta> {
  const o = await db.objetivos.get(e.fuente)
  const v = o ? undefined : await db.valores.get(e.fuente)
  if (!o && !v) throw new Error('No existe el objetivo o valor de la ruta.')
  const perfil = await db.perfil.get('perfil')
  const hs = (await db.habilidades.bulkGet(e.habilidades)).filter((h): h is Habilidad => !!h)
  const r = await generarJSON(adaptador, 'generar-ruta', {
    fuente: o ? 'el objetivo' : 'el valor',
    enunciado: o ? o.enunciado || o.titulo : v!.enunciado,
    criterio: o?.criterio ? ` (criterio de logro: ${o.criterio})` : '',
    habilidades: hs.map((h) => `${h.id}: ${h.nombre} (requerido ${h.requerido ?? '?'}, actual ${h.nivel ?? 'por evaluar'})`).join('; '),
    minutos: perfil?.minutos_dia ?? 60,
  })
  const validas = new Set(hs.map((h) => h.id))
  const existentes = new Set(await db.rutas.toCollection().primaryKeys())
  return guardar(db, 'rutas', {
    id: idNuevo('ruta', e.fuente.replace(/^(val|obj)-/, ''), (x) => existentes.has(x)),
    titulo: r.resultado.titulo,
    descripcion: r.resultado.descripcion,
    fuente: e.fuente,
    unidades: r.resultado.unidades.map((u) => ({
      titulo: u.titulo,
      nodos: u.nodos.map((n) => ({
        tipo: n.tipo, titulo: n.titulo,
        tareas: n.tareas.map((t) => ({ texto: t.texto, min: Math.max(0, Math.round(t.min)) })),
        habilidades: n.habilidades.filter((h) => validas.has(h)),
        estado: 'pendiente' as const,
      })),
    })),
  } as never)
}

/** Primer nodo pendiente de la ruta (solo ese está disponible, como en el prototipo). */
export function nodoActual(r: Ruta): { u: number; n: number } | null {
  for (let u = 0; u < r.unidades.length; u++) {
    for (let n = 0; n < r.unidades[u].nodos.length; n++) if (r.unidades[u].nodos[n].estado !== 'hecho') return { u, n }
  }
  return null
}

/** Completa una sesión con las tareas hechas: 1 XP por minuto, repartido entre sus habilidades. */
export async function completarNodo(db: SendaDB, rutaId: string, u: number, n: number, hechas: number[]) {
  const r = await db.rutas.get(rutaId)
  const nodo = r?.unidades[u]?.nodos[n]
  if (!r || !nodo) throw new Error('La sesión no existe.')
  if (nodo.estado === 'hecho') return r
  if (nodo.tareas.length && !hechas.length) throw new Error('Marca al menos una tarea hecha.')
  const minutos = hechas.reduce((s, i) => s + (nodo.tareas[i]?.min ?? 0), 0)
  const copia = structuredClone(r)
  Object.assign(copia.unidades[u].nodos[n], { estado: 'hecho', fecha: hoy(), tareas_hechas: hechas, minutos_reales: minutos })
  const guardada = await guardar(db, 'rutas', copia)
  await sumarXP(db, minutos * XP.porMinuto, `sesión: ${nodo.titulo}`, nodo.habilidades)
  return guardada
}

// ---------- retos, evidencia y nivel ----------

export async function crearReto(adaptador: Adaptador, db: SendaDB, habilidad: string) {
  const h = await db.habilidades.get(habilidad)
  if (!h) throw new Error('La habilidad no existe.')
  const meta = Math.min((h.nivel ?? 0) + 1, 5)
  const r = await generarJSON(adaptador, 'crear-reto', {
    nombre: await nombrePersona(db),
    habilidad: h.nombre,
    meta,
    nivel: h.nivel ?? 'sin evaluar',
    rubrica: h.rubrica ? `Rúbrica específica por nivel: ${JSON.stringify(h.rubrica)}` : '',
  })
  return { ...r, meta }
}

export interface ResultadoReto {
  evaluacion: Salida<'evaluar-reto'>
  nivelAntes: NivelHabilidad | null
  nivelDespues: NivelHabilidad | null
  verificable: boolean
  xp: number
}

/**
 * Evalúa la respuesta a un reto. El modelo propone; el núcleo decide: un reto aprobado y
 * verificable por texto sube como máximo un nivel y hasta 3 (D-009).
 */
export async function evaluarReto(
  adaptador: Adaptador,
  db: SendaDB,
  e: { habilidad: string; reto: Firmado<Salida<'crear-reto'>> & { meta: number }; respuesta: string; nodo?: { ruta: string; u: number; n: number } },
): Promise<ResultadoReto> {
  const h = await db.habilidades.get(e.habilidad)
  if (!h) throw new Error('La habilidad no existe.')
  const r = await generarJSON(adaptador, 'evaluar-reto', {
    nombre: await nombrePersona(db),
    habilidad: h.nombre,
    meta: e.reto.meta,
    reto: JSON.stringify(e.reto.resultado),
    respuesta: e.respuesta.slice(0, 6000),
  })
  const ev = r.resultado
  const verificable = e.reto.resultado.verificable_por_texto !== false
  const cuenta = ev.aprobado && verificable
  await agregar(db, 'evidencias', {
    habilidad: h.id, fecha: hoy(), tipo: 'evaluacion', externa: cuenta, contexto: 'reto en Senda', fuente: 'reto-senda',
    descripcion: `Reto "${e.reto.resultado.titulo}": ${ev.aprobado ? 'aprobado' : 'no aprobado'} (${Math.round(ev.puntaje)}/100)`,
    evaluacion: r,
  } as never)

  const evidencias = await db.evidencias.where('habilidad').equals(h.id).toArray()
  const antes = h.nivel === null ? null : aNivel(h.nivel)
  let nivel = antes
  if (cuenta) nivel = nivelTrasReto(antes ?? 0, Math.min(aNivel(ev.nivel_demostrado), aNivel(e.reto.meta)) as NivelHabilidad)
  await guardar(db, 'habilidades', {
    ...h,
    nivel,
    sospechado: h.sospechado !== null && nivel !== null && h.sospechado <= nivel ? null : h.sospechado,
    confianza: cuenta ? confianza(evidencias, { conRubrica: !!h.rubrica }) : h.confianza,
    ultimo_reto: { fecha: hoy(), aprobado: ev.aprobado, puntaje: Math.round(ev.puntaje) },
  })
  const xp = ev.aprobado ? XP.retoAprobado : XP.retoIntentado
  await sumarXP(db, xp, `reto: ${e.reto.resultado.titulo}`, [h.id])

  if (e.nodo) {
    const ruta = await db.rutas.get(e.nodo.ruta)
    if (ruta?.unidades[e.nodo.u]?.nodos[e.nodo.n]) {
      const copia = structuredClone(ruta)
      Object.assign(copia.unidades[e.nodo.u].nodos[e.nodo.n], { estado: 'hecho', fecha: hoy(), resultado: ev.aprobado ? 'aprobado' : 'no aprobado' })
      await guardar(db, 'rutas', copia)
    }
  }
  return { evaluacion: ev, nivelAntes: antes, nivelDespues: nivel, verificable, xp }
}

/** Registra una evidencia propia. No cambia el nivel: queda para revisión (como en el prototipo). */
export async function registrarEvidencia(
  db: SendaDB,
  e: { habilidad: string; descripcion: string; contexto: string; enlace?: string; tipo: Evidencia['tipo']; externa: boolean },
) {
  const h = await db.habilidades.get(e.habilidad)
  if (!h) throw new Error('La habilidad no existe.')
  const ev = await agregar(db, 'evidencias', {
    habilidad: h.id, fecha: hoy(), tipo: e.tipo, externa: e.externa, contexto: e.contexto.trim() || 'sin contexto',
    fuente: 'manual', descripcion: e.descripcion, enlace: e.enlace?.trim() || undefined,
  } as never)
  await guardar(db, 'habilidades', { ...h, revision_pendiente: true })
  await sumarXP(db, XP.evidencia, `evidencia: ${h.nombre}`, [h.id])
  return ev
}

/**
 * Autoevaluación: la persona propone un nivel y el núcleo registra el que su evidencia respalda.
 * Lo que no alcanza queda como nivel sospechado (regla 02).
 */
export async function autoevaluar(db: SendaDB, habilidad: string, propuesto: NivelHabilidad) {
  const h = await db.habilidades.get(habilidad)
  if (!h) throw new Error('La habilidad no existe.')
  const evidencias = await db.evidencias.where('habilidad').equals(h.id).toArray()
  const r = registrarNivel(propuesto, evidencias, { conRubrica: !!h.rubrica })
  const actualizada = await guardar(db, 'habilidades', { ...h, nivel: r.nivel, sospechado: r.sospechado ?? null, confianza: r.confianza, revision_pendiente: false })
  return { habilidad: actualizada, registrado: r }
}

export async function pausarHabilidad(db: SendaDB, id: string, motivo: string) {
  const h = await db.habilidades.get(id)
  if (!h) throw new Error('La habilidad no existe.')
  return guardar(db, 'habilidades', { ...h, estado: 'pausada', motivo_pausa: motivo || undefined })
}

export async function reactivarHabilidad(db: SendaDB, id: string) {
  const h = await db.habilidades.get(id)
  if (!h) throw new Error('La habilidad no existe.')
  return guardar(db, 'habilidades', { ...h, estado: 'activa', motivo_pausa: undefined })
}

export type { Objetivo }
