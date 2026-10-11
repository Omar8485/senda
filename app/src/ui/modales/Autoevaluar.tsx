// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useState } from 'react'
import type { Habilidad } from '../../datos/esquemas'
import { autoevaluar } from '../../servicios/acciones'
import type { NivelHabilidad, NivelRegistrado } from '../../nucleo'
import { Aviso, Modal } from '../comun'
import { useAccion } from '../util'
import { useDB } from '../contexto-db'
import { useEvidencias } from '../datos-vivos'

const ESCALA: [NivelHabilidad, string, string][] = [
  [0, 'Sin exposición', 'Nunca lo intenté o solo oí hablar de ello.'],
  [1, 'Novato', 'Hago casos simples siguiendo instrucciones; necesito supervisión.'],
  [2, 'Básico funcional', 'Resuelvo casos habituales sencillos con apoyo puntual.'],
  [3, 'Competente', 'Resuelvo los casos habituales de forma autónoma y consistente.'],
  [4, 'Avanzado', 'Manejo casos complejos o atípicos, adapto el enfoque y puedo enseñar.'],
  [5, 'Experto', 'Resuelvo situaciones nuevas y de alto riesgo; creo métodos que otros adoptan.'],
]

export function ModalAutoevaluar({ h, onCerrar }: { h: Habilidad; onCerrar: () => void }) {
  const db = useDB()
  const evidencias = useEvidencias({ habilidad: h.id })
  const [propuesto, setPropuesto] = useState<NivelHabilidad>((h.sospechado ?? h.nivel ?? 1) as NivelHabilidad)
  const [r, setR] = useState<NivelRegistrado | null>(null)
  const accion = useAccion(async () => setR((await autoevaluar(db, h.id, propuesto)).registrado))
  return (
    <Modal etiqueta={`Autoevaluación · ${h.nombre}`} titulo="¿Qué nivel crees tener?" onCerrar={onCerrar}>
      <p className="tenue">Elige con honestidad. Senda registra el nivel que tu evidencia respalda (tienes {evidencias.length} {evidencias.length === 1 ? 'evidencia' : 'evidencias'}) y anota el resto como sospechado.</p>
      <div className="opciones" role="radiogroup" aria-label="Nivel">
        {ESCALA.map(([n, nombre, desc]) => (
          <label key={n} className="opcion"><input type="radio" name="nivel" checked={propuesto === n} onChange={() => setPropuesto(n)} /><span><b>{n} · {nombre}</b><br /><small>{desc}</small></span></label>
        ))}
      </div>
      {!r && <button type="button" className="btn primario" onClick={() => accion.ejecutar()}>Registrar</button>}
      {accion.error && <Aviso tipo="error">{accion.error}</Aviso>}
      {r && (
        <Aviso tipo="ok">
          Nivel registrado: <b>{r.nivel}</b> · confianza {r.confianza}.
          {r.sospechado !== undefined && <> Tu evidencia todavía no respalda el {r.sospechado}: queda anotado como sospechado. Para subirlo, registra evidencia en otro contexto, evidencia externa o aprueba un reto.</>}
        </Aviso>
      )}
      {r && <button type="button" className="btn" onClick={onCerrar}>Cerrar</button>}
    </Modal>
  )
}
