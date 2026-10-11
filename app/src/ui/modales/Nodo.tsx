// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useState } from 'react'
import type { Ruta } from '../../datos/esquemas'
import { completarNodo } from '../../servicios/acciones'
import { Aviso, Modal } from '../comun'
import { useAccion } from '../util'
import { useDB } from '../contexto-db'

const NOMBRE = { sesion: 'Sesión', recuperacion: 'Recuperación', repaso: 'Repaso semanal', reto: 'Reto' } as const

export function ModalNodo({ ruta, u, n, onCerrar }: { ruta: Ruta; u: number; n: number; onCerrar: () => void }) {
  const db = useDB()
  const nodo = ruta.unidades[u].nodos[n]
  const hecho = nodo.estado === 'hecho'
  const [marcadas, setMarcadas] = useState<number[]>(nodo.tareas_hechas ?? [])
  const total = nodo.tareas.reduce((s, t) => s + t.min, 0)
  const completar = useAccion(async () => { await completarNodo(db, ruta.id, u, n, marcadas); onCerrar() })
  return (
    <Modal etiqueta={`${NOMBRE[nodo.tipo]} · ${total} min · +${total} XP`} titulo={nodo.titulo} onCerrar={onCerrar}>
      {nodo.nota && <p className="tenue">{nodo.nota}</p>}
      <div>
        {nodo.tareas.map((t, i) => (
          <label key={i} className="tarea">
            <input type="checkbox" disabled={hecho} checked={marcadas.includes(i)} onChange={(e) => setMarcadas(e.target.checked ? [...marcadas, i] : marcadas.filter((x) => x !== i))} />
            <span>{t.texto}</span><span className="min">{t.min} min</span>
          </label>
        ))}
      </div>
      {hecho ? <Aviso tipo="ok">Completada el {nodo.fecha}.</Aviso> : (
        <>
          <button type="button" className="btn primario" disabled={(nodo.tareas.length > 0 && !marcadas.length) || completar.cargando} onClick={() => completar.ejecutar()}>Completar sesión</button>
          <small className="tenue">Marca las tareas que hiciste. Puedes completar la sesión aunque falte alguna: lo pendiente se recupera el fin de semana.</small>
        </>
      )}
      {completar.error && <Aviso tipo="error">{completar.error}</Aviso>}
    </Modal>
  )
}
