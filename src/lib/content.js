import { sanity, PROYECTOS_QUERY, AJUSTES_QUERY } from './sanity.js';
import { imagenEscenario, imagenCuadrada, imagenPortada } from './image.js';
import * as respaldo from '../data/fallback.js';

/*
  Una sola capa entre Sanity y los componentes: siempre devuelve la misma
  forma, venga de Sanity o de los datos de prueba. Si Sanity falla (sin red,
  token vencido), avisa por consola y sigue con el respaldo en vez de romper
  el build.
*/

async function traer(query, alFallar) {
  if (!sanity) return alFallar;
  try {
    return await sanity.fetch(query);
  } catch (error) {
    console.warn('[1000gracias] Sanity no respondió, se usan los datos de prueba:', error.message);
    return alFallar;
  }
}

export async function getProyectos() {
  const datos = await traer(PROYECTOS_QUERY, null);
  if (!datos || datos.length === 0) return respaldo.proyectos;

  return datos.map((p, i) => {
    const escenario = imagenEscenario(p.hoverImage);
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      order: p.order ?? i + 1,
      year: p.year ?? null,
      type: p.type ?? null,
      excerpt: p.excerpt ?? null,
      tools: p.tools ?? [],
      liveUrl: p.liveUrl ?? null,
      hoverSrc: escenario?.src ?? null,
      hoverSrcset: escenario?.srcset,
      // Si el proyecto trae video, manda el video y la imagen queda de póster.
      videoSrc: p.hoverVideo?.asset?.url ?? null,
      coverSrc: imagenPortada(p.coverImage),
    };
  });
}

export async function getAjustes() {
  const datos = await traer(AJUSTES_QUERY, null);
  if (!datos) return respaldo.ajustes;

  const hero = imagenEscenario(datos.heroImage);
  const contacto = imagenCuadrada(datos.contactImage);
  return {
    heroSrc: hero?.src ?? respaldo.ajustes.heroSrc,
    heroSrcset: hero?.srcset,
    heroAlt: datos.heroImage?.alt ?? respaldo.ajustes.heroAlt,
    contactoSrc: contacto?.src ?? respaldo.ajustes.contactoSrc,
    contactoSrcset: contacto?.srcset,
    contactoAlt: datos.contactImage?.alt ?? respaldo.ajustes.contactoAlt,
    email: datos.email ?? respaldo.ajustes.email,
    instagram: datos.instagram ?? respaldo.ajustes.instagram,
    folioUrl: datos.folioUrl ?? respaldo.ajustes.folioUrl,
    creditos: respaldo.ajustes.creditos,
  };
}
