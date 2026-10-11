// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

import { expect, test } from '@playwright/test'

test('la página carga sin errores ni violaciones de la política de seguridad', async ({ page }) => {
  const errores: string[] = []
  page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()) })
  page.on('pageerror', (e) => errores.push(e.message))

  await page.goto('./')

  await expect(page).toHaveTitle('Senda')
  await expect(page.getByRole('heading', { level: 1, name: 'Senda' })).toBeVisible()
  await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveCount(1)
  expect(errores).toEqual([])
})

test('no hay desplazamiento horizontal en pantallas angostas', async ({ page }) => {
  await page.goto('./')
  const desborde = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(desborde).toBeLessThanOrEqual(0)
})

test('sin confirmar la mayoría de edad no se puede empezar (P-007)', async ({ page }) => {
  await page.goto('./')
  await page.getByLabel('¿Cómo te llamas?').fill('Ana')
  await page.getByRole('button', { name: 'Empezar' }).click()
  await expect(page.getByRole('alert')).toContainText('mayores de 18')
})

test('es instalable y abre sin conexión', async ({ page, context }) => {
  await page.goto('./')
  const manifiesto = await page.locator('link[rel="manifest"]').getAttribute('href')
  const r = await page.request.get(new URL(manifiesto!, page.url()).href)
  expect(await r.json()).toMatchObject({ name: 'Senda', display: 'standalone' })

  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true))
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'Senda' })).toBeVisible()

  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'Senda' })).toBeVisible()
  await context.setOffline(false)
})
