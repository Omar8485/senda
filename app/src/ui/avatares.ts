// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

export const AVATARES = {
  a1: { nombre: 'Clásico', camisa: 'var(--accent)' },
  a2: { nombre: 'Barba y lentes', camisa: 'var(--plum)' },
  a3: { nombre: 'Rizos', camisa: 'var(--ochre)' },
} as const
export type ClaveAvatar = keyof typeof AVATARES
