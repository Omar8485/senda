// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Perfil } from '../../datos/esquemas'
import { guardar } from '../../datos/repositorio'
import { AvatarSVG } from '../Avatar'
import { AVATARES, type ClaveAvatar } from '../avatares'
import { Aviso, Modal } from '../comun'
import { leerImagen, useAccion } from '../util'
import { useDB } from '../contexto-db'

export function ModalAvatar({ perfil, onCerrar }: { perfil: Perfil; onCerrar: () => void }) {
  const db = useDB()
  const elegir = useAccion(async (cambios: Partial<Perfil>) => { await guardar(db, 'perfil', { ...perfil, ...cambios }); onCerrar() })
  return (
    <Modal etiqueta="Personaje" titulo="Elige tu avatar" onCerrar={onCerrar}>
      <div className="avatares">
        {(Object.keys(AVATARES) as ClaveAvatar[]).map((k) => (
          <button key={k} type="button" className="avatar-opcion" aria-pressed={perfil.avatar === k} onClick={() => elegir.ejecutar({ avatar: k })}>
            <AvatarSVG clave={k} className="mini" /><span>{AVATARES[k].nombre}</span>
          </button>
        ))}
      </div>
      <div className="campo">
        <label htmlFor="avf">O sube una imagen</label>
        <input id="avf" type="file" accept="image/*" onChange={async (e) => {
          const f = e.target.files?.[0]
          if (!f) return
          const img = await leerImagen(f, 256, true).catch(() => null)
          if (img) elegir.ejecutar({ avatar: 'foto', avatar_img: `data:image/jpeg;base64,${img.base64}` })
          else elegir.setError('No se pudo leer esa imagen.')
        }} />
        <small>Se recorta en cuadrado, se reduce a 256 px y se guarda solo en este dispositivo.</small>
      </div>
      {perfil.avatar_img && <button type="button" className="btn fantasma" onClick={() => elegir.ejecutar({ avatar: 'a1', avatar_img: undefined })}>Quitar foto</button>}
      {elegir.error && <Aviso tipo="error">{elegir.error}</Aviso>}
    </Modal>
  )
}
