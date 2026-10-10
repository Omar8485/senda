// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Textos de la interfaz. Cada idioma es un JSON con las mismas claves que es.json.

import es from './es.json'

export type Clave = keyof typeof es

export function t(clave: Clave): string {
  return es[clave]
}
