// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://1000gracias.studio',
  integrations: [sitemap()],
  /*
    Todo el CSS va dentro del HTML, sin hoja aparte. Son 26 KB —unos 6 con
    gzip— repartidos en tres páginas, así que lo que se gana en caché entre
    páginas no compensa lo que cuesta: mientras la hoja no llega, el navegador
    puede alcanzar a pintar las imágenes en su tamaño natural, una al lado de
    otra, y eso es justo el parpadeo que se veía al recargar. Sin petición
    aparte, el CSS no puede llegar tarde ni faltar.
  */
  build: { inlineStylesheets: 'always' },
});
