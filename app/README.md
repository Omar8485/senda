# Senda · app (v1 en construcción)

Aplicación web de Senda: React + TypeScript + Vite, local primero y sin backend. La arquitectura completa está en [`docs/arquitectura.md`](../docs/arquitectura.md).

## Estructura

| Ruta | Qué es |
|---|---|
| `src/nucleo/` | El método en TypeScript puro, sin React: topes de nivel por evidencia (regla 02), retos (D-009), XP y racha. Aquí vive el rigor; cada regla tiene pruebas. |
| `src/i18n/` | Textos de la interfaz por idioma (`es.json` primero). |
| `src/App.tsx` | Interfaz (por ahora, una página de inicio). |
| `e2e/` | Pruebas de interfaz con Playwright (escritorio y móvil). |

Llegarán en la fase B.1: `src/datos/` (IndexedDB), `src/modelos/` (adaptadores de IA), `src/ui/` y la app instalable (PWA).

## Comandos

Requiere Node 22.12 o superior.

```
npm ci              # instala dependencias
npm run dev         # servidor de desarrollo
npm run check       # lint + tipos + pruebas del núcleo (lo mismo que exige la CI)
npm run build       # compila a dist/
npm run test:e2e    # pruebas de interfaz sobre la compilación (antes: npm run build)
```

Las pruebas de interfaz descargan Chromium con `npx playwright install chromium`. Si ya tienes uno, indícalo con `PW_CHROMIUM_PATH=/ruta/a/chrome`.

## Reglas del núcleo

- El modelo de IA **propone**; el núcleo **decide** qué nivel se registra.
- El XP no toca el nivel de ninguna habilidad (D-009): `xp.ts` no importa nada de `niveles.ts`.
- Un cambio en una regla del método empieza como decisión en `decisiones/registro.md`, no en el código.

## Despliegue

Cada push a `main` publica la app en GitHub Pages (`.github/workflows/pages.yml`). La compilación usa rutas relativas, así que sirve igual en `omar8485.github.io/senda/` que en la raíz de un dominio.
