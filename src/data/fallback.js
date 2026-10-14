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

/* El caso de Casona Compañía, con los textos y las imágenes del Figma. */
const CASONA = '/img/casos/casona-compania';

const casona = {
  titular: 'Un espacio con muchos usos, explicado en una sola página',
  bajada:
    'Un sitio autogestionable que hoy es la principal fuente de consultas de un edificio patrimonial del Barrio Yungay.',
  ficha: [
    { etiqueta: 'Cliente', valor: 'Casona Compañía' },
    { etiqueta: 'Año', valor: '2025' },
    { etiqueta: 'Rubro', valor: 'Cultura y espacios' },
    { etiqueta: 'Servicios', valor: 'Arquitectura de información, diseño UI, desarrollo web, CMS' },
    { etiqueta: 'Entrega', valor: 'Autogestionable por el equipo' },
  ],
  proceso: [
    {
      nombre: 'Ordenar',
      texto:
        'Arquitectura de información: oficinas, eventos, talleres y café en una estructura que se entienda.',
    },
    {
      nombre: 'Diseñar',
      texto: 'Wireframes y diseño en Figma, respetando la línea y las tipografías que ya tenían.',
    },
    {
      nombre: 'Construir',
      texto: 'Desarrollo en Webflow con CMS para espacios, eventos y equipo, y versión móvil completa.',
    },
    {
      nombre: 'Entregar',
      texto: 'El equipo queda con el sitio en sus manos, con acompañamiento puntual cuando lo necesita.',
    },
  ],
  bloques: [
    {
      tipo: 'medio',
      medio: {
        tipo: 'imagen',
        src: `${CASONA}/portada.jpg`,
        ancho: 2080,
        alto: 1028,
        alt: 'Un notebook abierto sobre una mesa, a pleno sol, con la sección «Somos» del sitio de Casona Compañía.',
      },
    },
    {
      tipo: 'seccion',
      titulo: 'Contexto y desafío',
      disposicion: 'lado',
      texto:
        'Casona Compañía es un edificio patrimonial recuperado en el Barrio Yungay, Santiago. Arrienda oficinas, espacios para eventos y talleres, pero se mantiene abierto al barrio, así que tenía que verse profesional y cercano a la vez. Un lugar con tantos usos era difícil de explicar en pocas palabras, y el equipo necesitaba un sitio claro que se pudiera mantener de forma autónoma.',
      medios: [
        {
          tipo: 'imagen',
          src: `${CASONA}/edificio.jpg`,
          ancho: 1592,
          alto: 767,
          alt: 'La fachada de Casona Compañía, una casona de dos pisos blanca con balcones de fierro, entre una casa verde y un árbol.',
        },
      ],
    },
    {
      tipo: 'cita',
      cita: '«La página está muy bien ordenada, se entiende muy bien.\nPor eso derivamos mucho: nos hacen preguntas y ven nuestra página web.»',
      autor: 'Laura Brower, Coordinadora de Comunicaciones, Casona Compañía',
    },
    {
      tipo: 'seccion',
      titulo: 'Antes, casi todas las consultas llegaban por Instagram',
      disposicion: 'arriba',
      texto:
        'El sitio anterior no contaba con acceso directo al formulario de contacto ni a la información de los espacios.',
      medios: [
        {
          tipo: 'captura',
          src: `${CASONA}/sitio-anterior.jpg`,
          ancho: 762,
          alto: 4096,
          alt: 'La página de inicio completa del sitio de Casona Compañía, de arriba abajo: espacios, cafetería, blog y mapa.',
        },
      ],
    },
    {
      tipo: 'seccion',
      titulo: 'Solución',
      disposicion: 'lado',
      texto:
        '1000gracias diseñó y desarrolló el sitio completo en Webflow, con un CMS autogestionable para espacios, eventos y equipo. Cada espacio muestra su tarifario por hora y su disponibilidad en la misma landing. El diseño mantiene la línea minimalista y las tipografías que la Casona ya usaba, con movimiento sutil en GSAP que no le quita legibilidad.',
      medios: [
        {
          tipo: 'imagen',
          src: `${CASONA}/espacios.jpg`,
          ancho: 2082,
          alto: 1039,
          alt: 'La ficha de un espacio del sitio, con su tabla de valores por hora de lunes a jueves y de viernes a domingo.',
          rotulo: 'Espacios',
          leyenda: 'Cada espacio muestra su tarifa por hora y su disponibilidad.',
        },
        {
          tipo: 'imagen',
          src: `${CASONA}/agenda.jpg`,
          ancho: 2081,
          alto: 1039,
          alt: 'La Agenda Cultural del sitio, con tres eventos en tarjetas: fútbol con historia, jazz en la azotea y una feria de upcycling.',
          rotulo: 'Agenda',
          leyenda: 'Una agenda cultural que el equipo actualiza por su cuenta.',
        },
        {
          tipo: 'imagen',
          src: `${CASONA}/contacto.jpg`,
          ancho: 2081,
          alto: 1039,
          alt: 'El formulario «¿Quieres hacer tu evento en Casona Compañía?» junto a una foto de la escalera interior del edificio.',
          rotulo: 'Contacto',
          leyenda: 'Un formulario de cotización que hoy recibe la mayoría de las consultas.',
        },
      ],
    },
    {
      tipo: 'cita',
      cita: '«Tener presencia digital es parte de la marca del espacio: permite dar más detalle e información que las redes sociales.»',
      autor: 'Carlos Olivares, Director, Casona Compañía',
    },
  ],
};

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
    caso: casona,
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
    caso: null,
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
    caso: null,
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
    caso: null,
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
