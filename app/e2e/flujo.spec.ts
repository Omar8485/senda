// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Recorrido completo con el modelo simulado: ninguna petición sale a internet.

import { expect, test, type Page, type Route } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const aqui = path.dirname(fileURLToPath(import.meta.url))

const RESPUESTAS: [RegExp, unknown][] = [
  [/elige vivir/, {
    clasificacion: 'valor', explicacion: 'Describe cómo quieres actuar.', enunciado: 'Cumplir a tiempo lo que comprometo', corto: 'Cumplir a tiempo',
    contextos: [{ situacion: 'Entregas del trabajo', habilidades: [
      { id: 'hab-estimar-tiempos', nombre: 'Estimar tiempos de tareas', tipo: 'cognitiva', clase: 'indispensable', nivel_minimo: 3, por_que: 'Para planificar' },
    ] }],
  }],
  [/ruta de práctica/, {
    titulo: 'Dos semanas para cumplir a tiempo', descripcion: 'Ruta de prueba',
    unidades: [{ titulo: 'Semana 1: medir', nodos: [
      { tipo: 'sesion', titulo: 'Autoevaluación inicial', tareas: [{ texto: 'Anotar tres entregas', min: 15 }, { texto: 'Estimar cada una', min: 10 }], habilidades: ['hab-estimar-tiempos'] },
      { tipo: 'reto', titulo: 'Reto de la semana', tareas: [], habilidades: ['hab-estimar-tiempos'] },
    ] }],
  }],
  [/Prepara UN reto/, { titulo: 'Plan de la semana', instrucciones: 'Estima cuánto te tomará cada tarea.', material: '', criterios: ['realista', 'completo', 'justificado'], verificable_por_texto: true }],
  [/Evalúa con rigor la respuesta/, { aprobado: true, puntaje: 85, nivel_demostrado: 4, fortalezas: 'Estimaciones realistas.', mejorar: 'Agrega márgenes.' }],
]

/** Responde como el API de mensajes de Anthropic, según la tarea que pide el prompt. */
async function modeloSimulado(page: Page) {
  const pedidos: string[] = []
  await page.route('https://api.anthropic.com/**', async (route: Route) => {
    const cuerpo = route.request().postDataJSON() as { messages: { content: { type: string; text?: string }[] }[] }
    const texto = cuerpo.messages[0].content.map((c) => c.text ?? '').join('')
    pedidos.push(texto)
    const r = RESPUESTAS.find(([re]) => re.test(texto))
    await route.fulfill({
      status: r ? 200 : 500,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
      body: JSON.stringify({
        id: 'msg_prueba', type: 'message', role: 'assistant', model: 'claude-opus-5-5',
        content: [{ type: 'text', text: JSON.stringify(r?.[1] ?? {}) }], stop_reason: 'end_turn', stop_sequence: null,
        usage: { input_tokens: 1, output_tokens: 1 },
      }),
    })
  })
  return pedidos
}

async function empezar(page: Page) {
  await page.goto('./')
  await page.getByLabel('¿Cómo te llamas?').fill('Ana')
  await page.getByLabel('Tengo 18 años o más').check()
  await page.getByRole('button', { name: 'Empezar' }).click()
  await expect(page.locator('.nombre')).toHaveText('Ana')
}

test('recorrido: modelo, valor, ruta, sesión y reto', async ({ page }) => {
  const errores: string[] = []
  page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()) })
  page.on('pageerror', (e) => errores.push(e.message))
  const pedidos = await modeloSimulado(page)
  await empezar(page)

  // Configurar el modelo
  await page.getByRole('navigation').getByRole('button', { name: 'Ajustes' }).click()
  await page.getByLabel('Clave de API').fill('clave-de-prueba')
  await page.getByRole('button', { name: 'Guardar', exact: true }).click()
  await expect(page.getByText('Configuración guardada.')).toBeVisible()

  // Agregar un valor
  await page.getByRole('navigation').getByRole('button', { name: 'Agregar' }).click()
  await page.getByLabel('¿Qué eliges vivir?').fill('Quiero cumplir siempre a tiempo')
  await page.getByRole('button', { name: 'Analizar' }).click()
  await expect(page.getByText('Clasificación: valor')).toBeVisible()
  await expect(page.getByText(/Generado por claude-opus-5-5/)).toBeVisible()
  await page.getByRole('button', { name: 'Aceptar y crear habilidades' }).click()
  await expect(page.getByRole('heading', { name: 'Valor registrado' })).toBeVisible()

  // Generar la ruta y completar la primera sesión
  await page.getByRole('button', { name: 'Generar mi ruta' }).click()
  await page.getByRole('button', { name: 'Ver mi ruta' }).click()
  await page.getByRole('button', { name: /Autoevaluación inicial \(siguiente\)/ }).click()
  await page.getByRole('checkbox', { name: /Anotar tres entregas/ }).check()
  await page.getByRole('checkbox', { name: /Estimar cada una/ }).check()
  await page.getByRole('button', { name: 'Completar sesión' }).click()
  await expect(page.locator('.stat').first()).toContainText('25')

  // El nodo de reto sube el nivel como máximo un punto (D-009)
  await page.getByRole('button', { name: /Reto de la semana \(siguiente\)/ }).click()
  await page.getByRole('button', { name: 'Preparar reto' }).click()
  await page.getByLabel('Tu respuesta').fill('Tarea A: 2 h, tarea B: 30 min, con margen del 20 %.')
  await page.getByRole('button', { name: 'Enviar para evaluar' }).click()
  await expect(page.getByText('Tu nivel sube a')).toBeVisible()
  await expect(page.locator('.aviso.ok b')).toHaveText('1')
  await page.getByRole('button', { name: 'Cerrar', exact: true }).last().click()
  await expect(page.locator('.stat').first()).toContainText('75')

  // En Inicio, la habilidad muestra el nivel con evidencia
  await page.getByRole('navigation').getByRole('button', { name: 'Inicio' }).click()
  await page.getByRole('tab', { name: /Todas/ }).click()
  await expect(page.getByText('Nivel 1 · confianza media')).toBeVisible()

  // El prompt usa el nombre del perfil, y la clave nunca va en el cuerpo
  expect(pedidos.some((p) => p.includes('Ana'))).toBe(true)
  expect(pedidos.join('')).not.toContain('clave-de-prueba')
  expect(errores).toEqual([])
})

test('importar datos del prototipo y exportar un respaldo', async ({ page }) => {
  await page.goto('./')
  await page.getByText('Importar datos (reemplaza lo que hay en este dispositivo)').click()
  await page.getByLabel('Tu nombre').fill('Ana')
  await page.getByLabel('Datos del prototipo de claude.ai (.json)').setInputFiles(path.join(aqui, '../src/datos/ejemplos/prototipo-inventado.json'))
  // Un perfil importado confirma la mayoría de edad antes de entrar
  await expect(page.getByText('Tus datos ya están en este dispositivo.', { exact: false })).toBeVisible()
  await expect(page.getByLabel('¿Cómo te llamas?')).toHaveValue('Ana')
  await page.getByLabel('Tengo 18 años o más').check()
  await page.getByRole('button', { name: 'Empezar' }).click()
  await expect(page.locator('.nombre')).toHaveText('Ana')
  await expect(page.locator('.stat').first()).toContainText('320')
  await expect(page.getByRole('button', { name: 'Cumplir a tiempo' }).first()).toBeVisible()

  await page.getByRole('navigation').getByRole('button', { name: 'Ajustes' }).click()
  const descarga = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Exportar respaldo' }).click()
  const archivo = await descarga
  expect(archivo.suggestedFilename()).toMatch(/^senda-respaldo-\d{4}-\d{2}-\d{2}\.json$/)
})
