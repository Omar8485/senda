// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { abrirDB } from './datos/db'
import { ProveedorDB } from './ui/contexto'

const db = abrirDB()
// Pide al navegador que no borre los datos por falta de espacio (si lo permite).
navigator.storage?.persist?.().catch(() => {})

// App instalable y sin conexión (solo en la compilación; en desarrollo estorbaría a la recarga).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => {}) })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProveedorDB db={db}>
      <App />
    </ProveedorDB>
  </StrictMode>,
)
