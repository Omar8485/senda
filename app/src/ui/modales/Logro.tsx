// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useState } from 'react'
import type { Habilidad, Objetivo } from '../../datos/esquemas'
import { evaluarLogro, marcarLogrado } from '../../servicios/acciones'
import { Aviso, Modal, Pensando } from '../comun'
import { exigirAdaptador, leerImagen, useAccion } from '../util'
import { useDB } from '../contexto-db'

export function ModalLogro({ o, habilidades, onCerrar }: { o: Objetivo; habilidades: Habilidad[]; onCerrar: () => void }) {
  const db = useDB()
  const [descripcion, setDescripcion] = useState('')
  const [enlace, setEnlace] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)
  const [r, setR] = useState<{ aprobado: boolean; explicacion: string; falta: string; evidencia?: string; modelo: string } | null>(null)
  const evaluar = useAccion(async () => {
    if (descripcion.trim().length < 15) throw new Error('Describe la evidencia con más detalle.')
    const a = await exigirAdaptador(db)
    const img = imagen ? await leerImagen(imagen, 1568) : undefined
    const res = await evaluarLogro(a, db, { objetivo: o.id, descripcion, enlace, imagen: img })
    setR({ ...res.evaluacion, evidencia: res.evidencia, modelo: a.modelo })
  })
  const marcar = useAccion(async () => { await marcarLogrado(db, o.id, r!.evidencia!); onCerrar() })

  return (
    <Modal etiqueta={`Objetivo · ${o.titulo}`} titulo="Evidencia del logro" onCerrar={onCerrar}>
      <div className="ev"><b>Tu criterio:</b> {o.criterio || o.enunciado || '(sin criterio: se evaluará contra el enunciado)'}</div>
      {habilidades.length > 0 && (
        <details><summary>Cómo van sus habilidades</summary>
          <ul>{habilidades.map((h) => <li key={h.id}>{h.nombre}: {h.nivel === null ? 'sin evaluar' : `nivel ${h.nivel}`}{h.requerido ? ` / meta ${h.requerido}` : ''}{h.requerido && (h.nivel ?? -1) >= h.requerido ? ' ✓' : ''}</li>)}</ul>
        </details>
      )}
      {!r?.aprobado && (
        <>
          <div className="campo"><label htmlFor="lgd">¿Qué demuestra que cumpliste el criterio?</label><textarea id="lgd" rows={4} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej.: hice el examen el 12/09 y obtuve 64/100." /></div>
          <div className="campo"><label htmlFor="lgl">Enlace al resultado o certificado <small>(opcional)</small></label><input id="lgl" value={enlace} onChange={(e) => setEnlace(e.target.value)} placeholder="https://…" /></div>
          <div className="campo"><label htmlFor="lgi">Imagen del resultado o certificado <small>(recomendado)</small></label><input id="lgi" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => setImagen(e.target.files?.[0] ?? null)} /></div>
          {evaluar.cargando ? <Pensando texto="Evaluando tu evidencia…" /> : <button type="button" className="btn primario" onClick={() => evaluar.ejecutar()}>{r ? 'Enviar de nuevo' : 'Enviar a evaluación'}</button>}
          {evaluar.error && <Aviso tipo="error">{evaluar.error}</Aviso>}
          <small className="tenue">El modelo compara tu evidencia con el criterio. Si el criterio depende de un resultado externo (examen, certificado), una afirmación sin respaldo no basta. La imagen solo viaja al modelo en este momento.</small>
        </>
      )}
      {r && !r.aprobado && <Aviso><strong>Todavía no se puede marcar como logrado.</strong><br />{r.explicacion}{r.falta && <><br /><b>Qué falta:</b> {r.falta}</>}</Aviso>}
      {r?.aprobado && (
        <>
          <Aviso tipo="ok"><strong>Evidencia aprobada.</strong><br />{r.explicacion}</Aviso>
          <button type="button" className="btn primario" onClick={() => marcar.ejecutar()}>Marcar como logrado (+100 XP)</button>
          {marcar.error && <Aviso tipo="error">{marcar.error}</Aviso>}
        </>
      )}
      {r && <p className="pie-modelo">Evaluado por {r.modelo}. Puede contener errores; úsalo como guía, no como certificación.</p>}
      {o.intentos_logro.slice(-3).reverse().map((t, i) => <div key={i} className="ev">{t.fecha} · no aprobado: {t.falta}</div>)}
    </Modal>
  )
}
