// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useEffect, useRef, type ReactNode } from 'react'
import type { FirmaModelo, Habilidad } from '../datos/esquemas'

export function Modal({ titulo, etiqueta, onCerrar, children }: { titulo: string; etiqueta?: string; onCerrar: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (d && !d.open) d.showModal()
    return () => d?.close()
  }, [])
  return (
    <dialog ref={ref} className="modal" aria-label={titulo} onCancel={(e) => { e.preventDefault(); onCerrar() }}
      onClick={(e) => { if (e.target === ref.current) onCerrar() }}>
      <div className="modal-cuerpo">
        <button type="button" className="cerrar" aria-label="Cerrar" onClick={onCerrar}>×</button>
        {etiqueta && <span className="etiqueta">{etiqueta}</span>}
        <h3>{titulo}</h3>
        {children}
      </div>
    </dialog>
  )
}

/** Barras de nivel 1-5: con evidencia, sospechado sin evidencia y requerido. */
export function Pips({ h }: { h: Pick<Habilidad, 'nivel' | 'sospechado' | 'requerido'> }) {
  const n = h.nivel ?? -1, s = h.sospechado ?? -1, r = h.requerido ?? -1
  const etiqueta = `Nivel ${n < 0 ? 'por evaluar' : n}${s > n ? `, sospechado ${s}` : ''}${r > 0 ? `, requerido ${r}` : ''}`
  return (
    <span className="pips" role="img" aria-label={etiqueta}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`pip ${i <= n ? 'on' : i <= s ? 'sus' : ''} ${i === r ? 'req' : ''}`} aria-hidden="true" />
      ))}
    </span>
  )
}

export function Pensando({ texto }: { texto: string }) {
  return <div className="pensando" role="status"><span className="puntos"><span /><span /><span /></span>{texto}</div>
}

export function Aviso({ tipo = 'nota', children }: { tipo?: 'nota' | 'ok' | 'error'; children: ReactNode }) {
  return <div className={`aviso ${tipo}`} role={tipo === 'error' ? 'alert' : undefined}>{children}</div>
}

/** Aviso de P-003 al pie de todo lo que genera un modelo. */
export function PieModelo({ firma }: { firma: FirmaModelo }) {
  return (
    <p className="pie-modelo">
      Generado por {firma.modelo}. Puede contener errores; la calidad depende del modelo que elegiste. Úsalo como guía, no como certificación.
    </p>
  )
}


export function Escala10({ valor, onCambio, etiqueta }: { valor: number | null | undefined; onCambio: (n: number) => void; etiqueta: string }) {
  return (
    <div className="escala" role="group" aria-label={etiqueta}>
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button key={n} type="button" aria-pressed={valor === n} onClick={() => onCambio(n)}>{n}</button>
      ))}
    </div>
  )
}
