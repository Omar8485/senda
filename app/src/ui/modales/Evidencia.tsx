// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useState } from 'react'
import type { Evidencia, Habilidad } from '../../datos/esquemas'
import { registrarEvidencia } from '../../servicios/acciones'
import { Aviso, Modal } from '../comun'
import { useAccion } from '../util'
import { useDB } from '../contexto-db'
import { useEvidencias } from '../datos-vivos'

const TIPOS: [Evidencia['tipo'], string][] = [
  ['autoobservacion', 'Algo que hice y observé yo'],
  ['producto', 'Algo que hice y se puede revisar (documento, código, video)'],
  ['resultado', 'Un resultado medible'],
  ['retroalimentacion', 'La opinión de alguien competente'],
  ['evaluacion', 'Un examen o prueba práctica'],
  ['formacion', 'Un curso, lectura u horas de estudio'],
]

export function ModalEvidencia({ h, onCerrar }: { h: Habilidad; onCerrar: () => void }) {
  const db = useDB()
  const previas = useEvidencias({ habilidad: h.id })
  const [f, setF] = useState({ descripcion: '', contexto: '', enlace: '', tipo: 'autoobservacion' as Evidencia['tipo'], externa: false })
  const guardarEv = useAccion(async () => {
    if (f.descripcion.trim().length < 10) throw new Error('Describe qué hiciste y qué resultado tuvo.')
    await registrarEvidencia(db, { habilidad: h.id, ...f })
    onCerrar()
  })
  return (
    <Modal etiqueta={`Evidencia · ${h.nombre}`} titulo="Registrar evidencia" onCerrar={onCerrar}>
      <div className="campo"><label htmlFor="ed">¿Qué hiciste y qué resultado tuvo?</label><textarea id="ed" rows={3} value={f.descripcion} onChange={(e) => setF({ ...f, descripcion: e.target.value })} /></div>
      <div className="campo"><label htmlFor="ec">¿En qué contexto? <small>(trabajo, casa, un proyecto…)</small></label><input id="ec" value={f.contexto} onChange={(e) => setF({ ...f, contexto: e.target.value })} /></div>
      <div className="campo"><label htmlFor="et">Tipo</label><select id="et" value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value as Evidencia['tipo'] })}>{TIPOS.map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></div>
      <div className="campo"><label htmlFor="el">Enlace <small>(opcional)</small></label><input id="el" value={f.enlace} onChange={(e) => setF({ ...f, enlace: e.target.value })} /></div>
      <label className="fila"><input type="checkbox" checked={f.externa} onChange={(e) => setF({ ...f, externa: e.target.checked })} /> Es externa: no depende solo de mi juicio (un examen, un tercero, un resultado medible)</label>
      <button type="button" className="btn primario" disabled={guardarEv.cargando} onClick={() => guardarEv.ejecutar()}>Guardar evidencia (+20 XP)</button>
      {guardarEv.error && <Aviso tipo="error">{guardarEv.error}</Aviso>}
      <small className="tenue">La evidencia no cambia tu nivel por sí sola. Usa "Autoevaluarme" y Senda registrará el nivel que tu evidencia respalda. Los cursos y lecturas se registran, pero no prueban que sepas hacerlo.</small>
      {previas.slice(-5).reverse().map((e) => <div key={e.id} className="ev">{e.fecha} · {e.tipo}{e.externa ? ' · externa' : ''} · {e.contexto}: {e.descripcion}</div>)}
    </Modal>
  )
}
