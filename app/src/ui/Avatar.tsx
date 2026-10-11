// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Avatares del prototipo (sistema/senda.html), como componentes.

import type { Perfil } from '../datos/esquemas'
import { AVATARES, type ClaveAvatar } from './avatares'

export function AvatarSVG({ clave, className = 'avatar' }: { clave: ClaveAvatar; className?: string }) {
  const a = AVATARES[clave]
  return (
    <svg className={className} viewBox="0 0 200 240" role="img" aria-label={`Avatar ${a.nombre}`}>
      <ellipse cx="100" cy="228" rx="62" ry="8" fill="var(--line)" />
      <path d="M40 228c4-52 28-78 60-78s56 26 60 78z" fill={a.camisa} />
      <path d="M84 150h32v14c0 9-7 16-16 16s-16-7-16-16z" fill="var(--skin)" />
      <circle cx="100" cy="98" r="44" fill="var(--skin)" />
      {clave === 'a1' && <path d="M56 92c0-30 20-46 44-46s44 16 44 44c-10-10-24-16-44-16-18 0-32 6-44 18z" fill="var(--hair)" />}
      {clave === 'a2' && (
        <>
          <path d="M58 88c2-26 20-40 42-40s40 14 42 40c-8-6-22-12-42-12s-34 6-42 12z" fill="var(--hair)" />
          <path d="M64 108c4 30 18 42 36 42s32-12 36-42c-6 12-18 18-36 18s-30-6-36-18z" fill="var(--hair)" />
        </>
      )}
      {clave === 'a3' && (
        <g fill="var(--hair)">
          <circle cx="66" cy="78" r="16" /><circle cx="84" cy="62" r="17" /><circle cx="104" cy="56" r="18" />
          <circle cx="124" cy="64" r="17" /><circle cx="138" cy="82" r="14" /><circle cx="60" cy="96" r="10" /><circle cx="142" cy="98" r="10" />
        </g>
      )}
      <circle cx="84" cy="102" r="4" fill="var(--hair)" /><circle cx="116" cy="102" r="4" fill="var(--hair)" />
      <path d="M88 122c7 6 17 6 24 0" stroke="var(--hair)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {clave === 'a2' && (
        <>
          <circle cx="84" cy="101" r="10" fill="none" stroke="var(--ink)" strokeWidth="3" />
          <circle cx="116" cy="101" r="10" fill="none" stroke="var(--ink)" strokeWidth="3" />
          <path d="M94 101h12" stroke="var(--ink)" strokeWidth="3" />
        </>
      )}
    </svg>
  )
}

export function AvatarPerfil({ perfil, className }: { perfil: Perfil; className?: string }) {
  if (perfil.avatar === 'foto' && perfil.avatar_img) {
    return <img className={`${className ?? 'avatar'} foto`} src={perfil.avatar_img} alt="Tu foto" />
  }
  return <AvatarSVG clave={perfil.avatar === 'foto' ? 'a1' : perfil.avatar} className={className} />
}
