// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useState } from 'react'
import { AREAS, type Area, type Habilidad, type Objetivo, type Valor } from '../datos/esquemas'
import { INFO_AREAS } from '../datos/areas'
import { reabrirObjetivo, reactivarHabilidad } from '../servicios/acciones'
import { XP_POR_NIVEL_PERSONAJE } from '../nucleo'
import { AvatarPerfil } from './Avatar'
import { Pips } from './comun'
import { useDB } from './contexto-db'
import { progreso, xpDe, type Todo } from './datos-vivos'
import { ModalAutoevaluar } from './modales/Autoevaluar'
import { ModalAvatar } from './modales/Avatar'
import { ModalEvidencia } from './modales/Evidencia'
import { ModalLogro } from './modales/Logro'
import { ModalReto } from './modales/Reto'
import { ModalEditarValor, ModalValoresObjetivo } from './modales/Valores'

type Foco = { modo: 'objetivos' | 'valores' | 'todas'; id?: string; estado?: 'activo' | 'logrado' }
type ModalAbierto =
  | { tipo: 'reto' | 'evidencia' | 'autoevaluar'; h: Habilidad }
  | { tipo: 'logro' | 'valores-objetivo'; o: Objetivo }
  | { tipo: 'valor'; v: Valor }
  | { tipo: 'avatar' }
  | null

function leerFoco(): Foco {
  try { return JSON.parse(localStorage.getItem('senda-foco') ?? '') as Foco } catch { return { modo: 'objetivos' } }
}

export function Inicio({ todo, irAgregar }: { todo: Todo; irAgregar: (destino: { tipo: 'valor' | 'objetivo'; valorExistente?: string }) => void }) {
  const db = useDB()
  const [foco, setFocoEstado] = useState<Foco>(leerFoco)
  const [modal, setModal] = useState<ModalAbierto>(null)
  const setFoco = (f: Partial<Foco>) => {
    const nuevo = { ...foco, ...f }
    setFocoEstado(nuevo)
    try { localStorage.setItem('senda-foco', JSON.stringify(nuevo)) } catch { /* sin almacenamiento */ }
  }
  const perfil = todo.perfil!
  const p = progreso(todo.eventos)
  const vivos = todo.valores.filter((v) => v.estado !== 'archivado')
  const valores = vivos.filter((v) => v.tipo === 'valor')
  const limites = vivos.filter((v) => v.tipo === 'principio')
  const todas = todo.habilidades.filter((h) => h.estado !== 'descartada')
  const activas = todas.filter((h) => h.estado === 'activa')
  const pausadas = todas.filter((h) => h.estado === 'pausada')
  const objetivos = todo.objetivos.filter((o) => o.estado !== 'archivado')
  const estado = foco.estado ?? 'activo'
  const objs = objetivos.filter((o) => (estado === 'logrado' ? o.estado === 'logrado' : o.estado !== 'logrado'))
  const deFuente = (id: string) => activas.filter((h) => h.fuentes.includes(id))
  const nombreFuente = (id: string) => todo.objetivos.find((o) => o.id === id)?.titulo ?? todo.valores.find((v) => v.id === id)?.corto ?? id
  const items: { id: string; texto: string }[] = foco.modo === 'objetivos' ? objs.map((o) => ({ id: o.id, texto: o.titulo }))
    : foco.modo === 'valores' ? valores.map((v) => ({ id: v.id, texto: v.corto || v.enunciado })) : []
  const sel = items.find((i) => i.id === foco.id)?.id ?? items[0]?.id

  const fila = (h: Habilidad, conFuente = false) => (
    <div className="habilidad" key={h.id}>
      <div className="hn">{h.nombre}<small>{h.nivel === null ? 'Por evaluar' : `Nivel ${h.nivel}`}{h.sospechado !== null && h.sospechado > (h.nivel ?? -1) ? ` · sospechado ${h.sospechado}` : ''} · confianza {h.confianza}</small></div>
      <Pips h={h} />
      <div className="hmeta">
        {conFuente && <span>Para: {h.fuentes.map(nombreFuente).join(', ')}</span>}
        {(h.clase === 'indispensable' || h.clase === 'especializar') && <span className={`tag ${h.clase === 'indispensable' ? 'ind' : 'esp'}`}>{h.clase === 'indispensable' ? 'Indispensable' : 'Especializar'}</span>}
        {h.requerido !== null && <span>Meta: nivel {h.requerido}</span>}
        <span>⚡ {xpDe(todo.eventos, h.id)} XP de práctica</span>
        <button type="button" className="enlace" onClick={() => setModal({ tipo: 'reto', h })}>Ponerme a prueba</button>
        <button type="button" className="enlace" onClick={() => setModal({ tipo: 'evidencia', h })}>Subir evidencia</button>
        <button type="button" className="enlace" onClick={() => setModal({ tipo: 'autoevaluar', h })}>Autoevaluarme</button>
      </div>
    </div>
  )

  let enfoque
  if (foco.modo === 'todas') {
    enfoque = <section className="grupo"><h3>{activas.length} habilidades</h3><p className="tenue">Cada una muestra para qué objetivo o valor la necesitas.</p>{activas.map((h) => fila(h, true))}{!activas.length && <p className="tenue">Sin habilidades todavía.</p>}</section>
  } else if (!sel) {
    enfoque = <section className="grupo"><p className="tenue">{foco.modo === 'objetivos' ? 'No tienes objetivos en esta lista todavía.' : 'No tienes valores todavía.'}</p></section>
  } else if (foco.modo === 'objetivos') {
    const o = todo.objetivos.find((x) => x.id === sel)!
    const hs = deFuente(o.id)
    const vs = o.valores.map((id) => valores.find((v) => v.id === id)).filter((v): v is Valor => !!v)
    enfoque = (
      <section className="grupo foco">
        <span className="gk o">{o.estado === 'logrado' ? 'Objetivo logrado ✓' : 'Objetivo en curso'}</span>
        <h3>{o.titulo}</h3>
        {o.estado === 'logrado' && <div className="aviso ok">Logrado el {o.fecha_logro}{o.logrado_con_retraso ? ', después de la fecha límite' : ''}. Las habilidades que desarrollaste siguen en tu ficha.</div>}
        {vs.length ? (
          <div className="responde"><span>Responde a:</span>{vs.map((v) => <button type="button" key={v.id} className="chip valor" onClick={() => setFoco({ modo: 'valores', id: v.id })}>{v.corto || v.enunciado}</button>)}<button type="button" className="enlace" onClick={() => setModal({ tipo: 'valores-objetivo', o })}>Cambiar</button></div>
        ) : (
          <div className="aviso">Este objetivo todavía no dice a qué valor responde. <button type="button" className="enlace" onClick={() => setModal({ tipo: 'valores-objetivo', o })}>Asignar valor</button></div>
        )}
        <p>{o.enunciado}{o.fecha_limite && <> · Fecha: <b>{o.fecha_limite}</b></>}</p>
        {o.criterio && <details><summary>¿Cómo sabré que lo logré?</summary><p>{o.criterio}</p></details>}
        <p><b>Habilidades que exige ({hs.length}):</b></p>
        {hs.map((h) => fila(h))}
        {!hs.length && <p className="tenue">Sin habilidades asociadas.</p>}
        <div className="fila">
          {o.estado === 'logrado'
            ? <button type="button" className="btn fantasma" onClick={() => reabrirObjetivo(db, o.id).then(() => setFoco({ estado: 'activo' }))}>Reabrir objetivo</button>
            : <><button type="button" className="btn" onClick={() => setModal({ tipo: 'logro', o })}>Presentar evidencia del logro</button><small className="tenue">Para marcarlo como logrado necesitas evidencia evaluada contra tu criterio.</small></>}
        </div>
      </section>
    )
  } else {
    const v = todo.valores.find((x) => x.id === sel)!
    const hs = deFuente(v.id)
    const usadas = new Set<string>()
    const situaciones = v.situaciones.map((s) => {
      const lista = hs.filter((h) => s.habilidades.includes(h.id))
      lista.forEach((h) => usadas.add(h.id))
      return { situacion: s.situacion, lista }
    }).filter((s) => s.lista.length)
    const resto = hs.filter((h) => !usadas.has(h.id))
    const sirven = objetivos.filter((o) => o.valores.includes(v.id))
    enfoque = (
      <section className="grupo foco">
        <span className="gk v">Valor · {v.area ? INFO_AREAS[v.area].nombre : 'Sin área'}</span>
        <h3>{v.corto || 'Valor'}</h3>
        <p>{v.enunciado}</p>
        {sirven.length > 0 && <div className="responde"><span>Objetivos que lo sirven:</span>{sirven.map((o) => <button type="button" key={o.id} className="chip" onClick={() => setFoco({ modo: 'objetivos', estado: o.estado === 'logrado' ? 'logrado' : 'activo', id: o.id })}>{o.titulo}{o.estado === 'logrado' ? ' ✓' : ''}</button>)}</div>}
        {hs.length ? (
          <>
            {situaciones.map((s, i) => <div className="situacion" key={i}><p className="sit">Situación: {s.situacion}</p>{s.lista.map((h) => fila(h))}</div>)}
            {resto.length > 0 && <div className="situacion"><p className="sit">Otras habilidades de este valor</p>{resto.map((h) => fila(h))}</div>}
          </>
        ) : (
          <>
            <div className="aviso ok">Todavía no derivaste habilidades de este valor. El modelo puede buscar las situaciones donde se pone a prueba y proponerte habilidades.</div>
            <button type="button" className="btn primario" onClick={() => irAgregar({ tipo: 'valor', valorExistente: v.id })}>Derivar habilidades</button>
          </>
        )}
      </section>
    )
  }

  const porArea = new Map<Area | '_', Valor[]>()
  for (const v of valores) porArea.set(v.area ?? '_', [...(porArea.get(v.area ?? '_') ?? []), v])
  const ordenAreas = [...porArea.keys()].sort((a, b) => (a === '_' ? 98 : a === 'transversal' ? 99 : AREAS.indexOf(a)) - (b === '_' ? 98 : b === 'transversal' ? 99 : AREAS.indexOf(b)))

  return (
    <div className="inicio">
      <aside className="heroe">
        <button type="button" className="boton-avatar" onClick={() => setModal({ tipo: 'avatar' })} title="Cambiar avatar"><AvatarPerfil perfil={perfil} /><span>Cambiar avatar</span></button>
        <p className="nombre">{perfil.nombre}</p>
        <div className="etiqueta">Personaje nivel {p.nivel}</div>
        <div className="barra-xp" title={`${p.enNivel} de ${XP_POR_NIVEL_PERSONAJE} XP`}><i style={{ width: `${(p.enNivel / XP_POR_NIVEL_PERSONAJE) * 100}%` }} /></div>
        <small className="tenue">El XP mide tu práctica. El nivel de cada habilidad solo sube con retos aprobados o evidencia.</small>
        <div className="cabecera"><h2>Mi brújula</h2><button type="button" className="enlace" onClick={() => irAgregar({ tipo: 'valor' })}>+ Agregar</button></div>
        <div className="valores">
          {ordenAreas.map((a) => (
            <div className="grupo-area" key={a}>
              <div className="area" title={a === '_' ? undefined : INFO_AREAS[a].ayuda}>{a === '_' ? 'Sin área' : INFO_AREAS[a].nombre}</div>
              {porArea.get(a)!.map((v) => <button type="button" key={v.id} className="valor" onClick={() => setModal({ tipo: 'valor', v })}>{v.corto || v.enunciado}</button>)}
            </div>
          ))}
          {!valores.length && <p className="tenue">Sin valores todavía.</p>}
        </div>
        {limites.length > 0 && (
          <details className="limites"><summary>Mis límites ({limites.length})</summary>{limites.map((v) => <button type="button" key={v.id} className="valor" onClick={() => setModal({ tipo: 'valor', v })}>{v.enunciado}</button>)}</details>
        )}
      </aside>
      <div className="hoja">
        <h2>Mis habilidades</h2>
        <p className="tenue">Elige un objetivo o un valor para ver qué habilidades exige. Las barras muestran tu nivel de 0 a 5.</p>
        <div className="leyenda"><span><span className="pip on" />Nivel con evidencia</span><span><span className="pip sus" />Sospechado sin evidencia</span><span><span className="pip req" />Nivel requerido</span></div>
        <div className="seg" role="tablist" aria-label="Ver habilidades por">
          {(['objetivos', 'valores', 'todas'] as const).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={foco.modo === m} onClick={() => setFoco({ modo: m, id: undefined })}>
              {m === 'objetivos' ? 'Objetivos' : m === 'valores' ? 'Valores' : 'Todas'} <small>{m === 'objetivos' ? objs.length : m === 'valores' ? valores.length : activas.length}</small>
            </button>
          ))}
        </div>
        {foco.modo === 'objetivos' && (
          <div className="fila entre">
            <div className="seg chico">
              <button type="button" aria-selected={estado !== 'logrado'} onClick={() => setFoco({ estado: 'activo', id: undefined })}>En curso <small>{objetivos.filter((o) => o.estado !== 'logrado').length}</small></button>
              <button type="button" aria-selected={estado === 'logrado'} onClick={() => setFoco({ estado: 'logrado', id: undefined })}>Logrados <small>{objetivos.filter((o) => o.estado === 'logrado').length}</small></button>
            </div>
            <button type="button" className="enlace" onClick={() => irAgregar({ tipo: 'objetivo' })}>+ Nuevo objetivo</button>
          </div>
        )}
        {foco.modo !== 'todas' && (
          <div className="chips">
            {items.map((i) => <button type="button" key={i.id} className="chip" aria-pressed={i.id === sel} onClick={() => setFoco({ id: i.id })}>{i.texto}<small>{deFuente(i.id).length} hab.</small></button>)}
          </div>
        )}
        {enfoque}
        {pausadas.length > 0 && (
          <details className="grupo pausadas">
            <summary>Habilidades en pausa ({pausadas.length})</summary>
            <p className="tenue">No están en tu plan ahora.</p>
            {pausadas.map((h) => (
              <div key={h.id} className="pausada"><b>{h.nombre}</b> · nivel {h.nivel ?? 'por evaluar'}{h.motivo_pausa && <> · Motivo: {h.motivo_pausa}</>} <button type="button" className="enlace" onClick={() => reactivarHabilidad(db, h.id)}>Reactivar</button></div>
            ))}
          </details>
        )}
      </div>
      {modal?.tipo === 'reto' && <ModalReto h={modal.h} onCerrar={() => setModal(null)} />}
      {modal?.tipo === 'evidencia' && <ModalEvidencia h={modal.h} onCerrar={() => setModal(null)} />}
      {modal?.tipo === 'autoevaluar' && <ModalAutoevaluar h={modal.h} onCerrar={() => setModal(null)} />}
      {modal?.tipo === 'logro' && <ModalLogro o={modal.o} habilidades={deFuente(modal.o.id)} onCerrar={() => setModal(null)} />}
      {modal?.tipo === 'valores-objetivo' && <ModalValoresObjetivo o={modal.o} valores={valores} onCerrar={() => setModal(null)} />}
      {modal?.tipo === 'valor' && <ModalEditarValor v={modal.v} onCerrar={() => setModal(null)} />}
      {modal?.tipo === 'avatar' && <ModalAvatar perfil={perfil} onCerrar={() => setModal(null)} />}
      <p className="sr-only" aria-live="polite">{p.xp} XP, racha de {p.racha} días</p>
    </div>
  )
}
