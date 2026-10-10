# Senda: ideas aterrizadas y viabilidad

> Versión 0.1 · 2026-10-10 · Preparado por Claude a pedido de Omar. No es asesoría legal ni financiera: los puntos legales deben revisarse con un abogado en Ecuador antes de lanzar.

## 1. Veredicto corto

- **Es viable como producto.** No es único como concepto general: casi todas sus piezas sueltas ya existen.
- **La parte difícil de copiar es el rigor del método:**
  - valor → situación → habilidad;
  - niveles topados por el tipo de evidencia;
  - XP separado del nivel;
  - un objetivo solo se marca como logrado con evidencia evaluada.
  
  No encontré otra app que combine todo eso.
- **La red social y el "modelo que el usuario elija" son buenas ideas, pero caras.** Si se hacen al principio, ponen en riesgo justo la diferencia de Senda, que es la confiabilidad de los niveles. Recomiendo hacerlas por etapas, no al mismo tiempo.

## 2. ¿Ya existe algo así?

| Pieza | Quién ya lo hace | Qué tiene | Qué le falta frente a Senda |
|---|---|---|---|
| Vida como videojuego, XP y niveles | **Habitica** (desde 2013, código abierto) | Hábitos, tareas, XP, oro, grupos | No tiene árbol de habilidades ni evidencia. Eliminó la Taberna y los gremios en 2023, tras perder a sus moderadores. |
| Árbol de habilidades de la vida real | **Skilltree: Self-improvement** (iOS) | Árbol de hábitos con XP, amigos y tabla de posiciones, premium de pago | No usa IA ni evidencia: el nivel = hábito cumplido. |
| | **Skillix**, **QuestFlow**, **ReLife**, **Become Daily** | Juego de rol con hábitos, misiones y estadísticas | El nivel sube por tiempo dedicado, no por dominio demostrado. |
| Coach con IA + metas por área de vida + círculos sociales | **Bestday AI** | 7 áreas de vida (casi las mismas que las de Senda), círculos de rendición de cuentas, 3 coaches de IA | No tiene modelo de habilidades ni niveles con evidencia. Es el competidor conceptual más cercano en lo social. |
| Verificar habilidades con IA y rúbricas | **Workera** | Evaluaciones con rúbrica, mapa de brechas, coach para individuos | Está pensado para empresas. No trabaja valores ni vida personal. |
| Red social de lo que haces o sabes | **LinkedIn** (aptitudes y validaciones); **Polywork** | Perfil público de habilidades | Las validaciones de LinkedIn no tienen rigor. Polywork, la red "más humana" de logros, pivotó en 2023 a un creador de webs personales. |

**Lectura honesta.** "Nadie hace esto" no se sostiene. Lo que sí puedo afirmar es que no encontré a nadie que conecte los **valores con las habilidades a través de situaciones** y que **solo deje subir de nivel con evidencia**. Esa es la cuña. Es un método, no una barrera: se puede copiar. La barrera llegaría con tres cosas:

1. un catálogo de habilidades con rúbricas por nivel probadas con usuarios reales;
2. datos de progreso de muchas personas;
3. una comunidad que confíe en que un nivel de Senda significa algo.

## 3. Tus ideas, aterrizadas y cuestionadas

### 3.1 "Será tipo red social"

**Lo que tiene de bueno.**
- El apoyo social sí ayuda a sostener metas, y Bestday construye todo su producto sobre esa idea.
- Un perfil compartible ("este es mi camino") es un buen motor de crecimiento: cada perfil compartido es publicidad.

**Lo que cuestiono.**

1. **El arranque en frío.** Una red social vale cero hasta que tus amigos están dentro. Primero tiene que servirle a una sola persona; lo social viene después.
2. **Los datos son muy íntimos.** Tus valores hablan de tu pareja, tu crianza y tu familia, y las evidencias pueden incluir certificados. Publicarlos por defecto sería un error de producto y quizás legal. La Ley Orgánica de Protección de Datos Personales del Ecuador (LOPDP) pide:
   - un consentimiento libre, específico, informado e inequívoco, que se puede revocar en cualquier momento;
   - que toda transferencia internacional se respalde en un instrumento jurídico o en una excepción, como el consentimiento explícito. Esto aplica si los datos se envían a un modelo de IA alojado fuera del país.
   
   La ley también prevé categorías especiales de datos; habrá que confirmar con un abogado cuáles de los datos de Senda entran ahí. **Todo debe ser privado por defecto** y compartirse ítem por ítem.
3. **Moderar cuesta.** Habitica quitó sus espacios públicos cuando se quedó sin moderadores. Un feed público obliga a moderar desde el día uno.
4. **"Que alguien se enamore de tus objetivos" son tres negocios distintos:**
   - **mentoría o ayuda** (alguien que sabe te ofrece apoyo);
   - **empleo** (un reclutador ve habilidades verificadas);
   - **citas** (alguien se interesa en ti por tus valores).
   
   Cada uno tiene otro usuario, otro riesgo y otro modelo de ingresos. Hay que elegir uno para empezar. Mi recomendación es **aliados y mentores**: encaja con el método y es el de menor riesgo.
5. **Si los niveles son públicos, hay incentivo para inflarlos.** El sistema de evidencias se vuelve más importante, no menos.

**Propuesta.** El primer paso social debe ser mínimo:
- un enlace para compartir un perfil o un objetivo concreto;
- invitar de 1 a 5 **aliados** con permisos por ítem, que pueden comentar, animar u ofrecer ayuda en un objetivo.

Nada de feed público hasta tener usuarios que vuelvan cada semana.

### 3.2 "Debe funcionar con el modelo que el usuario elija, incluso local"

**Lo que tiene de bueno.**
- El usuario paga su propio consumo, así que tu costo por usuario baja mucho.
- Con un modelo local, los datos no salen del equipo. Es un argumento de privacidad fuerte, justo para datos tan íntimos.
- No dependes de un solo proveedor.

**Lo que cuestiono.**

1. **El corazón de Senda depende de la calidad del modelo.** Clasificar, derivar habilidades desde un valor, crear retos y evaluar evidencias son tareas de razonamiento. Un modelo local pequeño va a inflar niveles o a evaluar mal, y el usuario culpará a Senda, no al modelo. Un aviso legal no arregla una mala experiencia.
2. **Los niveles dejan de ser comparables.** Un "nivel 3" evaluado por un modelo fuerte no vale lo mismo que uno evaluado por un modelo pequeño. Si además los niveles son visibles para otros, eso afecta la confianza de toda la red.
3. **En claude.ai no se puede.** El prototipo actual vive en claude.ai y solo puede usar Claude. Elegir otro modelo exige la app propia (fase B, más abajo).

**Cómo hacerlo bien.**
- **Una capa de adaptadores.** Dos adaptadores cubren casi todo el mercado:
  - la API de Anthropic;
  - el formato compatible con OpenAI, que usan OpenAI, OpenRouter y servidores locales como Ollama o LM Studio.
- **Modelos certificados.** Cada modelo se prueba con un banco de pruebas fijo, construido a partir de `modelo/casos-de-prueba.md` más evaluaciones de referencia, y recibe una calificación de confiabilidad visible: "Recomendado", "Aceptable" o "Experimental".
- **Cada evaluación queda firmada** con el modelo que la hizo ("Evaluado por: …, fecha"). Así cualquiera sabe de dónde viene un nivel.
- **Modelos locales desde el navegador.** Llamar a Ollama desde una web obliga a configurar CORS (la variable `OLLAMA_ORIGINS`). Una app de escritorio, por ejemplo con Tauri, evita ese problema y encaja con "tus datos en tu equipo".

### 3.3 "Indicar que el rendimiento y la veracidad son responsabilidad del usuario y del modelo"

De acuerdo con avisarlo de forma explícita, con dos matices:

- **Un aviso no traslada toda la responsabilidad.** Si Senda guarda o transmite datos personales, sigue teniendo obligaciones como responsable o encargado del tratamiento, y la ley de consumo también aplica. El aviso informa, pero no exime. Esto se revisa con un abogado antes de lanzar.
- **Mejor transparencia que culpa.** Un texto que sirve y no espanta:

  > *Las sugerencias y evaluaciones de Senda las genera el modelo de IA que elegiste ({modelo}). Pueden contener errores; la calidad depende de ese modelo. Úsalas como guía, no como certificación. Tus decisiones son tuyas.*

  Va en la configuración del modelo, al pie de cada evaluación y en los términos de uso.

### 3.4 "Omar tiene de coach a Claude" como cuña comercial

**Lo que tiene de bueno.**
- Es simpático y personal.
- Si aparece en la tarjeta del perfil que se comparte, se vuelve viral: cada perfil compartido muestra la frase.

**Lo que cuestiono.**

1. **Marcas registradas.** "Claude" es marca de Anthropic. Sus lineamientos piden usar sus marcas solo como ellos lo permiten y prohíben insinuar patrocinio, respaldo o afiliación. Mencionar en texto plano qué modelo usa el usuario es descriptivo y tiene menos riesgo. Usarlo como eslogan en publicidad, o con el logo, requiere permiso. Lo mismo vale para OpenAI, Google y otros.
2. **¿Quién es el coach?** El método es lo que distingue a Senda; el modelo es el motor. Si el coach es "Claude", el valor percibido queda en Claude, no en Senda.

**Propuesta.**
- Dentro de la app y en la tarjeta compartida, en texto plano y dinámico: **"{nombre} entrena con Senda · coach: {modelo}"**. Por ejemplo: "Omar entrena con Senda · coach: Claude".
- Sin logos de terceros.
- Una nota visible: "Senda no está afiliada a los proveedores de modelos".
- Antes de usar la frase en anuncios, consultar.

### 3.5 El nombre "Senda"

Es un buen nombre: corto, en español y con significado. En una búsqueda rápida no vi una app de desarrollo personal con ese nombre, pero eso no reemplaza una **búsqueda de marca en el SENADI** (Ecuador) ni en las tiendas de apps antes de invertir en la marca o en el dominio.

## 4. Viabilidad por dimensión

| Dimensión | Evaluación | Por qué |
|---|---|---|
| Técnica | **Alta** | El prototipo ya funciona. Tienes perfil de desarrollador (Python, Node, Kotlin, .NET). La pila necesaria es común: web o PWA, base local o en la nube y adaptadores de modelos. |
| Mercado | **Media** | El mercado de apps de superación personal está lleno y retener usuarios es difícil. La diferencia de Senda es clara, pero hay que demostrar que a la gente le importa el rigor. |
| Negocio | **Media-baja por ahora** | Si cada usuario trae su propio modelo, no puedes cobrar por la IA. Lo cobrable es el método, el catálogo con rúbricas, la sincronización, lo social y un modelo alojado "sin configurar nada" como premium. |
| Legal y privacidad | **Riesgo medio** | Datos íntimos, transferencias a proveedores de IA en el exterior y uso de marcas. Todo se puede manejar con diseño (local primero, privado por defecto) y asesoría. |
| Tu tiempo | **Riesgo alto** | Tu propio plan en Senda limita a 3 las habilidades en desarrollo y a 60 minutos diarios. Una startup compite por esas mismas horas con tu objetivo de inglés C1. Hay que decidirlo de forma explícita, no por inercia. |

## 5. Ruta propuesta

1. **Fase A: Omar como usuario cero (en claude.ai, ahora).**
   - Pulir el núcleo: valores → habilidades, retos, evidencia y logros.
   - Nombre de usuario configurable.
   - Etiqueta "coach: Claude" y el aviso de responsabilidad.
   - Usarla de verdad 4 semanas.
2. **Fase B: app propia, con los datos en el equipo del usuario.**
   - PWA o escritorio, con datos en el dispositivo y exportación a JSON.
   - Capa de adaptadores (Anthropic + compatible con OpenAI, incluido Ollama).
   - Banco de pruebas para certificar modelos.
   - El HTML actual sirve de especificación funcional.
3. **Fase C: beta cerrada con 10 a 20 personas** (amigos y colegas).
   - Medir quién sigue usándola a las 4 semanas y qué funciones usa.
   - Decidir con esos datos.
4. **Fase D: social mínimo.**
   - Perfil compartible por enlace.
   - Aliados invitados con permisos por ítem.
   - Ayuda ofrecida dentro de un objetivo.
5. **Fase E: decidir si es startup.**
   - Monetización, marca, aspectos legales e inversión de tiempo, con datos reales de la beta.

## 6. Preguntas abiertas para Omar

1. ¿Para quién es la primera versión: tú y tus amigos, el público hispano en general o profesionales que buscan crecer en su carrera?
2. ¿Qué es "que alguien se enamore de tus objetivos": mentoría y ayuda, empleo o citas?
3. ¿Dónde viven los datos: en el equipo del usuario (local primero) o en la nube con cuentas?
4. ¿Cuántas horas por semana le darás a Senda sin quitárselas al inglés?

## Fuentes

- [Habitica en Wikipedia](https://en.wikipedia.org/wiki/Habitica)
- [Skilltree: Self-improvement (App Store)](https://apps.apple.com/us/app/-/id6459107901)
- [Skillix: Habit RPG & Builder (App Store)](https://apps.apple.com/ms/app/id6766952006)
- [QuestFlow: Life Gamified](https://appgoblin.info/apps/6759860666)
- [ReLife: Level Up Your Real-Life Stats](https://relifeapp.notion.site)
- [Bestday AI (App Store)](https://apps.apple.com/app/id6463491722)
- [Workera](https://www.workera.ai/llms.txt)
- [Polywork: cambio de rumbo (DEV Community)](https://www.dev.to/conr/polywork-is-dead-to-me-153j)
- [Anthropic Trademark Guidelines](https://www.anthropic.com/legal/trademark-guidelines)
- [Ollama: CORS y puertos](https://objectgraph.com/blog/ollama-cors/)
- [Resumen de la LOPDP de Ecuador (EY)](https://assets.ey.com/content/dam/ey-sites/ey-com/es_ec/topics/tax/ey-legal-alert-resumen-ley-proteccion-datos-personales.pdf)
