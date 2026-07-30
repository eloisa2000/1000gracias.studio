# 1000gracias — sitio

Home estática en HTML, CSS y JS puro. Sin dependencias ni build: se abre el `index.html` y funciona.

## Estructura

```
index.html      Marcado de la home + modal de contacto
styles.css      Estilos, seccionados (tokens, hero, panel, contacto, responsive)
main.js         Hover que cambia la imagen, miniaturas en móvil, modal de contacto
assets/         Imágenes (ver abajo)
```

## Imágenes que hay que agregar

El sitio busca estas imágenes en `assets/`. Mientras no existan, se ve el color de fondo en su lugar.

- `hero-default.jpg` — imagen del hero al cargar (elige un archivo que diga "bien público, cultura, oficios": oficios, naturaleza, patrimonio local).
- `casona.jpg`, `la-causa.jpg`, `red-ong.jpg`, `graz.jpg` — una por proyecto. Aparecen al pasar el mouse por el nombre (escritorio) y como miniatura (móvil).
- `contact.jpg` — imagen del panel del formulario.

Recomendado: imágenes horizontales, mínimo 1600px de ancho, comprimidas (usa squoosh.app para bajar el peso).

## Lo que falta / decisiones abiertas

- **Reemplazar el boceto del brandmark y la estrella** (están dibujados en SVG dentro del HTML) por tus vectores reales si los prefieres exactos.
- **Conectar el formulario.** Hoy solo muestra un aviso. Para que envíe de verdad, usar un servicio como Formspree o Basin, o un backend. El punto está marcado con `TODO` en `main.js`.
- **Páginas de proyecto.** Los enlaces de la lista apuntan a `#`. Cuando existan las páginas individuales, cambiar cada `href`.
- Las fuentes: Epilogue carga desde Google Fonts; Helvetica usa la del sistema.

## Publicar

Sirve como sitio estático en GitHub Pages, Netlify o Vercel sin configuración: apuntar a la raíz del proyecto.
