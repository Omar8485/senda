// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { t } from './i18n'

export default function App() {
  return (
    <main className="app">
      <h1 className="marca">{t('app.nombre')}</h1>
      <p className="lema">{t('inicio.lema')}</p>
      <section className="tarjeta">
        <p>{t('inicio.estado')}</p>
        <p className="tenue">{t('inicio.prototipo')}</p>
        <a href="https://github.com/Omar8485/senda">{t('inicio.repositorio')}</a>
      </section>
    </main>
  )
}
