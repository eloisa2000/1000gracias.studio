import { createClient } from '@sanity/client';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET || 'production';

/**
 * Cliente de Sanity. Es `null` si todavía no hay proyecto configurado: en ese
 * caso el sitio se construye con los datos de prueba de src/data/fallback.js.
 */
export const sanity = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2025-01-01',
      useCdn: true,
      perspective: 'published',
    })
  : null;

// Lo mismo para una imagen o video del caso, esté suelto o dentro de una sección.
const MEDIO = /* groq */ `
  _type,
  tipo,
  alt,
  rotulo,
  leyenda,
  imagen{ asset, hotspot, crop },
  "dimensiones": imagen.asset->metadata.dimensions{ width, height },
  "videoUrl": video.asset->url
`;

export const PROYECTOS_QUERY = /* groq */ `
  *[_type == "project" && !(_id in path("drafts.**"))] | order(order asc, title asc) {
    "id": _id,
    title,
    "slug": slug.current,
    order,
    year,
    type,
    excerpt,
    tools,
    liveUrl,
    credits,
    hoverImage,
    coverImage,
    hoverVideo{ asset->{ url } },
    caso{
      titular,
      bajada,
      ficha[]{ etiqueta, valor },
      proceso[]{ nombre, texto },
      bloques[]{
        ${MEDIO},
        titulo,
        texto,
        disposicion,
        cita,
        autor,
        medios[]{ ${MEDIO} }
      }
    }
  }
`;

export const AJUSTES_QUERY = /* groq */ `
  *[_type == "siteSettings"][0] {
    heroImage,
    contactImage,
    email,
    instagram,
    folioUrl
  }
`;
