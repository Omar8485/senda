// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Escritura validada. Toda escritura pasa por el esquema; evidencias y eventos de XP solo se agregan.

import type { SendaDB } from './db'
import { ESQUEMAS, type Registros } from './esquemas'
import { idSerie } from './ids'

type Editable = 'perfil' | 'valores' | 'objetivos' | 'habilidades' | 'rutas'
type SoloAgregar = 'evidencias' | 'eventos_xp'

/** Lo que entrega quien llama: sin los campos de control, que pone el repositorio. */
export type Borrador<T extends keyof Registros> = Omit<Registros[T], 'creado' | 'actualizado' | 'version' | 'origen'> &
  Partial<Pick<Registros[T], 'origen'>>

const ahora = () => new Date().toISOString()

/** Crea o reemplaza un registro editable, subiendo su versión. */
export async function guardar<T extends Editable>(db: SendaDB, tabla: T, datos: Borrador<T>): Promise<Registros[T]> {
  const t = db[tabla] as unknown as import('dexie').Table<Registros[T], string>
  const previo = await t.get(datos.id)
  const registro = ESQUEMAS[tabla].parse({
    ...datos,
    origen: datos.origen ?? previo?.origen ?? 'senda',
    creado: previo?.creado ?? ahora(),
    actualizado: ahora(),
    version: (previo?.version ?? 0) + 1,
  }) as Registros[T]
  await t.put(registro)
  return registro
}

/** Agrega una evidencia o un evento de XP. No hay función para editarlos. */
export async function agregar<T extends SoloAgregar>(
  db: SendaDB,
  tabla: T,
  datos: Omit<Borrador<T>, 'id'> & { id?: string },
): Promise<Registros[T]> {
  const t = db[tabla] as unknown as import('dexie').Table<Registros[T], string>
  const registro = ESQUEMAS[tabla].parse({
    ...datos,
    id: datos.id ?? idSerie(tabla === 'evidencias' ? 'ev' : 'xp'),
    origen: datos.origen ?? 'senda',
    creado: ahora(),
    actualizado: ahora(),
    version: 1,
  }) as Registros[T]
  const existe = await t.get(registro.id)
  if (existe) throw new Error(`Ya existe ${tabla}/${registro.id}: los registros de esta tabla no se modifican.`)
  await t.add(registro)
  return registro
}
