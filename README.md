# 1000gracias

Sitio del estudio. Astro estático, contenido en Sanity, sin frameworks de UI:
el único JavaScript son dos scripts chicos (imágenes de los proyectos y modal
de contacto).

## Los videos de los proyectos

Cada proyecto muestra un video del sitio. La imagen (`hoverImage`) se sigue
usando: es el póster, o sea el primer cuadro mientras el video carga y lo único
que se ve para quien pide movimiento reducido. Si un proyecto no tiene video,
la imagen se usa sola.

En el escenario van con `preload="metadata"`, que basta para que arranquen sin
mostrar el póster. El flotante de móvil va con `preload="none"`: ahí el toque
ya es una intención y no vale la pena gastar datos por adelantado.

**Tienen que ir comprimidos.** Un loop de hero anda entre 1 y 3 MB. Los cuatro
que hay pesan 5.4 MB en total; los originales quedaron en `videos-fuente/`,
fuera del directorio publicado y en el `.gitignore`. La receta, si hay que
repetirla:

```
ffmpeg -y -i entrada.mp4 -an \
  -vf "scale=w=1280:h=1280:force_original_aspect_ratio=decrease:flags=lanczos,scale=trunc(iw/2)*2:trunc(ih/2)*2,fps=30" \
  -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart salida.mp4
```

H.264 obligatorio: uno de los originales venía en HEVC, que Chrome y Firefox no
reproducen.

El escenario es una caja vertical, así que los videos también van verticales
(1080 × 1920). Uno apaisado entraría recortado al 40% central de su ancho.

Los originales sin comprimir viven en `videos-fuente/`, fuera del directorio
publicado y en el `.gitignore`. En `videos-fuente/anteriores/` quedaron los
apaisados de la primera versión: ya no se usan y se pueden borrar.

## Las imágenes de los proyectos

En escritorio, pasar el mouse por un nombre cambia la imagen del escenario del
hero. En móvil no hay hover: al tocar el nombre aparece la imagen flotando
sobre el ítem, y se queda hasta que toques otro proyecto o fuera de la lista.
La lista no cambia de aspecto — la imagen es toda la respuesta. Los dos
comportamientos viven en [`src/scripts/hover-stage.js`](src/scripts/hover-stage.js).

```bash
npm install
npm run dev
```

Anda de entrada sin configurar nada: mientras no haya un proyecto de Sanity, el
sitio se construye con los datos de prueba de `src/data/fallback.js`.

## Estructura

```
src/
  components/  Hero, ProjectList, ProjectItem, ContactModal, Nav,
               Wordmark, Titular, Star, Brandmark
  layouts/     Base.astro
  pages/       index.astro, contacto.astro
  styles/      tokens.css, global.css
  lib/         sanity.js (cliente + queries), image.js (urlFor), content.js
  scripts/     hover-stage.js, contact-modal.js
  data/        fallback.js — datos de prueba
public/
  img/         imágenes de archivo del Figma
  svg/         estrellas, carita, punto del wordmark, flecha, forma festoneada
sanity/        esquema de `project` y `siteSettings`
```

## Cómo funcionan las medidas

Todo el layout está escrito en función de `--k`, definida en
`src/styles/tokens.css`. `--k` vale **un píxel del artboard de Figma**: cada
medida del diseño se escribe `calc(<medida> * var(--k))`, así el sitio conserva
las proporciones exactas del Figma a cualquier ancho.

- Escritorio: artboard de **1728 × 1117**. `--k` se ajusta al ancho *y* al alto,
  para que el hero entre completo en pantallas bajas.
- Móvil (≤ 1024 px): artboard de **393** de ancho; la página se desplaza.

Si hay que ajustar algo del diseño, se cambia el número del Figma, no la escala.

## Tokens

Los de `src/styles/tokens.css` mandan sobre el Figma. Texto navy sobre crema (o
crema sobre navy/azul/rojo), un acento por pieza, el rojo para los CTA, el
amarillo solo en formas. Sin degradados de marca.

Tipografías: **Archivo** (título semibold en mayúscula, cuerpo regular) y
**Onest** (rótulos y bajadas, medium). Se sirven con `@fontsource`, subconjunto
latino, sin llamadas a Google.

## Sanity

El esquema está en `sanity/`. Para levantar el estudio:

```bash
npm install -D sanity @sanity/vision styled-components
```

Después crea el proyecto en [sanity.io/manage](https://sanity.io/manage) y
copia el id a `.env` (a partir de `.env.example`) y a
`SANITY_STUDIO_PROJECT_ID`:

```bash
npx sanity --cwd ./sanity dev
```

Documentos:

- `project` — un proyecto de la home. `order` define el orden, `hoverImage` es
  la que reemplaza la imagen del escenario al pasar el mouse.
- `siteSettings` — singleton: imagen del hero, imagen del contacto, correo,
  Instagram y folio.

Las imágenes se sirven con `@sanity/image-url` (`src/lib/image.js`), recortadas
y con `srcset`. Las `hoverImage` van en el HTML desde el principio, apiladas y
transparentes, para que el cambio sea instantáneo.

Mientras no haya imágenes de verdad, cada proyecto de prueba usa un cuadrado de
un color de la paleta, para que se note que es material de prueba.

`src/lib/content.js` es la única capa entre Sanity y los componentes: siempre
devuelve la misma forma, y si Sanity no responde avisa por consola y sigue con
los datos de prueba en vez de romper el build.

## El contacto tiene su propia URL

Es modal y es página a la vez, con el mismo marcado. `ContactModal.astro`
recibe `pagina`: sin esa prop es un `<dialog>`, con ella es una `<section>`
fija ya en su estado final.

- En la home, «Conversemos» es un enlace de verdad a `/contacto`. El script lo
  intercepta, abre el modal y empuja la URL al historial sin recargar. El
  enlace se puede copiar, y el botón de atrás cierra.
- `/contacto` existe de verdad: si alguien entra directo o no tiene
  JavaScript, ve el mismo takeover. Ahí el hero va con `inert`, porque es solo
  el fondo.
- Cmd/Ctrl/Shift-clic siguen abriendo en otra pestaña.

## Las rutas

| ruta | qué es | archivo |
|---|---|---|
| `/` | la home | `src/pages/index.astro` |
| `/contacto/` | el muro con el cartel | `src/pages/contacto.html` |
| `/conversemos/` | el formulario | `src/pages/conversemos.astro` |

Las dos últimas son modales en la home y páginas de verdad si se entra
directo, cada una con su propio enlace compartible.

## El muro

`src/pages/contacto.html` es un documento suelto y completo: su propio reset,
sus propias fuentes y sus propias variables de color, con los mismos nombres
que las del sitio. Va en `src/pages` y no en `public` porque el servidor de
desarrollo no resuelve directorios a `index.html` — así Astro lo sirve como
ruta en `/contacto/` tanto en desarrollo como en el build.

La carita lo abre. Como los estilos chocarían, en el modal va dentro de un
`iframe`, que es lo único que aísla de verdad. El `src` no viene puesto: son
unos 350 KB entre documento e imágenes, y se piden al primer hover sobre la
carita, no en cada visita a la home.

La entrada va en dos tramos: primero se funde la trama de transparencia sobre
la home, que queda visible detrás, y cuando termina entra el afiche. Al cerrar
el orden se invierte solo, con el mismo truco de siempre: el retardo de entrada
vive en la regla de `.is-abierto` y el de salida en la base.

La trama del modal es una copia de la que trae la página del muro, con la misma
medida y el mismo desfase. Así, cuando el afiche se funde encima, las dos
calzan y lo único que aparece es el poste con el cartel. Por eso el iframe
entra solo con opacidad, sin desplazarse: cualquier movimiento correría su
trama respecto de la de abajo y se vería el arrastre. **Si la trama cambia en
`src/pages/muro.html`, hay que cambiarla también en `MuroModal.astro`** — son
dos documentos y no pueden compartir la regla.

La carita se repite dentro del modal y queda quieta por encima de todo, como
un ancla. Un `<dialog>` modal va en el top layer, así que la de la página no
puede quedar encima: la copia se coloca justo sobre ella —el script le pasa su
posición, que en móvil depende del scroll— y no lleva animación de entrada.
Las dos siguen girando en fase, porque partieron a la vez al cargar.

Dentro del modal, la carita **repone los papelitos** del cartel: dice «reponer
papelitos» en el globo y dispara el botón que la página trae adentro.

La página trae dos piezas de interfaz propias —la X, que vuelve al inicio, y el
botón de reponer— y las dos se esconden cuando está enmarcada: un script en
línea detecta el marco y pone la clase `en-marco` antes del primer pintado. Así
no se duplican con las del modal, pero siguen ahí para quien visita
`/contacto/` suelta. Como el iframe es del mismo origen, el modal les engancha
el comportamiento por encima.

## Movimiento

La regla es que nada parpadee. El contacto no aparece de golpe: el `<dialog>`
es transparente y la home queda visible detrás, así que el bloque rojo se
disuelve sobre el escenario azul en lugar de reemplazarlo.

Lo que se repite en las dos pantallas está en la misma posición exacta y no se
anima: el titular y la carita no se mueven ni un píxel. Lo que sí viaja, sale
todo junto al apretar «Conversemos», en `--entrada`:

- La píldora pasa de «Conversemos» a «X» animando el ancho, anclada a la
  derecha, con la etiqueta en fundido.
- Las estrellas parten en la posición y el tamaño que tienen en la home y se
  trasladan hasta los del contacto. `Star.astro` recibe un `desde` y calcula el
  `transform` que calza una caja sobre la otra, así el viaje es una sola
  interpolación. Cada una sale con su propio `retardo`, para que no lleguen
  juntas. Mientras dura, las estrellas de la home se apagan: las del modal
  empiezan justo encima.
- El rojo barre desde la derecha, del lado por donde se apretó, y recién a los
  220 ms entra la figura festoneada con el perro. Al cerrar es al revés: la
  figura se va primero y después barre el rojo. El retardo de entrada vive en
  la regla de `.is-abierto` y el de salida en la regla base, que es como las
  transiciones de CSS eligen cuál usar.
- El formulario sube y aparece.

Al cerrar, el recorrido es al revés y el diálogo se cierra recién al terminar.

Todo eso es de escritorio. En móvil el contacto es **una sola hoja que sube
desde abajo** y abre ya desplazada al formulario, sin importar dónde estuviera
el scroll de la página. En reposo se ven las dos secciones: el titular con el
borde del perro arriba, el formulario completo abajo, y el resto del rojo se
alcanza con scroll.

Se probó en dos capas escalonadas y no da: la sección roja mide 622 y el
formulario 600, o sea 1222 en una pantalla de 852. **No caben las dos
completas**, así que escalonarlas obliga a que la segunda tape a la primera —
que era justo lo que no se quería. Si algún día la sección roja se acorta en
móvil, el escalonado vuelve a ser posible.

Adentro de cada capa no se mueve nada: ni barrido del rojo, ni viaje de
estrellas, ni fundido del formulario. Dos movimientos perpendiculares a la vez
se leían como si el modal viniera de una esquina.

La carita gira siempre, en torno al centro del círculo de la cara y no al de
su caja. En la home además es un enlace al contacto: al pasar el mouse la
rotación se detiene y sale un globo con «contacto» en marquesina, que entra y
sale animando el ancho igual que la píldora. En móvil no hay hover, así que
ahí el globo no existe y la carita solo gira. En el modal la carita es
decorativa: gira, pero no lleva globo ni enlace.

En móvil, al cargar la home entra todo **en orden descendente**, en pasos de
70 ms: encabezado, título, párrafo, logo, botón, «Proyectos», los cuatro
proyectos y la carita al final. Los retardos están repartidos entre `Titular`,
`Nav`, `ProjectList`, `ProjectItem` y `Brandmark`, y por eso la animación
`entra` vive en `global.css` y no en cada componente.

En escritorio la secuencia es otra, porque la carita queda arriba del panel:
primero aparece la carita y después se apila la lista: de proyectos: la carita a los 0 ms, el rótulo a los 180 y cada proyecto a los
270, 360, 450 y 540. El estado escondido vive dentro de
`@media (prefers-reduced-motion: no-preference)`, así que si alguien pide
movimiento reducido la lista se ve de una y no depende de que corra ninguna
animación.

Un detalle si tocas los tiempos: `contact-modal.js` espera `--entrada` más el
mayor `retardo` de las estrellas antes de cerrar el diálogo. Si le subes el
retardo a alguna, sube también `RETARDO_MAX` ahí o se corta el viaje.

## Formulario

Apunta a `PUBLIC_FORM_ENDPOINT` (Formspree, Basin o una función serverless). Sin
esa variable el formulario valida igual y avisa que todavía no está conectado.
Trae un mensaje de estado con `aria-live` y una trampa para bots: un campo
oculto llamado **`_gotcha`**, que es el nombre que Formspree reconoce y
descarta en su servidor. El nombre importa — con cualquier otro, la revisión
sería solo del navegador y no serviría de nada, porque el endpoint está a la
vista en el HTML y un bot puede publicar directo contra él sin pasar por
nuestro JavaScript.

Lo demás contra el spam se configura en el panel de Formspree, no acá: la
lista de dominios permitidos es la medida que más rinde.

## SEO y compartir

Las etiquetas viven en `Base.astro` y valen para la home y `/conversemos/`. La
canónica se arma con `site` (en `astro.config.mjs`) y **siempre con barra al
final**, que es como quedan las rutas en el build: sin eso, la misma página con
y sin barra cuentan como dos direcciones distintas.

`/contacto/` es un documento suelto y no hereda nada del layout, así que sus
etiquetas están escritas a mano en `src/pages/contacto.html`. **Si cambia el
dominio, ahí hay URLs absolutas que hay que actualizar a mano.**

`public/img/compartir.jpg` (1200 × 630) es lo que se ve al pegar un enlace en
WhatsApp, Slack o Instagram. Está compuesta con ffmpeg desde el naipe del hero
—banda azul y la obra— como solución de momento: una tarjeta diseñada, con el
wordmark y el título, funcionaría mejor.

El sitemap lo genera `@astrojs/sitemap` en cada build y `robots.txt` lo apunta.
Los datos estructurados (`ProfessionalService`) van solo en la home.

## Accesibilidad

Un solo `h1`, el modal usa `<dialog>` nativo (foco atrapado, Escape, foco de
vuelta al botón que lo abrió), todos los campos con `label` y
`prefers-reduced-motion` respetado — con movimiento reducido el contacto abre y
cierra al tiro, sin quedarse esperando una animación que no ocurre.

El foco en los campos cambia el contorno que ya tienen, de azul a amarillo, en
vez de sumar un anillo. Ojo con eso: el amarillo sobre crema queda en 1.9:1 y
WCAG pide 3:1 para un indicador de foco, así que además engorda el trazo. Si
en algún momento hay que pasar una auditoría, ese es el punto a revisar.
Botones y enlaces mantienen el anillo rojo.

## Pendiente

- Páginas `/proyectos/[slug]`. Mientras no existan, cada ítem de la lista es un
  enlace al sitio publicado si el proyecto tiene `liveUrl`, y si no, un botón
  que solo cambia la imagen del escenario.
- Iconografía y las ideas de marca del handoff (el wordmark que se recompone en
  cara, el ojo que parpadea, la lengua en el 404).
