// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Modelo de datos de la v1 (docs/arquitectura.md §5). El mismo esquema valida lo que se
// guarda, lo que se importa y lo que llega de un respaldo.

import { z } from 'zod'

const fechaIso = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'fecha AAAA-MM-DD')
const instante = z.string().min(10)
const nivel = z.number().int().min(0).max(5)
const escala10 = z.number().int().min(1).max(10)

/** Campos que llevan todos los registros. */
export const base = z.object({
  id: z.string().min(1),
  creado: instante,
  actualizado: instante,
  version: z.number().int().min(1),
  /** De dónde salió el registro: creado en la app, migrado del prototipo o importado de un respaldo. */
  origen: z.enum(['senda', 'prototipo', 'respaldo']),
})

export const AREAS = [
  'familia-origen', 'pareja', 'crianza', 'amistades', 'trabajo', 'educacion',
  'recreacion', 'espiritualidad', 'ciudadania', 'cuidado-fisico', 'transversal',
] as const
export type Area = (typeof AREAS)[number]

/** Áreas que nunca se ofrecen para publicar (docs/arquitectura.md §5 y §10). */
export const AREAS_SENSIBLES: readonly Area[] = ['familia-origen', 'pareja', 'crianza']

export const firmaModelo = z.object({
  proveedor: z.string(),
  modelo: z.string(),
  version_prompt: z.string(),
  fecha: instante,
})
export type FirmaModelo = z.infer<typeof firmaModelo>

export const perfil = base.extend({
  nombre: z.string(),
  avatar: z.enum(['a1', 'a2', 'a3', 'foto']).default('a1'),
  /** Foto propia como data URL (nunca una dirección externa). */
  avatar_img: z.string().startsWith('data:image/').optional(),
  idioma: z.string().default('es'),
  minutos_dia: z.number().int().min(10).max(240).default(60),
  /** P-007: la v1 es para mayores de 18. */
  mayor_de_edad: z.boolean().default(false),
  modelo: z
    .object({
      proveedor: z.enum(['anthropic', 'openai-compatible']),
      modelo: z.string().min(1),
      base_url: z.string().optional(),
    })
    .optional(),
})
export type Perfil = z.infer<typeof perfil>

export const cambio = z.object({ fecha: fechaIso, cambio: z.string() })

export const valor = base.extend({
  tipo: z.enum(['valor', 'principio']),
  enunciado: z.string().min(1),
  corto: z.string().optional(),
  area: z.enum(AREAS).optional(),
  importancia: escala10.nullable().optional(),
  consistencia: escala10.nullable().optional(),
  fecha_consistencia: fechaIso.optional(),
  /** Valor → situaciones donde se pone a prueba → habilidades (D-008). */
  situaciones: z.array(z.object({ situacion: z.string(), habilidades: z.array(z.string()) })).default([]),
  estado: z.enum(['activo', 'archivado']).default('activo'),
  historial: z.array(cambio).default([]),
  clasificacion: z.string().optional(),
  texto_original: z.string().optional(),
  visibilidad: z.enum(['privado', 'publico']).default('privado'),
  pendiente_ficha: z.boolean().optional(),
})
export type Valor = z.infer<typeof valor>

export const objetivo = base.extend({
  titulo: z.string().min(1),
  enunciado: z.string().default(''),
  criterio: z.string().default(''),
  fecha_limite: fechaIso.nullable().default(null),
  area: z.enum(AREAS).optional(),
  /** Regla: todo objetivo responde al menos a un valor. Se exige al crearlo; un objetivo migrado puede llegar sin valor y la app lo señala. */
  valores: z.array(z.string()).default([]),
  estado: z.enum(['activo', 'logrado', 'archivado']).default('activo'),
  fecha_logro: fechaIso.nullable().optional(),
  /** id de la evidencia aprobada que habilitó el logro. */
  evidencia_logro: z.string().nullable().optional(),
  /** D-011: se logró después de la fecha límite (el logro cuenta igual). */
  logrado_con_retraso: z.boolean().optional(),
  intentos_logro: z.array(z.object({ fecha: fechaIso, descripcion: z.string(), falta: z.string() })).default([]),
  texto_original: z.string().optional(),
  visibilidad: z.enum(['privado', 'publico']).default('privado'),
  pendiente_ficha: z.boolean().optional(),
})
export type Objetivo = z.infer<typeof objetivo>

export const habilidad = base.extend({
  nombre: z.string().min(1),
  tipo: z.enum(['cognitiva', 'interpersonal', 'motora', 'metahabilidad']).optional(),
  clase: z.enum(['indispensable', 'especializar', 'objetivo']).optional(),
  /** null = por evaluar. Lo escribe solo el núcleo (app/src/nucleo/niveles.ts). */
  nivel: nivel.nullable().default(null),
  /** Nivel que se sospecha y la evidencia todavía no respalda (regla 02). */
  sospechado: nivel.nullable().default(null),
  confianza: z.enum(['baja', 'media', 'alta']).default('baja'),
  requerido: nivel.nullable().default(null),
  /** ids de los objetivos y valores que la exigen. */
  fuentes: z.array(z.string()).default([]),
  estado: z.enum(['activa', 'pausada', 'descartada']).default('activa'),
  motivo_pausa: z.string().optional(),
  rubrica: z.unknown().optional(),
  revision_pendiente: z.boolean().optional(),
  ultimo_reto: z.object({ fecha: fechaIso, aprobado: z.boolean(), puntaje: z.number() }).optional(),
  pendiente_ficha: z.boolean().optional(),
})
export type Habilidad = z.infer<typeof habilidad>

/** Evidencia: solo se agrega, nunca se edita (docs/arquitectura.md §5). */
export const evidencia = base.extend({
  habilidad: z.string().optional(),
  objetivo: z.string().optional(),
  fecha: fechaIso,
  tipo: z.enum(['producto', 'resultado', 'retroalimentacion', 'evaluacion', 'autoobservacion', 'formacion']),
  externa: z.boolean(),
  contexto: z.string(),
  /** reto-senda: reto generado y corregido por el modelo en la app (D-009). */
  fuente: z.enum(['reto-senda', 'logro', 'manual']).default('manual'),
  descripcion: z.string(),
  enlace: z.string().optional(),
  evaluacion: z.object({ firma: firmaModelo, resultado: z.unknown() }).optional(),
})
export type Evidencia = z.infer<typeof evidencia>

export const nodo = z.object({
  tipo: z.enum(['sesion', 'recuperacion', 'repaso', 'reto']),
  titulo: z.string(),
  nota: z.string().optional(),
  tareas: z.array(z.object({ texto: z.string(), min: z.number().min(0) })).default([]),
  habilidades: z.array(z.string()).default([]),
  estado: z.enum(['pendiente', 'hecho']).default('pendiente'),
  fecha: fechaIso.optional(),
  tareas_hechas: z.array(z.number().int()).optional(),
  minutos_reales: z.number().optional(),
  resultado: z.enum(['aprobado', 'no aprobado']).optional(),
})
export type Nodo = z.infer<typeof nodo>

export const ruta = base.extend({
  titulo: z.string(),
  descripcion: z.string().default(''),
  /** id del objetivo o valor del que sale la ruta. */
  fuente: z.string(),
  unidades: z.array(z.object({ titulo: z.string(), nodos: z.array(nodo) })),
})
export type Ruta = z.infer<typeof ruta>

/** Evento de XP: solo se agrega. El XP total y la racha se calculan a partir de los eventos. */
export const eventoXp = base.extend({
  fecha: fechaIso,
  cantidad: z.number(),
  motivo: z.string(),
  habilidades: z.array(z.string()).default([]),
})
export type EventoXp = z.infer<typeof eventoXp>

export const TABLAS = ['perfil', 'valores', 'objetivos', 'habilidades', 'evidencias', 'rutas', 'eventos_xp'] as const
export type Tabla = (typeof TABLAS)[number]

export const ESQUEMAS = {
  perfil,
  valores: valor,
  objetivos: objetivo,
  habilidades: habilidad,
  evidencias: evidencia,
  rutas: ruta,
  eventos_xp: eventoXp,
} as const

export interface Registros {
  perfil: Perfil
  valores: Valor
  objetivos: Objetivo
  habilidades: Habilidad
  evidencias: Evidencia
  rutas: Ruta
  eventos_xp: EventoXp
}

/** Formato del respaldo JSON (exportar e importar). No incluye claves de API. */
export const respaldo = z.object({
  formato: z.literal('senda-respaldo'),
  version_formato: z.literal(1),
  exportado: instante,
  datos: z.object({
    perfil: z.array(perfil).max(1),
    valores: z.array(valor),
    objetivos: z.array(objetivo),
    habilidades: z.array(habilidad),
    evidencias: z.array(evidencia),
    rutas: z.array(ruta),
    eventos_xp: z.array(eventoXp),
  }),
})
export type Respaldo = z.infer<typeof respaldo>
