// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Consultas reactivas: la interfaz se actualiza sola cuando cambia la base.

import { useLiveQuery } from 'dexie-react-hooks'
import type { EventoXp, Evidencia, Habilidad, Objetivo, Perfil, Ruta, Valor } from '../datos/esquemas'
import { hoy } from '../datos/ids'
import { nivelPersonaje, racha, xpHabilidad, xpTotal } from '../nucleo'
import { useDB } from './contexto-db'

export interface Todo {
  perfil: Perfil | undefined
  valores: Valor[]
  objetivos: Objetivo[]
  habilidades: Habilidad[]
  rutas: Ruta[]
  eventos: EventoXp[]
}

export function useTodo(): Todo | undefined {
  const db = useDB()
  return useLiveQuery(async () => ({
    perfil: await db.perfil.get('perfil'),
    valores: await db.valores.toArray(),
    objetivos: await db.objetivos.toArray(),
    habilidades: await db.habilidades.toArray(),
    rutas: await db.rutas.toArray(),
    eventos: await db.eventos_xp.toArray(),
  }), [db])
}

export function useEvidencias(filtro: { habilidad?: string; objetivo?: string }): Evidencia[] {
  const db = useDB()
  return useLiveQuery(async () => {
    if (filtro.habilidad) return db.evidencias.where('habilidad').equals(filtro.habilidad).sortBy('fecha')
    if (filtro.objetivo) return db.evidencias.where('objetivo').equals(filtro.objetivo).sortBy('fecha')
    return []
  }, [db, filtro.habilidad, filtro.objetivo]) ?? []
}

export function progreso(eventos: EventoXp[]) {
  const xp = xpTotal(eventos)
  return { xp, racha: racha(eventos, hoy()), ...nivelPersonaje(xp) }
}

export const xpDe = (eventos: EventoXp[], habilidad: string) => xpHabilidad(eventos, habilidad)
