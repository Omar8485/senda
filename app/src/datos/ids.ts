// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

/** Kebab-case sin tildes ni eñes, como los identificadores del modelo (CONTRIBUTING.md, convenciones). */
export function slug(texto: string, max = 60): string {
  const s = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, max)
    .replace(/-$/, '')
  return s || 'x'
}

/** Identificador con prefijo (val-, obj-, hab-…) que no choca con los existentes. */
export function idNuevo(prefijo: string, texto: string, existe: (id: string) => boolean): string {
  const raiz = `${prefijo}-${slug(texto)}`
  if (!existe(raiz)) return raiz
  for (let i = 2; ; i++) {
    const id = `${raiz}-${i}`
    if (!existe(id)) return id
  }
}

/** Identificador opaco para registros que se agregan en serie (evidencias, eventos de XP). */
export function idSerie(prefijo: string): string {
  return `${prefijo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/** Fecha local de hoy en ISO (AAAA-MM-DD). */
export function hoy(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
