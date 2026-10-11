// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useCallback, useState } from 'react'
import type { SendaDB } from '../datos/db'
import { ErrorModelo } from '../modelos/adaptador'
import { adaptadorActual } from '../servicios/config-modelo'

export function mensajeError(e: unknown): string {
  if (e instanceof ErrorModelo) return e.message
  if (e instanceof Error) return e.message
  return 'Algo salió mal. Intenta de nuevo.'
}

/** Ejecuta una acción asíncrona con estado de carga y error. */
export function useAccion<A extends unknown[], R>(fn: (...a: A) => Promise<R>) {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ejecutar = useCallback(async (...a: A): Promise<R | undefined> => {
    setCargando(true)
    setError(null)
    try {
      return await fn(...a)
    } catch (e) {
      setError(mensajeError(e))
      return undefined
    } finally {
      setCargando(false)
    }
  }, [fn])
  return { ejecutar, cargando, error, setError }
}

/** Lee una imagen, la reduce y la devuelve en base64 JPEG (para evidencias y avatar). */
export async function leerImagen(archivo: File, lado: number, recortarCuadrado = false): Promise<{ tipo: string; base64: string; nombre: string }> {
  const url = await new Promise<string>((ok, mal) => {
    const fr = new FileReader()
    fr.onload = () => ok(String(fr.result))
    fr.onerror = () => mal(new Error('No se pudo leer el archivo.'))
    fr.readAsDataURL(archivo)
  })
  const img = await new Promise<HTMLImageElement>((ok, mal) => {
    const i = new Image()
    i.onload = () => ok(i)
    i.onerror = () => mal(new Error('No se pudo leer esa imagen. Prueba con un PNG o JPG.'))
    i.src = url
  })
  const c = document.createElement('canvas')
  let sx = 0, sy = 0, sw = img.width, sh = img.height
  if (recortarCuadrado) {
    const m = Math.min(img.width, img.height)
    sx = (img.width - m) / 2; sy = (img.height - m) / 2; sw = sh = m
  }
  const escala = Math.min(1, lado / Math.max(sw, sh))
  c.width = Math.round(sw * escala); c.height = Math.round(sh * escala)
  c.getContext('2d')!.drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height)
  return { tipo: 'image/jpeg', base64: c.toDataURL('image/jpeg', 0.85).split(',')[1], nombre: archivo.name }
}

/** Adaptador del modelo elegido, o un error que lleva a Ajustes. */
export async function exigirAdaptador(db: SendaDB) {
  const a = await adaptadorActual(db)
  if (!a) throw new Error('Primero configura tu modelo de IA en Ajustes (proveedor, modelo y clave).')
  return a
}
