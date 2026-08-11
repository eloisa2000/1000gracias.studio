import imageUrlBuilder from '@sanity/image-url';
import { sanity } from './sanity.js';

const builder = sanity ? imageUrlBuilder(sanity) : null;

export function urlFor(source) {
  if (!builder || !source) return null;
  return builder.image(source);
}

/**
 * Devuelve `{ src, srcset }` listos para el escenario del hero (imagen alta,
 * recortada). Si no hay Sanity, `respaldo` se usa tal cual.
 */
export function imagenEscenario(source, respaldo = null) {
  const b = urlFor(source);
  if (!b) return respaldo ? { src: respaldo, srcset: undefined } : null;

  const en = (w) => b.width(w).height(Math.round(w * 1.9)).fit('crop').auto('format').quality(78).url();
  return {
    src: en(900),
    srcset: [`${en(600)} 600w`, `${en(900)} 900w`, `${en(1400)} 1400w`].join(', '),
  };
}

/**
 * Devuelve `{ src, srcset }` cuadrados. Los usa la forma festoneada del
 * contacto, que es un círculo: si la imagen llegara alta se vería mal
 * recortada.
 */
export function imagenCuadrada(source, respaldo = null) {
  const b = urlFor(source);
  if (!b) return respaldo ? { src: respaldo, srcset: undefined } : null;

  const en = (w) => b.width(w).height(w).fit('crop').auto('format').quality(78).url();
  return {
    src: en(900),
    srcset: [`${en(500)} 500w`, `${en(900)} 900w`, `${en(1400)} 1400w`].join(', '),
  };
}

/** Miniatura cuadrada para futuras páginas de proyecto y para compartir. */
export function imagenPortada(source, respaldo = null, ancho = 800) {
  const b = urlFor(source);
  if (!b) return respaldo;
  return b.width(ancho).height(ancho).fit('crop').auto('format').quality(78).url();
}
