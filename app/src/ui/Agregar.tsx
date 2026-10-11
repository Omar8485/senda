// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useState } from 'react'
import { AREAS, type Area } from '../datos/esquemas'
import { INFO_AREAS } from '../datos/areas'
import type { Firmado } from '../modelos/cliente'
import type { Salida } from '../modelos/salidas'
import { aceptarObjetivo, aceptarValor, analizarObjetivo, analizarValor, generarRuta } from '../servicios/acciones'
import { Aviso, Pensando, PieModelo } from './comun'
import { exigirAdaptador, useAccion } from './util'
import { useDB } from './contexto-db'
import type { Todo } from './datos-vivos'

export type DestinoAgregar = { tipo: 'valor' | 'objetivo'; valorExistente?: string }

export function Agregar({ todo, destino, setDestino, irRuta }: { todo: Todo; destino: DestinoAgregar; setDestino: (d: DestinoAgregar) => void; irRuta: () => void }) {
  return (
    <div className="pila">
      {!destino.valorExistente && (
        <div className="seg" role="tablist" aria-label="Qué quieres agregar">
          <button type="button" role="tab" aria-selected={destino.tipo === 'valor'} onClick={() => setDestino({ tipo: 'valor' })}>Un valor</button>
          <button type="button" role="tab" aria-selected={destino.tipo === 'objetivo'} onClick={() => setDestino({ tipo: 'objetivo' })}>Un objetivo</button>
        </div>
      )}
      {destino.tipo === 'valor'
        ? <AgregarValor key={destino.valorExistente ?? 'nuevo'} todo={todo} valorExistente={destino.valorExistente} irRuta={irRuta} />
        : <AgregarObjetivo todo={todo} irRuta={irRuta} />}
    </div>
  )
}

function SelectorArea({ id, valor, onCambio }: { id: string; valor: Area; onCambio: (a: Area) => void }) {
  return (
    <div className="campo">
      <label htmlFor={id}>Área de vida</label>
      <select id={id} value={valor} onChange={(e) => onCambio(e.target.value as Area)}>{AREAS.map((a) => <option key={a} value={a}>{INFO_AREAS[a].nombre}</option>)}</select>
      <small>{INFO_AREAS[valor].ayuda}</small>
    </div>
  )
}

function GenerarRuta({ fuente, habilidades, irRuta }: { fuente: string; habilidades: string[]; irRuta: () => void }) {
  const db = useDB()
  const [lista, setLista] = useState(false)
  const accion = useAccion(async () => { await generarRuta(await exigirAdaptador(db), db, { fuente, habilidades }); setLista(true) })
  if (lista) return <Aviso tipo="ok">Ruta creada. <button type="button" className="enlace" onClick={irRuta}>Ver mi ruta</button></Aviso>
  return (
    <>
      {accion.cargando ? <Pensando texto="Armando tu ruta de dos semanas…" /> : <button type="button" className="btn primario" disabled={!habilidades.length} onClick={() => accion.ejecutar()}>Generar mi ruta</button>}
      {accion.error && <Aviso tipo="error">{accion.error}</Aviso>}
    </>
  )
}

function AgregarValor({ todo, valorExistente, irRuta }: { todo: Todo; valorExistente?: string; irRuta: () => void }) {
  const db = useDB()
  const previo = todo.valores.find((v) => v.id === valorExistente)
  const [texto, setTexto] = useState(previo?.enunciado ?? '')
  const [area, setArea] = useState<Area>(previo?.area ?? 'transversal')
  const [ejemplo, setEjemplo] = useState('')
  const [analisis, setAnalisis] = useState<Firmado<Salida<'analizar-valor'>> | null>(null)
  const [enunciado, setEnunciado] = useState('')
  const [quitadas, setQuitadas] = useState<Set<string>>(new Set())
  const [hecho, setHecho] = useState<{ id: string; habilidades: string[]; creadas: number; enunciado: string } | null>(null)

  const analizar = useAccion(async () => {
    if (texto.trim().length < 5) throw new Error('Escribe tu valor primero.')
    const r = await analizarValor(await exigirAdaptador(db), db, { texto, area, ejemplo })
    setAnalisis(r)
    setEnunciado(previo?.enunciado ?? r.resultado.enunciado)
    setQuitadas(new Set())
  })
  const aceptar = useAccion(async () => {
    const a = analisis!.resultado
    const elegidas = a.contextos.flatMap((c, ci) => c.habilidades.filter((_, hi) => !quitadas.has(`${ci}-${hi}`)))
    const r = await aceptarValor(db, { analisis: a, enunciado: enunciado.trim() || a.enunciado, texto, area, elegidas, valorExistente })
    setHecho({ ...r, enunciado: enunciado.trim() || a.enunciado })
  })

  if (hecho) {
    return (
      <section className="tarjeta">
        <h2>Valor registrado</h2>
        <Aviso tipo="ok">{hecho.enunciado}</Aviso>
        <p className="tenue">{hecho.creadas} habilidades nuevas quedaron en tu ficha, por evaluar. El siguiente paso es generar una ruta de práctica de dos semanas.</p>
        <GenerarRuta fuente={hecho.id} habilidades={hecho.habilidades} irRuta={irRuta} />
      </section>
    )
  }
  if (analisis) {
    const a = analisis.resultado
    return (
      <section className="tarjeta">
        <h2>Análisis</h2>
        <div className="clasificacion"><b>Clasificación: {a.clasificacion}</b><br />{a.explicacion}</div>
        <div className="campo"><label htmlFor="ven">Formulación como valor <small>(edítala si quieres)</small></label><textarea id="ven" rows={2} value={enunciado} onChange={(e) => setEnunciado(e.target.value)} />
          {previo && previo.enunciado !== a.enunciado && <small>El modelo sugiere: "{a.enunciado}". Se mantiene tu frase salvo que la cambies.</small>}</div>
        <p><b>Situaciones donde se pone a prueba y habilidades que exige</b></p>
        {a.contextos.map((c, ci) => (
          <div key={ci} className="contexto">
            <h4>{c.situacion}</h4>
            {c.habilidades.map((h, hi) => {
              const k = `${ci}-${hi}`
              return (
                <label key={k} className="elegir">
                  <input type="checkbox" checked={!quitadas.has(k)} onChange={(e) => { const s = new Set(quitadas); if (e.target.checked) s.delete(k); else s.add(k); setQuitadas(s) }} />
                  <span><b>{h.nombre}</b> <span className={`tag ${h.clase === 'especializar' ? 'esp' : 'ind'}`}>{h.clase === 'especializar' ? 'Especializar' : 'Indispensable'} · nivel {h.nivel_minimo}</span><br /><small>{h.por_que}</small></span>
                </label>
              )
            })}
          </div>
        ))}
        <div className="fila">
          <button type="button" className="btn primario" disabled={aceptar.cargando} onClick={() => aceptar.ejecutar()}>Aceptar y crear habilidades</button>
          <button type="button" className="btn fantasma" onClick={() => setAnalisis(null)}>Volver a escribir</button>
        </div>
        {aceptar.error && <Aviso tipo="error">{aceptar.error}</Aviso>}
        <PieModelo firma={analisis.firma} />
      </section>
    )
  }
  return (
    <section className="tarjeta">
      <h2>{previo ? 'Derivar habilidades de un valor' : 'Agregar un valor'}</h2>
      {previo && <Aviso tipo="ok">Vas a derivar habilidades para tu valor existente. Puedes ajustar la frase antes de analizar.</Aviso>}
      <p className="tenue">Escribe cómo quieres actuar, con tus palabras. El modelo lo clasifica, encuentra las situaciones donde se pone a prueba y te propone las habilidades que necesitas. Tú decides qué aceptar.</p>
      <div className="campo"><label htmlFor="vt">¿Qué eliges vivir?</label><textarea id="vt" rows={3} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Ej.: la puntualidad. Quiero cumplir siempre a tiempo, sin importar lo que hagan los demás." /></div>
      <SelectorArea id="va2" valor={area} onCambio={setArea} />
      <div className="campo"><label htmlFor="ve">Un ejemplo de tu día a día <small>(opcional)</small></label><input id="ve" value={ejemplo} onChange={(e) => setEjemplo(e.target.value)} /></div>
      {analizar.cargando ? <Pensando texto="Analizando tu valor. Puede tardar hasta un minuto…" /> : <button type="button" className="btn primario" onClick={() => analizar.ejecutar()}>Analizar</button>}
      {analizar.error && <Aviso tipo="error">{analizar.error}</Aviso>}
    </section>
  )
}

function AgregarObjetivo({ todo, irRuta }: { todo: Todo; irRuta: () => void }) {
  const db = useDB()
  const valores = todo.valores.filter((v) => v.tipo === 'valor' && v.estado !== 'archivado')
  const [f, setF] = useState({ texto: '', criterio: '', fecha: '', area: 'trabajo' as Area, valores: [] as string[] })
  const [analisis, setAnalisis] = useState<Firmado<Salida<'analizar-objetivo'>> | null>(null)
  const [edicion, setEdicion] = useState({ titulo: '', enunciado: '', criterio: '' })
  const [quitadas, setQuitadas] = useState<Set<number>>(new Set())
  const [hecho, setHecho] = useState<{ id: string; habilidades: string[]; creadas: number; titulo: string } | null>(null)

  const analizar = useAccion(async () => {
    if (f.texto.trim().length < 5) throw new Error('Escribe tu objetivo primero.')
    if (!f.valores.length) throw new Error('Elige al menos un valor al que responda este objetivo.')
    const r = await analizarObjetivo(await exigirAdaptador(db), db, { texto: f.texto, criterio: f.criterio, fecha: f.fecha || null, area: f.area })
    setAnalisis(r)
    setEdicion({ titulo: r.resultado.titulo, enunciado: r.resultado.enunciado || f.texto, criterio: r.resultado.criterio || f.criterio })
    setQuitadas(new Set())
  })
  const aceptar = useAccion(async () => {
    const a = analisis!.resultado
    const r = await aceptarObjetivo(db, {
      titulo: edicion.titulo.trim() || a.titulo || 'Objetivo', enunciado: edicion.enunciado.trim(), criterio: edicion.criterio.trim(),
      fecha: f.fecha || null, area: f.area, valores: f.valores, texto: f.texto, elegidas: a.habilidades.filter((_, i) => !quitadas.has(i)),
    })
    setHecho({ ...r, titulo: edicion.titulo.trim() || a.titulo })
  })

  if (!valores.length) {
    return <section className="tarjeta"><h2>Agregar un objetivo</h2><Aviso>Todo objetivo responde al menos a un valor. Primero registra un valor en "Un valor".</Aviso></section>
  }
  if (hecho) {
    return (
      <section className="tarjeta">
        <h2>Objetivo registrado</h2>
        <Aviso tipo="ok"><b>{hecho.titulo}</b></Aviso>
        <p className="tenue">{hecho.habilidades.length} habilidades quedaron asociadas ({hecho.creadas} nuevas, por evaluar).</p>
        <GenerarRuta fuente={hecho.id} habilidades={hecho.habilidades} irRuta={irRuta} />
      </section>
    )
  }
  if (analisis) {
    const a = analisis.resultado
    return (
      <section className="tarjeta">
        <h2>Análisis del objetivo</h2>
        <div className="clasificacion">{a.es_objetivo ? <b>Es un objetivo. </b> : <b>Ojo: </b>}{a.observacion}</div>
        <div className="campo"><label htmlFor="otit">Nombre corto</label><input id="otit" value={edicion.titulo} onChange={(e) => setEdicion({ ...edicion, titulo: e.target.value })} /></div>
        <div className="campo"><label htmlFor="oen">Resultado</label><textarea id="oen" rows={2} value={edicion.enunciado} onChange={(e) => setEdicion({ ...edicion, enunciado: e.target.value })} /></div>
        <div className="campo"><label htmlFor="ocr">Criterio de logro <small>(verificable, sin ambigüedad)</small></label><textarea id="ocr" rows={3} value={edicion.criterio} onChange={(e) => setEdicion({ ...edicion, criterio: e.target.value })} /></div>
        <p><b>Habilidades que exige</b></p>
        {a.habilidades.map((h, i) => (
          <label key={i} className="elegir">
            <input type="checkbox" checked={!quitadas.has(i)} onChange={(e) => { const s = new Set(quitadas); if (e.target.checked) s.delete(i); else s.add(i); setQuitadas(s) }} />
            <span><b>{h.nombre}</b> <span className="tag obj">Meta: nivel {h.nivel_requerido}</span>{todo.habilidades.some((x) => x.id === h.id) && <span className="tag ind">Ya la tienes registrada</span>}<br /><small>{h.por_que}</small></span>
          </label>
        ))}
        <div className="fila">
          <button type="button" className="btn primario" disabled={aceptar.cargando} onClick={() => aceptar.ejecutar()}>Aceptar y crear objetivo</button>
          <button type="button" className="btn fantasma" onClick={() => setAnalisis(null)}>Volver a escribir</button>
        </div>
        {aceptar.error && <Aviso tipo="error">{aceptar.error}</Aviso>}
        <PieModelo firma={analisis.firma} />
      </section>
    )
  }
  return (
    <section className="tarjeta">
      <h2>Agregar un objetivo</h2>
      <p className="tenue">Un objetivo es un resultado que se puede tachar como logrado y tiene fecha. El modelo afina el criterio para que sea verificable y te propone las habilidades que exige.</p>
      <div className="campo"><label htmlFor="ot">¿Qué quieres lograr?</label><textarea id="ot" rows={2} value={f.texto} onChange={(e) => setF({ ...f, texto: e.target.value })} placeholder="Ej.: aprobar una certificación" /></div>
      <div className="campo"><label htmlFor="oc">¿Cómo sabrás que lo lograste?</label><textarea id="oc" rows={2} value={f.criterio} onChange={(e) => setF({ ...f, criterio: e.target.value })} placeholder="Ej.: tener el certificado emitido" /></div>
      <div className="campo"><label htmlFor="of">Fecha límite</label><input id="of" type="date" value={f.fecha} onChange={(e) => setF({ ...f, fecha: e.target.value })} /></div>
      <SelectorArea id="oa" valor={f.area} onCambio={(a) => setF({ ...f, area: a })} />
      <div className="campo">
        <span className="etiqueta-campo">¿A qué valor responde? <small>(al menos uno)</small></span>
        <div className="chips">
          {valores.map((v) => <label key={v.id} className="chip"><input type="checkbox" checked={f.valores.includes(v.id)} onChange={(e) => setF({ ...f, valores: e.target.checked ? [...f.valores, v.id] : f.valores.filter((x) => x !== v.id) })} /> {v.corto || v.enunciado}</label>)}
        </div>
      </div>
      {analizar.cargando ? <Pensando texto="Analizando tu objetivo…" /> : <button type="button" className="btn primario" onClick={() => analizar.ejecutar()}>Analizar</button>}
      {analizar.error && <Aviso tipo="error">{analizar.error}</Aviso>}
    </section>
  )
}
