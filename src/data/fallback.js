/*
  Datos de prueba. Se usan mientras no haya un proyecto de Sanity configurado
  (SANITY_PROJECT_ID en .env), para que `npm run dev` funcione de entrada.

  Las imágenes del hero y del contacto son las del Figma. Las de los proyectos
  son cuadrados de color, uno por proyecto: así queda claro que es material de
  prueba y se ve el cambio de imagen sin fingir un resultado. Cuando cada
  proyecto tenga su `hoverImage` en Sanity, esto deja de usarse.
*/

const MUERTE = '/img/hero-muerte.jpg';
const PERRO = '/img/contacto-perro.jpg';

const cuadrado = (hex) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="${hex}"/></svg>`
  )}`;

export const proyectos = [
  {
    id: 'casona',
    title: 'Casona Compañía',
    slug: 'casona-compania',
    order: 1,
    year: '2025',
    type: 'Espacio cultural',
    excerpt: 'Sitio y sistema de agenda para una casona de barrio con programación propia.',
    tools: ['Figma', 'Webflow'],
    liveUrl: 'https://casonacompania.cl/',
    hoverSrc: cuadrado('#1E1A8E'),
    coverSrc: cuadrado('#1E1A8E'),
    videoSrc: '/videos/casona-compania.mp4',
  },
  {
    id: 'la-causa',
    title: 'Cooperativa La Causa',
    slug: 'cooperativa-la-causa',
    order: 2,
    year: '2024',
    type: 'Cooperativa de trabajo',
    excerpt: 'Identidad digital y sitio para una cooperativa de oficios.',
    tools: ['Figma', 'Astro'],
    liveUrl: 'https://cooperativalacausa.webflow.io/',
    hoverSrc: cuadrado('#D71B1B'),
    coverSrc: cuadrado('#D71B1B'),
    videoSrc: '/videos/la-causa.mp4',
  },
  {
    id: 'red-ong',
    title: 'Red ONG',
    slug: 'red-ong',
    order: 3,
    year: '2024',
    type: 'Red de organizaciones',
    excerpt: 'Directorio y sitio de una red de organizaciones sociales.',
    tools: ['Figma', 'Sanity'],
    liveUrl: 'https://ong-red.webflow.io/',
    hoverSrc: cuadrado('#FFAA0B'),
    coverSrc: cuadrado('#FFAA0B'),
    videoSrc: '/videos/red.mp4',
  },
  {
    id: 'graz',
    title: 'Graz',
    slug: 'graz',
    order: 4,
    year: '2023',
    type: 'Oficio',
    excerpt: 'Sitio de portafolio para un taller de oficio.',
    tools: ['Figma', 'GSAP'],
    liveUrl: 'https://graz.cl/',
    hoverSrc: cuadrado('#1A1937'),
    coverSrc: cuadrado('#1A1937'),
    videoSrc: '/videos/graz.mp4',
  },
];

export const ajustes = {
  heroSrc: MUERTE,
  heroAlt:
    'Detalle del naipe de la Muerte del tarot Visconti di Modrone, siglo XV. Un esqueleto a caballo con una guadaña sobre fondo dorado.',
  contactoSrc: PERRO,
  contactoAlt:
    'Detalle de una pintura china sobre seda: un perro cachorro camina con una pluma en el hocico.',
  email: 'hello@1000gracias.studio',
  instagram: 'https://instagram.com/1000gracias.studio',
  folioUrl: 'https://elo.pm',
  creditos: 'Imágenes de archivo de dominio público.',
};
