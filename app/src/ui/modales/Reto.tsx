// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useState } from 'react'
import type { Habilidad } from '../../datos/esquemas'
import { crearReto, evaluarReto, type ResultadoReto } from '../../servicios/acciones'
import { Aviso, Modal, Pensando, PieModelo } from '../comun'
import { exigirAdaptador, useAccion } from '../util'
import { useDB } from '../contexto-db'

type Reto = Awaited<ReturnType<typeof crearReto>>

export function ModalReto({ h, nodo, onCerrar }: { h: Habilidad; nodo?: { ruta: string; u: number; n: number }; onCerrar: () => void }) {
  const db = useDB()
  const meta = Math.min((h.nivel ?? 0) + 1, 5)
  const [reto, setReto] = useState<Reto | null>(null)
  const [respuesta, setRespuesta] = useState('')
  const [res, setRes] = useState<(ResultadoReto & { firma: Reto['firma'] }) | null>(null)
  const preparar = useAccion(async () => setReto(await crearReto(await exigirAdaptador(db), db, h.id)))
  const enviar = useAccion(async () => {
    if (respuesta.trim().length < 10) throw new Error('Escribe tu respuesta primero.')
    const a = await exigirAdaptador(db)
    const r = await evaluarReto(a, db, { habilidad: h.id, reto: reto!, respuesta, nodo })
    setRes({ ...r, firma: { ...reto!.firma, modelo: a.modelo } })
  })

  return (
    <Modal etiqueta={`Reto · ${h.nombre}`} titulo={`Ponerte a prueba para el nivel ${meta}`} onCerrar={onCerrar}>
      {!reto && (
        <>
          <p className="tenue">El modelo prepara un reto corto. Si lo apruebas, tu nivel sube como máximo un punto, y como máximo hasta 3. Los niveles 4 y 5 necesitan evidencia externa revisada.</p>
          {preparar.cargando ? <Pensando texto="Preparando tu reto…" /> : <button type="button" className="btn primario" onClick={() => preparar.ejecutar()}>Preparar reto</button>}
          {preparar.error && <Aviso tipo="error">{preparar.error}</Aviso>}
        </>
      )}
      {reto && !res && (
        <>
          <div className="tarjeta interna">
            <strong>{reto.resultado.titulo}</strong>
            <p className="pre">{reto.resultado.instrucciones}</p>
            {reto.resultado.material && <div className="material pre">{reto.resultado.material}</div>}
            <small className="tenue">Se evaluará: {reto.resultado.criterios.join(' · ')}</small>
          </div>
          <div className="campo"><label htmlFor="resp">Tu respuesta</label><textarea id="resp" rows={7} value={respuesta} onChange={(e) => setRespuesta(e.target.value)} /></div>
          {enviar.cargando ? <Pensando texto="Evaluando…" /> : <button type="button" className="btn primario" onClick={() => enviar.ejecutar()}>Enviar para evaluar</button>}
          {enviar.error && <Aviso tipo="error">{enviar.error}</Aviso>}
          <PieModelo firma={reto.firma} />
        </>
      )}
      {res && (
        <>
          <Aviso tipo={res.evaluacion.aprobado ? 'ok' : 'nota'}>
            <strong>{res.evaluacion.aprobado ? 'Aprobado' : 'Todavía no'}</strong> · {Math.round(res.evaluacion.puntaje)}/100 · +{res.xp} XP<br />
            {res.nivelDespues !== res.nivelAntes
              ? <>Tu nivel sube a <b>{res.nivelDespues}</b>.</>
              : res.evaluacion.aprobado && !res.verificable
                ? 'El reto no se puede verificar solo por texto: queda como evidencia, sin subir nivel.'
                : res.evaluacion.aprobado ? 'Tu nivel ya estaba en el máximo que puede dar un reto.' : 'Tu nivel se mantiene.'}
          </Aviso>
          <p><b>Lo que hiciste bien:</b> {res.evaluacion.fortalezas}</p>
          <p><b>Para mejorar:</b> {res.evaluacion.mejorar}</p>
          <PieModelo firma={res.firma} />
          <button type="button" className="btn" onClick={onCerrar}>Cerrar</button>
        </>
      )}
    </Modal>
  )
}
