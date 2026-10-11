// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useState } from 'react'
import type { Ruta as TRuta } from '../datos/esquemas'
import { nodoActual } from '../servicios/acciones'
import type { Todo } from './datos-vivos'
import { ModalNodo } from './modales/Nodo'
import { ModalReto } from './modales/Reto'

const ICONO: Record<string, string> = { sesion: '★', reto: '🏆', repaso: '↺', recuperacion: '♥' }

export function Ruta({ todo }: { todo: Todo }) {
  const [abierto, setAbierto] = useState<{ ruta: TRuta; u: number; n: number } | null>(null)
  if (!todo.rutas.length) {
    return <section className="tarjeta"><h2>Sin rutas todavía</h2><p className="tenue">Agrega un valor o un objetivo y genera su ruta de práctica de dos semanas.</p></section>
  }
  const nodo = abierto ? abierto.ruta.unidades[abierto.u].nodos[abierto.n] : null
  const habilidadReto = nodo?.tipo === 'reto' && nodo.estado !== 'hecho' ? todo.habilidades.find((h) => h.id === nodo.habilidades[0]) : undefined
  return (
    <div className="pila">
      {todo.rutas.map((r) => {
        const actual = nodoActual(r)
        return (
          <section key={r.id} className="ruta" aria-label={r.titulo}>
            <div className="tarjeta"><h2>{r.titulo}</h2><p className="tenue">{r.descripcion}</p></div>
            <div className="camino">
              {r.unidades.map((u, ui) => (
                <div key={ui}>
                  <div className="unidad"><b>Unidad {ui + 1}</b><span>{u.titulo}</span></div>
                  {u.nodos.map((n, ni) => {
                    const estado = n.estado === 'hecho' ? 'hecho' : actual && actual.u === ui && actual.n === ni ? 'actual' : 'bloqueado'
                    const desplazamiento = Math.round(Math.sin((ni + ui * 2) * 0.9) * 60)
                    return (
                      <div key={ni} className="nodo-envoltura" style={{ transform: `translateX(${desplazamiento}px)` }}>
                        <button type="button" className={`nodo ${estado} ${n.tipo}`} disabled={estado === 'bloqueado'}
                          aria-label={`${n.titulo} (${estado === 'hecho' ? 'hecho' : estado === 'actual' ? 'siguiente' : 'bloqueado'})`}
                          onClick={() => setAbierto({ ruta: r, u: ui, n: ni })}>
                          {estado === 'actual' && <span className="empezar">EMPEZAR</span>}
                          <span aria-hidden="true">{estado === 'hecho' ? '✓' : ICONO[n.tipo]}</span>
                        </button>
                        <span className="nodo-titulo">{n.titulo}</span>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </section>
        )
      })}
      {abierto && habilidadReto && <ModalReto h={habilidadReto} nodo={{ ruta: abierto.ruta.id, u: abierto.u, n: abierto.n }} onCerrar={() => setAbierto(null)} />}
      {abierto && !habilidadReto && <ModalNodo ruta={abierto.ruta} u={abierto.u} n={abierto.n} onCerrar={() => setAbierto(null)} />}
    </div>
  )
}
