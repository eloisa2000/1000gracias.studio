import { sanity, PROYECTOS_QUERY, AJUSTES_QUERY } from './sanity.js';
import { imagenEscenario, imagenCuadrada, imagenPortada, imagenCaso } from './image.js';
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

/* Una imagen o video del caso, con la misma forma que los de respaldo. */
function medio(m) {
  if (!m) return null;
  const imagen = imagenCaso(m.imagen);
  const tipo = m.tipo ?? 'imagen';
  if (tipo === 'video' ? !m.videoUrl : !imagen) return null;
  return {
    tipo,
    src: tipo === 'video' ? m.videoUrl : imagen.src,
    srcset: tipo === 'video' ? undefined : imagen.srcset,
    poster: tipo === 'video' ? imagen?.src ?? null : null,
    ancho: m.dimensiones?.width ?? null,
    alto: m.dimensiones?.height ?? null,
    alt: m.alt ?? '',
    rotulo: m.rotulo ?? null,
    leyenda: m.leyenda ?? null,
  };
}

function bloque(b) {
  if (b._type === 'casoMedio') {
    const m = medio(b);
    return m && { tipo: 'medio', medio: m };
  }
  if (b._type === 'casoSeccion') {
    return {
      tipo: 'seccion',
      titulo: b.titulo,
      texto: b.texto ?? '',
      disposicion: b.disposicion ?? 'lado',
      medios: (b.medios ?? []).map(medio).filter(Boolean),
    };
  }
  if (b._type === 'casoCita') return { tipo: 'cita', cita: b.cita, autor: b.autor ?? null };
  return null;
}

/* Sin titular no hay caso: el proyecto sigue enlazando a su sitio. */
function caso(c) {
  if (!c?.titular) return null;
  return {
    titular: c.titular,
    bajada: c.bajada ?? null,
    ficha: c.ficha ?? [],
    proceso: c.proceso ?? [],
    bloques: (c.bloques ?? []).map(bloque).filter(Boolean),
  };
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
      caso: caso(p.caso),
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
