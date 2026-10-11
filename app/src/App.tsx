// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useState } from 'react'
import { Agregar, type DestinoAgregar } from './ui/Agregar'
import { Ajustes } from './ui/Ajustes'
import { Bienvenida } from './ui/Bienvenida'
import { progreso, useTodo } from './ui/datos-vivos'
import { Inicio } from './ui/Inicio'
import { Ruta } from './ui/Ruta'

type Pestana = 'inicio' | 'ruta' | 'agregar' | 'ajustes'

const PESTANAS: { id: Pestana; nombre: string; icono: string }[] = [
  { id: 'inicio', nombre: 'Inicio', icono: '⌂' },
  { id: 'ruta', nombre: 'Ruta', icono: '⟿' },
  { id: 'agregar', nombre: 'Agregar', icono: '+' },
  { id: 'ajustes', nombre: 'Ajustes', icono: '⚙' },
]

function leerPestana(): Pestana {
  try {
    const p = localStorage.getItem('senda-pestana')
    return PESTANAS.some((x) => x.id === p) ? (p as Pestana) : 'inicio'
  } catch {
    return 'inicio'
  }
}

export default function App() {
  const todo = useTodo()
  const [pestana, setPestanaEstado] = useState<Pestana>(leerPestana)
  const [destino, setDestino] = useState<DestinoAgregar>({ tipo: 'valor' })
  const setPestana = (p: Pestana) => {
    setPestanaEstado(p)
    try { localStorage.setItem('senda-pestana', p) } catch { /* sin almacenamiento */ }
    window.scrollTo({ top: 0 })
  }

  if (!todo) return <main className="app"><p className="tenue" role="status">Cargando…</p></main>
  if (!todo.perfil || !todo.perfil.mayor_de_edad) return <Bienvenida key={todo.perfil?.actualizado ?? 'nuevo'} perfil={todo.perfil} />

  const p = progreso(todo.eventos)
  const sinModelo = !todo.perfil.modelo
  return (
    <>
      <main className="app">
        <header className="arriba">
          <h1 className="marca">Senda</h1>
          <div className="stats">
            <span className="stat">⚡ {p.xp}<small>XP</small></span>
            <span className="stat">🔥 {p.racha}<small>días</small></span>
            <span className="stat">★ {p.nivel}<small>personaje</small></span>
          </div>
        </header>
        {sinModelo && pestana !== 'ajustes' && (
          <div className="aviso">Para analizar, armar rutas y evaluar retos, elige tu modelo de IA. <button type="button" className="enlace" onClick={() => setPestana('ajustes')}>Ir a Ajustes</button></div>
        )}
        {pestana === 'inicio' && <Inicio todo={todo} irAgregar={(d) => { setDestino(d); setPestana('agregar') }} />}
        {pestana === 'ruta' && <Ruta todo={todo} />}
        {pestana === 'agregar' && <Agregar todo={todo} destino={destino} setDestino={setDestino} irRuta={() => setPestana('ruta')} />}
        {pestana === 'ajustes' && <Ajustes perfil={todo.perfil} />}
      </main>
      <nav className="pestanas" aria-label="Secciones">
        {PESTANAS.map((t) => (
          <button key={t.id} type="button" className="pestana" aria-current={pestana === t.id ? 'page' : undefined}
            onClick={() => { if (t.id === 'agregar') setDestino({ tipo: 'valor' }); setPestana(t.id) }}>
            <span aria-hidden="true">{t.icono}</span>{t.nombre}
          </button>
        ))}
      </nav>
    </>
  )
}
