// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useState } from 'react'
import { AREAS, type Area, type Objetivo, type Valor } from '../../datos/esquemas'
import { INFO_AREAS } from '../../datos/areas'
import { archivarValor, asignarValoresObjetivo, editarValor } from '../../servicios/acciones'
import { Aviso, Escala10, Modal } from '../comun'
import { useAccion } from '../util'
import { useDB } from '../contexto-db'

export function ModalEditarValor({ v, onCerrar }: { v: Valor; onCerrar: () => void }) {
  const db = useDB()
  const esLimite = v.tipo === 'principio'
  const [f, setF] = useState({ enunciado: v.enunciado, corto: v.corto ?? '', area: v.area, importancia: v.importancia ?? null, consistencia: v.consistencia ?? null })
  const [armado, setArmado] = useState(false)
  const guardarV = useAccion(async () => {
    await editarValor(db, v.id, esLimite ? { enunciado: f.enunciado.trim() || v.enunciado } : { ...f, enunciado: f.enunciado.trim() || v.enunciado, corto: f.corto.trim() })
    onCerrar()
  })
  const archivar = useAccion(async () => { if (!armado) { setArmado(true); return } await archivarValor(db, v.id); onCerrar() })
  const origen = v.origen === 'prototipo' ? 'Lo trajiste del prototipo de Senda.' : v.texto_original ? `Lo creaste en Senda. Lo que escribiste: "${v.texto_original}"` : 'Lo creaste en Senda.'
  return (
    <Modal etiqueta={esLimite ? 'Mis límites' : 'Mi brújula'} titulo={esLimite ? 'Límite' : v.corto || 'Valor'} onCerrar={onCerrar}>
      {!esLimite && <div className="campo"><label htmlFor="vc">Nombre corto</label><input id="vc" value={f.corto} onChange={(e) => setF({ ...f, corto: e.target.value })} /></div>}
      <div className="campo"><label htmlFor="vn">{esLimite ? 'Lo que no harías' : 'Cómo quieres actuar'}</label><textarea id="vn" rows={3} value={f.enunciado} onChange={(e) => setF({ ...f, enunciado: e.target.value })} /></div>
      {!esLimite && (
        <>
          <div className="campo"><label htmlFor="va">Área de vida</label><select id="va" value={f.area ?? ''} onChange={(e) => setF({ ...f, area: (e.target.value || undefined) as Area | undefined })}><option value="">Sin área</option>{AREAS.map((a) => <option key={a} value={a}>{INFO_AREAS[a].nombre}</option>)}</select></div>
          <div className="campo"><span className="etiqueta-campo">Importancia hoy</span><Escala10 etiqueta="Importancia hoy" valor={f.importancia} onCambio={(n) => setF({ ...f, importancia: n })} /></div>
          <div className="campo"><span className="etiqueta-campo">Cuánto actuaste así la última semana</span><Escala10 etiqueta="Consistencia" valor={f.consistencia} onCambio={(n) => setF({ ...f, consistencia: n })} /></div>
        </>
      )}
      <div className="origen"><b>De dónde salió</b><br />{origen}{v.clasificacion && <><br />El modelo lo clasificó como: {v.clasificacion}.</>}
        {v.historial.length > 0 && <><br /><br /><b>Cambios</b>{v.historial.slice(-5).reverse().map((h, i) => <span key={i}><br />{h.fecha}: {h.cambio}</span>)}</>}
      </div>
      <div className="fila">
        <button type="button" className="btn primario" onClick={() => guardarV.ejecutar()}>Guardar cambios</button>
        <button type="button" className="btn fantasma" onClick={() => archivar.ejecutar()}>{armado ? 'Confirmar: archivar' : 'Archivar'}</button>
      </div>
      {(guardarV.error || archivar.error) && <Aviso tipo="error">{guardarV.error || archivar.error}</Aviso>}
      <small className="tenue">Puedes cambiarlo cuando quieras. Archivar no borra: queda en el historial.</small>
    </Modal>
  )
}

export function ModalValoresObjetivo({ o, valores, onCerrar }: { o: Objetivo; valores: Valor[]; onCerrar: () => void }) {
  const db = useDB()
  const [sel, setSel] = useState<string[]>(o.valores)
  const accion = useAccion(async () => { await asignarValoresObjetivo(db, o.id, sel); onCerrar() })
  return (
    <Modal etiqueta={`Objetivo · ${o.titulo}`} titulo="¿A qué valor responde?" onCerrar={onCerrar}>
      <p className="tenue">Todo objetivo debe servir al menos a un valor. Si ninguno encaja, quizá falta registrar un valor.</p>
      <div className="chips">
        {valores.map((v) => (
          <label key={v.id} className="chip"><input type="checkbox" checked={sel.includes(v.id)} onChange={(e) => setSel(e.target.checked ? [...sel, v.id] : sel.filter((x) => x !== v.id))} /> {v.corto || v.enunciado}</label>
        ))}
      </div>
      <button type="button" className="btn primario" onClick={() => accion.ejecutar()}>Guardar</button>
      {accion.error && <Aviso tipo="error">{accion.error}</Aviso>}
    </Modal>
  )
}
