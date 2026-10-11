// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useEffect, useState } from 'react'
import { convertirPrototipo } from '../datos/prototipo'
import { guardar } from '../datos/repositorio'
import { borrarTodo, exportar, importar, validarRespaldo } from '../datos/respaldo'
import { MODELOS_ANTHROPIC } from '../modelos/anthropic'
import { PROVEEDORES_COMPATIBLES } from '../modelos/openai'
import { guardarConfigModelo, tieneClave, borrarClaves, type ConfigModelo } from '../servicios/config-modelo'
import type { Perfil } from '../datos/esquemas'
import { Aviso } from './comun'
import { mensajeError } from './util'
import { useDB } from './contexto-db'

export function Ajustes({ perfil }: { perfil: Perfil }) {
  return (
    <div className="pila">
      <ConfigModelo perfil={perfil} />
      <PerfilForm perfil={perfil} />
      <MisDatos />
      <section className="tarjeta">
        <h2>Acerca de Senda</h2>
        <p>Senda es software libre (AGPL-3.0-or-later); la ontología y los textos usan CC BY-SA 4.0. Iniciativa de Omar y colaboradores: <a href="https://github.com/Omar8485/senda">github.com/Omar8485/senda</a>.</p>
        <p className="tenue">Senda no está afiliada a los proveedores de modelos de IA. No usa analítica ni rastreadores, y tus datos viven en este dispositivo.</p>
      </section>
    </div>
  )
}

function ConfigModelo({ perfil }: { perfil: Perfil }) {
  const db = useDB()
  const actual = perfil.modelo ?? { proveedor: 'anthropic' as const, modelo: MODELOS_ANTHROPIC[0].id }
  const [config, setConfig] = useState<ConfigModelo>(actual)
  const [clave, setClave] = useState('')
  const [hayClave, setHayClave] = useState(false)
  const [estado, setEstado] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  useEffect(() => { tieneClave(db, config).then(setHayClave) }, [db, config])

  const conocido = MODELOS_ANTHROPIC.some((m) => m.id === config.modelo)

  async function guardarTodo() {
    try {
      if (!config.modelo.trim()) throw new Error('Escribe el nombre del modelo.')
      if (config.proveedor === 'openai-compatible' && !/^https?:\/\//.test(config.base_url ?? '')) throw new Error('La dirección debe empezar con https:// (o http:// para un modelo en tu equipo).')
      await guardarConfigModelo(db, { ...config, modelo: config.modelo.trim() }, clave || undefined)
      setClave('')
      setHayClave(await tieneClave(db, config))
      setEstado({ tipo: 'ok', texto: 'Configuración guardada.' })
    } catch (e) {
      setEstado({ tipo: 'error', texto: mensajeError(e) })
    }
  }

  return (
    <section className="tarjeta" aria-labelledby="t-modelo">
      <h2 id="t-modelo">Modelo de IA</h2>
      <p className="tenue">Senda usa el modelo que elijas para analizar valores y objetivos, armar rutas y evaluar retos. Tú pones la clave: se guarda solo en este dispositivo y viaja únicamente al proveedor que elijas.</p>
      <div className="campo">
        <label htmlFor="prov">Proveedor</label>
        <select id="prov" value={config.proveedor} onChange={(e) => {
          const p = e.target.value as ConfigModelo['proveedor']
          setConfig(p === 'anthropic' ? { proveedor: p, modelo: MODELOS_ANTHROPIC[0].id } : { proveedor: p, modelo: '', base_url: PROVEEDORES_COMPATIBLES[0].base_url })
        }}>
          <option value="anthropic">Anthropic (Claude)</option>
          <option value="openai-compatible">Compatible con OpenAI (OpenAI, Gemini, OpenRouter, Ollama…)</option>
        </select>
      </div>
      {config.proveedor === 'anthropic' ? (
        <div className="campo">
          <label htmlFor="mod">Modelo</label>
          <select id="mod" value={conocido ? config.modelo : '_otro'} onChange={(e) => setConfig({ ...config, modelo: e.target.value === '_otro' ? '' : e.target.value })}>
            {MODELOS_ANTHROPIC.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            <option value="_otro">Otro (escribir)</option>
          </select>
          {!conocido && <input aria-label="Nombre del modelo" value={config.modelo} onChange={(e) => setConfig({ ...config, modelo: e.target.value })} placeholder="claude-…" />}
        </div>
      ) : (
        <>
          <div className="campo">
            <label htmlFor="url">Dirección del API</label>
            <input id="url" list="urls" value={config.base_url ?? ''} onChange={(e) => setConfig({ ...config, base_url: e.target.value })} />
            <datalist id="urls">{PROVEEDORES_COMPATIBLES.map((p) => <option key={p.base_url} value={p.base_url}>{p.nombre}</option>)}</datalist>
            <small>Los modelos en tu equipo (Ollama, LM Studio) deben permitir llamadas desde el navegador; en Ollama, con la variable OLLAMA_ORIGINS.</small>
          </div>
          <div className="campo">
            <label htmlFor="mod2">Modelo</label>
            <input id="mod2" value={config.modelo} onChange={(e) => setConfig({ ...config, modelo: e.target.value })} placeholder="nombre exacto del modelo" />
          </div>
        </>
      )}
      <div className="campo">
        <label htmlFor="clave">Clave de API {config.proveedor === 'openai-compatible' && <small>(opcional para modelos locales)</small>}</label>
        <input id="clave" type="password" autoComplete="off" value={clave} onChange={(e) => setClave(e.target.value)} placeholder={hayClave ? 'Guardada. Escribe otra para reemplazarla.' : 'Pega tu clave'} />
      </div>
      <div className="fila">
        <button type="button" className="btn primario" onClick={guardarTodo}>Guardar</button>
        {hayClave && <button type="button" className="btn fantasma" onClick={async () => { await borrarClaves(db); setHayClave(false); setEstado({ tipo: 'ok', texto: 'Claves borradas de este dispositivo.' }) }}>Borrar claves</button>}
      </div>
      {estado && <Aviso tipo={estado.tipo}>{estado.texto}</Aviso>}
      <Aviso>La calidad de los análisis y evaluaciones depende del modelo que elijas. Senda todavía no certificó modelos (llega en la fase B.2): úsalos como guía, no como certificación. Con algunos modelos, las evaluaciones pueden ser poco rigurosas.</Aviso>
    </section>
  )
}

function PerfilForm({ perfil }: { perfil: Perfil }) {
  const db = useDB()
  const [nombre, setNombre] = useState(perfil.nombre)
  const [minutos, setMinutos] = useState(perfil.minutos_dia)
  const [ok, setOk] = useState(false)
  return (
    <section className="tarjeta" aria-labelledby="t-perfil">
      <h2 id="t-perfil">Perfil</h2>
      <div className="campo"><label htmlFor="pn">Nombre</label><input id="pn" value={nombre} onChange={(e) => { setNombre(e.target.value); setOk(false) }} /></div>
      <div className="campo"><label htmlFor="pm">Minutos de práctica por día</label><input id="pm" type="number" min={10} max={240} value={minutos} onChange={(e) => { setMinutos(Number(e.target.value)); setOk(false) }} /></div>
      <button type="button" className="btn" onClick={async () => { await guardar(db, 'perfil', { ...perfil, nombre: nombre.trim() || perfil.nombre, minutos_dia: Math.max(10, Math.min(240, minutos || 60)) }); setOk(true) }}>Guardar perfil</button>
      {ok && <Aviso tipo="ok">Perfil guardado.</Aviso>}
    </section>
  )
}

function descargar(nombre: string, contenido: string) {
  const url = URL.createObjectURL(new Blob([contenido], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = nombre
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function MisDatos() {
  const db = useDB()
  const [estado, setEstado] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)
  const [armado, setArmado] = useState(false)
  return (
    <section className="tarjeta" aria-labelledby="t-datos">
      <h2 id="t-datos">Mis datos</h2>
      <p className="tenue">Todo lo que registras vive en este dispositivo. Exporta un respaldo seguido: si borras los datos del navegador, se pierden. El respaldo no incluye tus claves de API.</p>
      <div className="fila">
        <button type="button" className="btn" onClick={async () => {
          try {
            descargar(`senda-respaldo-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(await exportar(db), null, 2))
            setEstado({ tipo: 'ok', texto: 'Respaldo descargado.' })
          } catch (e) { setEstado({ tipo: 'error', texto: mensajeError(e) }) }
        }}>Exportar respaldo</button>
      </div>
      <ImportarDatos onListo={(t) => setEstado({ tipo: 'ok', texto: t })} onError={(t) => setEstado({ tipo: 'error', texto: t })} />
      <div className="fila">
        <button type="button" className="btn peligro" onClick={async () => {
          if (!armado) { setArmado(true); return }
          await borrarTodo(db)
          setArmado(false)
          setEstado({ tipo: 'ok', texto: 'Se borraron todos los datos de este dispositivo.' })
        }}>{armado ? 'Confirmar: borrar todo' : 'Borrar todos mis datos'}</button>
        {armado && <button type="button" className="btn fantasma" onClick={() => setArmado(false)}>Cancelar</button>}
      </div>
      {estado && <Aviso tipo={estado.tipo}>{estado.texto}</Aviso>}
    </section>
  )
}

/** Importa un respaldo de la v1 o la base exportada del prototipo de claude.ai. Reemplaza todo. */
export function ImportarDatos({ onListo, onError, nombre }: { onListo: (texto: string) => void; onError: (texto: string) => void; nombre?: string }) {
  const db = useDB()
  const [nombreProto, setNombreProto] = useState(nombre ?? '')
  async function leer(archivo: File, origen: 'respaldo' | 'prototipo') {
    try {
      const json = JSON.parse(await archivo.text())
      if (origen === 'prototipo') {
        if (!nombreProto.trim()) throw new Error('Escribe tu nombre: el prototipo no lo guardaba.')
        const r = convertirPrototipo(json, { nombre: nombreProto.trim() })
        await importar(db, r)
        onListo(`Datos del prototipo importados: ${r.datos.valores.length} valores, ${r.datos.objetivos.length} objetivos y ${r.datos.habilidades.length} habilidades.`)
      } else {
        const { errores } = validarRespaldo(json)
        if (errores.length) throw new Error(`El archivo no es un respaldo válido de Senda: ${errores[0]}`)
        const r = await importar(db, json)
        if (!r.ok) throw new Error(r.errores.join('; '))
        onListo('Respaldo importado.')
      }
    } catch (e) {
      onError(e instanceof SyntaxError ? 'El archivo no es un JSON válido.' : mensajeError(e))
    }
  }
  return (
    <details className="importar">
      <summary>Importar datos (reemplaza lo que hay en este dispositivo)</summary>
      <div className="campo">
        <label htmlFor="imp-resp">Respaldo de Senda (.json)</label>
        <input id="imp-resp" type="file" accept="application/json,.json" onChange={(e) => { const f = e.target.files?.[0]; if (f) leer(f, 'respaldo'); e.target.value = '' }} />
      </div>
      <div className="campo">
        <label htmlFor="imp-proto">Datos del prototipo de claude.ai (.json)</label>
        <input aria-label="Tu nombre" value={nombreProto} onChange={(e) => setNombreProto(e.target.value)} placeholder="Tu nombre" />
        <input id="imp-proto" type="file" accept="application/json,.json" onChange={(e) => { const f = e.target.files?.[0]; if (f) leer(f, 'prototipo'); e.target.value = '' }} />
        <small>La racha vuelve a empezar: el prototipo no guardaba el historial de práctica, solo el total de XP, que sí se conserva.</small>
      </div>
    </details>
  )
}
