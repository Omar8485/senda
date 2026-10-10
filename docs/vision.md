# Senda: visión y decisiones de producto

> Versión 0.2 · 2026-10-10 · Las decisiones de esta página las tomó Omar. Las marcadas como **propuesta** esperan su confirmación.
> Complementa `docs/viabilidad.md`. Varios puntos de ese análisis cambian con estas decisiones (ver la sección "Qué cambia").

## Visión

Senda es un **bien común digital**: una aplicación libre y gratuita para que cualquier persona entienda qué sabe hacer, qué podría aprender y qué le conviene desarrollar, conectada con sus valores y objetivos. Además, permite que otras personas vean ese camino, lo animen, lo copien o se sumen a él.

Omar es el **autor de la iniciativa**. El proyecto queda abierto a colaboradores, desarrolladores y a cualquiera que quiera usarlo, copiarlo o mejorarlo.

## Decisiones de producto

| Id | Decisión | Estado |
|---|---|---|
| P-001 | **Código abierto y uso libre y gratuito.** No se cobra por usar Senda. Se aceptan contribuciones externas. Si alguien la replica o crea algo mejor, bienvenido. | Decidida por Omar |
| P-002 | **Dominio `.org`.** Senda es una iniciativa, no una empresa. No hace falta para funcionar: la v1 vive gratis en GitHub Pages (`omar8485.github.io/senda`). El `.org` se compra al lanzar al público. | Decidida (compra diferida) |
| P-003 | **Funciona con el modelo de IA que el usuario elija, incluidos modelos locales.** Se avisa de forma explícita que la calidad y la veracidad dependen del modelo elegido y del usuario. | Decidida por Omar |
| P-004 | **Los datos viven en la nube por defecto, para no perderse.** También se puede usar en modo solo local, y la cuenta en la nube es necesaria para tener amigos y seguidores. | Decidida por Omar |
| P-005 | **Capa social.** Cada persona puede tener seguidores, recibir reacciones de ánimo ("me encanta", "sigue adelante") sobre sus objetivos, habilidades y valores, ser invitada a un proyecto o a un trabajo, y dejar que otros copien su ruta de habilidades. | Decidida por Omar (forma concreta: propuesta abajo) |
| P-006 | **Prioridad personal.** Omar le da prioridad a Senda por ahora. | Decidida por Omar |
| P-007 | **Público de la v1:** abierta al público general, pero con un caso de uso de entrada concreto (ver recomendación). | Propuesta |
| P-008 | **Licencias:** código bajo **AGPL-3.0-or-later**; ontología, catálogo y textos bajo **CC BY-SA 4.0**; contribuciones con DCO. | **Decidida** por Omar (2026-10-10) |
| P-009 | **Separar los datos personales de Omar** (`perfil/`, `datos/senda-db/`) del repositorio público. | **Hecha** (2026-10-10): los datos están en `Omar8485/senda-omar` (privado) y el historial de `senda` se reescribió sin ellos, con autorización de Omar. |
| P-010 | **Registrar la marca "Senda"** a nombre de Omar en el SENADI. | Propuesta |
| P-011 | **Costo cero para el proyecto.** Senda debe funcionar sin que nadie pague un servidor: app estática, datos en el dispositivo más la nube propia del usuario, IA del usuario y una capa social sobre un protocolo abierto. Un servidor propio solo se agrega si hay fondos, y siempre como opción. | Propuesta |

## Qué cambia frente a `viabilidad.md`

- **Ya no hay modelo de negocio que validar**, pero sí hay **costos que cubrir**: servidor, base de datos, dominio y moderación. Como el usuario trae su propio modelo, la IA no le cuesta nada al proyecto. Para la nube y lo social, las opciones son una capa gratuita, donaciones (GitHub Sponsors, Open Collective) o que cada comunidad aloje su propia instancia.
- **"Que te copien" deja de ser riesgo y pasa a ser objetivo.** Eso sí: la licencia decide qué pueden hacer con las copias.
- **La autoría se protege distinto:**
  - las **ideas** no tienen derechos de autor;
  - el **código y los textos** tienen derechos de autor, pero la parte generada solo por IA puede no tenerlos en algunas jurisdicciones (por ejemplo, la postura de la Oficina de Derechos de Autor de EE. UU.);
  - lo que Omar sí puede asegurar como suyo es la **marca** "Senda" y la **autoría reconocida** en el repositorio, la licencia y la web.

## Una precisión sobre el mérito

El modelo de IA ejecuta: clasifica, propone y evalúa. Pero el método lo diseñó Omar, decisión por decisión: separar el XP del nivel, que los niveles solo suban con evidencia, aterrizar los valores en situaciones, no permitir un logro sin evidencia, etc. Ese método es lo que vuelve útil a Senda con cualquier modelo. Por eso la frase dinámica conviene así: **"{nombre} entrena con Senda · coach: {modelo}"**.

## Recomendaciones

### P-007: ¿Para quién es la v1?

**Abierta al público general**, como quiere Omar, con tres condiciones:

1. **Una puerta de entrada concreta.** Empezar por los valores es potente, pero pesado para un desconocido: Omar mismo lo vivió ("es un poco pesado"). La v1 entra por **"quiero lograr X"**: un objetivo con fecha (aprender un idioma, sacar una certificación, ser puntual). De ahí salen las habilidades, la ruta, los retos y la evidencia. Los valores se invitan después, cuando la persona ya sintió el valor de la app.
2. **Español primero, con idiomas preparados desde el día uno** (textos en archivos de traducción). El catálogo y la ontología ya están en español.
3. **Solo mayores de 18 años en la v1.** Una red social pública con menores exige protecciones adicionales (contacto entre desconocidos, datos sensibles, consentimiento de los padres). Se puede abrir después, con un diseño específico.

Antes del lanzamiento público: **una beta de 4 semanas con 10 a 20 personas** para cazar errores, problemas de privacidad y confusiones. Es la misma lógica de evidencia que Senda pide a sus usuarios.

### P-005: La capa social, aterrizada

| Acción | Qué significa | Cuidado |
|---|---|---|
| **Seguir** | Ver el camino público de alguien | Seguir no da acceso a lo privado |
| **Reacciones** de ánimo | "Me encanta", "¡Sigue!", "Yo también" sobre un objetivo, una habilidad o un logro | Sin contador público al principio, para no repetir la carrera de likes. Que lo vea solo el dueño. |
| **Copiar una senda** | Clonar la ruta de habilidades de alguien para un objetivo parecido (como hacer *fork*) | Se copia la estructura, nunca la evidencia ni los niveles |
| **Invitar** | A un proyecto o a un trabajo, por las habilidades verificadas | Contacto solo si la persona lo permite. Botón de reportar. |
| **Ayudar** | Ofrecer ayuda en un objetivo concreto | Dentro del objetivo, no por mensajes privados abiertos |

**Regla base:** todo es privado por defecto. La persona elige qué publicar, ítem por ítem. Los valores sobre pareja, familia y crianza nunca se publican de forma automática.

**Nivel verificado:** en un perfil público, cada nivel muestra cómo se obtuvo (reto, evidencia externa o autodeclarado) y qué modelo lo evaluó. Así lo social no infla los niveles.

### P-004: Nube y modo local

Arquitectura **local primero, con sincronización opcional**:
- La app funciona completa sin cuenta y guarda los datos en el dispositivo.
- Al crear una cuenta, los datos se sincronizan a la nube y se habilitan amigos y seguidores.
- Siempre se puede exportar todo a JSON: los datos son del usuario.

Ver P-011 más abajo: por defecto **sin servidor del proyecto**. La "nube" es la del propio usuario; Supabase queda como opción si algún día hay fondos.

### P-008: Licencia del código: GPL-3.0 frente a AGPL-3.0

Las dos son libres y obligan a que quien **distribuya** una versión modificada publique su código. Se diferencian en un caso:

- **GPL-3.0:** si alguien modifica Senda y la ofrece **como servicio en su servidor**, sin entregar el programa, no está obligado a publicar sus cambios. Esa es la vía por la que una empresa podría "cerrar" una versión mejorada.
- **AGPL-3.0:** cierra esa vía. Ofrecerla como servicio en red también obliga a publicar el código.

Como la v1 es una app que corre en el navegador (el código se entrega al usuario), la GPL-3.0 ya cubre gran parte. Si algún día existe un servidor de Senda (sincronización, búsqueda o índice social), solo la AGPL lo protege. Para colaborar sin ceder derechos se usará **DCO** (cada commit lleva "Signed-off-by").

## Costos: ¿quién paga si no hay donaciones?

**Respuesta corta: nadie, si se diseña bien.** Lo que cuesta dinero son los **servidores que el proyecto mantiene encendidos**. Si Senda no depende de ninguno, no hay factura.

| Pieza | Diseño de costo cero | Costo para el proyecto |
|---|---|---|
| La app | Archivos estáticos (HTML, JS) en GitHub Pages o Cloudflare Pages, gratis para proyectos así | 0 |
| Los datos privados | En el dispositivo (base del navegador o app de escritorio) + exportación a JSON + sincronización opcional con **la nube del propio usuario** (Google Drive, Dropbox, OneDrive, WebDAV). Cada usuario usa su propio espacio, no el del proyecto. | 0 |
| La IA | La pone el usuario: su clave de API o su modelo local | 0 |
| Lo social (fase D) | Sobre **AT Protocol**, el protocolo abierto de Bluesky. Cada persona inicia sesión con su cuenta, y lo que decide publicar (objetivos, logros, habilidades verificadas) se guarda como registros en **su propio servidor de datos**. Los seguidores y las reacciones viajan por la red. | 0 al principio |
| Dominio `.org` | Opcional, al lanzar | Pago anual pequeño (unos USD 10–20 según el registrador) |

**Los límites honestos de esta opción:**
1. **Lo publicado en AT Protocol es público.** Su extensión para datos privados ("Spaces") abrió en alfa el 20 de agosto de 2026 y no se recomienda aún para producción. Por eso lo privado (valores de pareja y familia, evidencias) se queda en el dispositivo o en la nube del usuario, y solo se publica lo que la persona elige.
2. **Descubrir gente** (buscar perfiles, ver qué es tendencia) requiere, a escala, un servicio que indexe la red, y eso sí es un servidor. Al principio basta con ver a quienes sigues, leyendo directamente sus datos. El índice se agrega solo si hay comunidad y fondos.
3. **Sincronizar con la nube del usuario** es un poco menos cómodo que "crear cuenta y listo". Es el precio de no depender de nadie.

**Si algún día se quiere un servidor propio** (más cómodo para cuentas y sincronización): Supabase tiene un plan gratuito (según una fuente secundaria de mayo de 2026: 500 MB de base, 50.000 usuarios activos al mes, pausa tras una semana sin uso) y un plan de pago de unos USD 25 al mes. Con el diseño de costo cero, ese servidor es una mejora y no una dependencia: si se apaga por falta de fondos, la app sigue funcionando y nadie pierde datos.

**Fondos posibles, sin obligación:** GitHub Sponsors u Open Collective para donaciones transparentes, y convocatorias para software libre como NLnet / NGI Zero. NLnet acepta proponentes fuera de Europa solo con proyectos excepcionales, y da prioridad a la UE.

**Regla de diseño (P-011): Omar nunca debe quedar obligado a pagar para que Senda siga viva.**

## Próximos pasos

| # | Paso | Quién |
|---|---|---|
| 1 | ~~Licencia~~ Hecho: AGPL-3.0-or-later + CC BY-SA 4.0 | ✔ |
| 2 | ~~Repositorio privado para los datos personales~~ Hecho: `senda-omar` | ✔ |
| 3 | ~~Repo limpio~~ Hecho: historial sin datos personales, `LICENSE`, `LICENSE-CONTENIDO.md`, `CONTRIBUTING.md` (DCO), `CODE_OF_CONDUCT.md` | ✔ (falta un correo de contacto para reportes) |
| 4 | Documento de arquitectura v1 con costo cero: app estática, local primero, sincronización con la nube del usuario, adaptadores de modelos, banco de pruebas de modelos, capa social sobre AT Protocol | Claude, Omar revisa |
| 5 | Construir la v1 (PWA) tomando `sistema/senda.html` como especificación funcional | Claude + colaboradores |
| 6 | Beta de 4 semanas con 10 a 20 personas | Omar invita, Claude analiza |
| 7 | Registrar la marca "Senda" en el SENADI | Omar |
| 8 | Hacer público el repositorio y lanzar | Omar |

## Fuentes

- [Supabase: límites del plan gratuito 2026 (Automation Atlas)](https://automationatlas.io/answers/supabase-free-tier-limits-2026/)
- [Cloudflare Pages: límites de la plataforma](https://developers.cloudflare.com/pages/platform/limits)
- [AT Protocol: alfa de Spaces (datos no públicos)](https://atproto.com/blog/atproto-spaces-alpha)
- [Más allá del microblogging: AT Protocol para apps sociales (Boris Mann)](https://bmannconsulting.com/notes/beyond-microblogging-atproto/)
- [NLnet: elegibilidad](https://nlnet.nl/PET/eligibility/)
