# Senda · app (v1 en construcción)

Aplicación web de Senda: React + TypeScript + Vite, local primero y sin backend. La arquitectura completa está en [`docs/arquitectura.md`](../docs/arquitectura.md).

## Estructura

| Ruta | Qué es |
|---|---|
| `src/nucleo/` | El método en TypeScript puro, sin React: topes de nivel por evidencia (regla 02), confianza, retos (D-009), XP, racha y reglas de logro. Aquí vive el rigor, y cada regla tiene pruebas. |
| `src/datos/` | Modelo de datos (Zod), base local IndexedDB (Dexie), repositorio con escritura validada, respaldo JSON e importador del prototipo. |
| `src/modelos/` | Capa de IA: carga los prompts de `/prompts`, adaptadores Anthropic y OpenAI-compatible, y `generarJSON` (valida, reintenta y firma). |
| `src/servicios/` | Acciones de la app: juntan modelo (propone), núcleo (decide) y datos. Configuración del modelo y la clave local. |
| `src/ui/` | Pantallas y modales de React. Solo llaman a `servicios/`. |
| `public/` | Manifiesto, iconos y service worker de la app instalable. |
| `e2e/` | Pruebas de interfaz con Playwright (escritorio y móvil), con el modelo simulado. |
| `scripts/` | `generar-iconos.mjs`: crea los PNG desde `public/icono.svg`. |

La bitácora de construcción, las decisiones y los pendientes están en [`docs/construccion-v1.md`](../docs/construccion-v1.md).

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

- El modelo de IA **propone**; el núcleo **decide** qué nivel se registra. La interfaz nunca escribe un nivel directamente: pasa por `servicios/acciones.ts`.
- El XP no toca el nivel de ninguna habilidad (D-009): `xp.ts` no importa nada de `niveles.ts`.
- Un cambio en una regla del método empieza como decisión en `decisiones/registro.md`, no en el código.

## Seguridad

- Las claves de API se guardan en la tabla local `secretos`. Nunca van al respaldo ni a ningún servidor del proyecto (no hay ninguno).
- La compilación lleva una política de seguridad de contenido sin scripts de terceros. `connect-src` admite HTTPS y `localhost`, porque cada persona elige su proveedor de IA.
- Datos de prueba siempre inventados (`src/datos/ejemplos/`).

## Despliegue

Cada push a `main` publica la app en GitHub Pages (`.github/workflows/pages.yml`). La compilación usa rutas relativas, así que sirve igual en `omar8485.github.io/senda/` que en la raíz de un dominio.
