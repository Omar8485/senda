// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// Service worker mínimo: la app abre sin conexión. Las páginas van primero a la red (para recibir
// actualizaciones) y caen a la copia guardada; los archivos propios, que llevan un hash en el
// nombre, se sirven de la copia guardada. Las llamadas a otros orígenes (proveedores de IA)
// nunca se guardan ni se interceptan.

const CACHE = 'senda-v1'
const BASE = new URL('./', self.location).href

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([BASE, `${BASE}manifest.webmanifest`, `${BASE}icono.svg`])))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('senda-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  const url = new URL(req.url)
  if (req.method !== 'GET' || url.origin !== self.location.origin) return

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((r) => {
          const copia = r.clone()
          caches.open(CACHE).then((c) => c.put(BASE, copia))
          return r
        })
        .catch(() => caches.match(BASE)),
    )
    return
  }

  e.respondWith(
    caches.match(req).then((guardada) => guardada ?? fetch(req).then((r) => {
      if (r.ok) {
        const copia = r.clone()
        caches.open(CACHE).then((c) => c.put(req, copia))
      }
      return r
    })),
  )
})
