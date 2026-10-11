// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useState } from 'react'
import { guardar } from '../datos/repositorio'
import type { Perfil } from '../datos/esquemas'
import { Aviso } from './comun'
import { useDB } from './contexto-db'
import { ImportarDatos } from './Ajustes'

/** Primera vez (sin perfil) o perfil importado que aún no confirmó la mayoría de edad (P-007). */
export function Bienvenida({ perfil }: { perfil?: Perfil }) {
  const db = useDB()
  const [nombre, setNombre] = useState(perfil?.nombre ?? '')
  const [mayor, setMayor] = useState(false)
  const [msg, setMsg] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  async function empezar() {
    if (!nombre.trim()) { setMsg({ tipo: 'error', texto: 'Escribe cómo quieres que te llamemos.' }); return }
    if (!mayor) { setMsg({ tipo: 'error', texto: 'Por ahora Senda es solo para mayores de 18 años.' }); return }
    await guardar(db, 'perfil', { ...(perfil ?? { id: 'perfil' }), nombre: nombre.trim(), mayor_de_edad: true } as never)
  }

  return (
    <main className="app bienvenida">
      <h1 className="marca">Senda</h1>
      <p className="lema">Qué sabes hacer, qué podrías aprender y qué te conviene desarrollar, conectado con lo que te importa.</p>
      <section className="tarjeta">
        <h2>{perfil ? 'Confirma tus datos' : 'Empecemos'}</h2>
        {perfil && <Aviso tipo="ok">Tus datos ya están en este dispositivo. Confirma tu nombre y tu edad para entrar.</Aviso>}
        <div className="campo"><label htmlFor="bn">¿Cómo te llamas?</label><input id="bn" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="given-name" /></div>
        <label className="fila"><input type="checkbox" checked={mayor} onChange={(e) => setMayor(e.target.checked)} /> Tengo 18 años o más</label>
        <button type="button" className="btn primario" onClick={empezar}>Empezar</button>
        {msg && <Aviso tipo={msg.tipo}>{msg.texto}</Aviso>}
        <p className="tenue">Tus datos se guardan solo en este dispositivo. Nada sale de aquí sin que lo pidas.</p>
      </section>
      {!perfil && (
        <section className="tarjeta">
          <h2>¿Ya usabas Senda?</h2>
          <ImportarDatos onListo={(t) => setMsg({ tipo: 'ok', texto: t })} onError={(t) => setMsg({ tipo: 'error', texto: t })} />
        </section>
      )}
    </main>
  )
}
