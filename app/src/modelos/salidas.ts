// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Esquemas de las respuestas del modelo, uno por tarea. Deben coincidir con el JSON que pide
// cada prompt en /prompts. Se mantienen simples (objetos, listas, enums) para que sirvan también
// como salida estructurada; los rangos (0-5, 0-100) los recorta el código que usa el resultado.

import { z } from 'zod'
import type { Tarea } from './prompts'

const tipoHabilidad = z.enum(['cognitiva', 'interpersonal', 'motora', 'metahabilidad'])

export const SALIDAS = {
  'analizar-valor': z.object({
    clasificacion: z.string(),
    explicacion: z.string(),
    enunciado: z.string(),
    corto: z.string(),
    contextos: z.array(z.object({
      situacion: z.string(),
      habilidades: z.array(z.object({
        id: z.string(),
        nombre: z.string(),
        tipo: tipoHabilidad,
        clase: z.enum(['indispensable', 'especializar']),
        nivel_minimo: z.number(),
        por_que: z.string(),
      })),
    })),
  }),
  'analizar-objetivo': z.object({
    es_objetivo: z.boolean(),
    observacion: z.string(),
    titulo: z.string(),
    enunciado: z.string(),
    criterio: z.string(),
    habilidades: z.array(z.object({
      id: z.string(),
      nombre: z.string(),
      tipo: tipoHabilidad,
      nivel_requerido: z.number(),
      por_que: z.string(),
    })),
  }),
  'generar-ruta': z.object({
    titulo: z.string(),
    descripcion: z.string(),
    unidades: z.array(z.object({
      titulo: z.string(),
      nodos: z.array(z.object({
        tipo: z.enum(['sesion', 'recuperacion', 'repaso', 'reto']),
        titulo: z.string(),
        tareas: z.array(z.object({ texto: z.string(), min: z.number() })),
        habilidades: z.array(z.string()),
      })),
    })),
  }),
  'crear-reto': z.object({
    titulo: z.string(),
    instrucciones: z.string(),
    material: z.string(),
    criterios: z.array(z.string()),
    verificable_por_texto: z.boolean(),
  }),
  'evaluar-reto': z.object({
    aprobado: z.boolean(),
    puntaje: z.number(),
    nivel_demostrado: z.number(),
    fortalezas: z.string(),
    mejorar: z.string(),
  }),
  'evaluar-logro': z.object({
    aprobado: z.boolean(),
    explicacion: z.string(),
    falta: z.string(),
  }),
} satisfies Record<Tarea, z.ZodType>

export type Salida<T extends Tarea> = z.infer<(typeof SALIDAS)[T]>
