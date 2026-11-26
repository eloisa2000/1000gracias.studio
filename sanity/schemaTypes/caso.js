/*
  Las piezas de la página de caso (/caso/<slug>). El caso vive dentro del
  proyecto, en su pestaña «Caso»: un proyecto sin titular de caso no tiene
  página y en la home sigue enlazando al sitio publicado.
*/

/* Una imagen, un video o una captura larga. Se usa suelta entre los bloques
   y dentro de las secciones. */
export const casoMedio = {
  name: 'casoMedio',
  title: 'Imagen o video',
  type: 'object',
  fields: [
    {
      name: 'tipo',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Imagen', value: 'imagen' },
          { title: 'Video', value: 'video' },
          { title: 'Captura larga (se desplaza sola)', value: 'captura' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'imagen',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'imagen',
      title: 'Imagen',
      description:
        'En un video es el primer cuadro y lo que ve quien pide movimiento reducido. En una captura larga, la página completa de arriba abajo.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) =>
        Rule.custom((imagen, { parent }) =>
          parent?.tipo !== 'video' && !imagen?.asset ? 'Falta la imagen.' : true
        ),
    },
    {
      name: 'video',
      title: 'Video',
      description: 'MP4 en H.264, sin audio y en loop. Que pese menos de 3 MB.',
      type: 'file',
      options: { accept: 'video/mp4' },
      hidden: ({ parent }) => parent?.tipo !== 'video',
      validation: (Rule) =>
        Rule.custom((video, { parent }) =>
          parent?.tipo === 'video' && !video?.asset ? 'Falta el video.' : true
        ),
    },
    {
      name: 'alt',
      title: 'Texto alternativo',
      description: 'Qué se ve, para quien no lo ve. Si es puro adorno, déjalo vacío.',
      type: 'string',
    },
    {
      name: 'rotulo',
      title: 'Rótulo',
      description: 'Abajo a la izquierda, en mayúsculas. Por ejemplo: Espacios.',
      type: 'string',
    },
    {
      name: 'leyenda',
      title: 'Leyenda',
      description: 'Abajo a la derecha, una línea.',
      type: 'string',
    },
  ],
  preview: {
    select: { rotulo: 'rotulo', tipo: 'tipo', alt: 'alt', media: 'imagen' },
    prepare: ({ rotulo, tipo, alt, media }) => ({
      title: rotulo || alt || 'Sin rótulo',
      subtitle: { imagen: 'Imagen', video: 'Video', captura: 'Captura larga' }[tipo] ?? tipo,
      media,
    }),
  },
};

/* Título, texto y, debajo, las imágenes que lo acompañan. */
export const casoSeccion = {
  name: 'casoSeccion',
  title: 'Sección',
  type: 'object',
  fields: [
    { name: 'titulo', title: 'Título', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'texto',
      title: 'Texto',
      description: 'Una línea en blanco separa párrafos.',
      type: 'text',
      rows: 5,
    },
    {
      name: 'disposicion',
      title: 'Disposición',
      type: 'string',
      options: {
        list: [
          { title: 'Título al lado del texto', value: 'lado' },
          { title: 'Título arriba del texto', value: 'arriba' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'lado',
    },
    { name: 'medios', title: 'Imágenes y videos', type: 'array', of: [{ type: 'casoMedio' }] },
  ],
  preview: {
    select: { title: 'titulo', subtitle: 'texto', media: 'medios.0.imagen' },
  },
};

/* Cita destacada, en el bloque azul a todo el ancho. */
export const casoCita = {
  name: 'casoCita',
  title: 'Cita',
  type: 'object',
  fields: [
    {
      name: 'cita',
      title: 'Cita',
      description: 'Con las comillas «». Un salto de línea se respeta.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'autor',
      title: 'Quién lo dice',
      description: 'Nombre, cargo y organización.',
      type: 'string',
    },
  ],
  preview: {
    select: { title: 'cita', subtitle: 'autor' },
  },
};

/* El caso completo. La columna azul (titular, ficha y proceso) queda fija en
   escritorio; los bloques son la columna que se desplaza. */
export const caso = {
  name: 'caso',
  title: 'Caso',
  type: 'object',
  fields: [
    {
      name: 'titular',
      title: 'Titular',
      description: 'Sin titular el proyecto no tiene página de caso.',
      type: 'string',
    },
    { name: 'bajada', title: 'Bajada', type: 'text', rows: 2 },
    {
      name: 'ficha',
      title: 'Ficha',
      description: 'Las filas de arriba: cliente, año, rubro, servicios, entrega…',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'filaFicha',
          fields: [
            { name: 'etiqueta', title: 'Etiqueta', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'valor', title: 'Valor', type: 'string', validation: (Rule) => Rule.required() },
          ],
          preview: { select: { title: 'etiqueta', subtitle: 'valor' } },
        },
      ],
    },
    {
      name: 'proceso',
      title: '¿Cómo se hizo?',
      description: 'Los pasos se numeran solos, en este orden.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'paso',
          fields: [
            { name: 'nombre', title: 'Paso', description: 'Por ejemplo: Ordenar.', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'texto', title: 'Qué se hizo', type: 'text', rows: 2 },
          ],
          preview: { select: { title: 'nombre', subtitle: 'texto' } },
        },
      ],
    },
    {
      name: 'bloques',
      title: 'Contenido',
      description: 'La columna que se desplaza, de arriba abajo.',
      type: 'array',
      of: [{ type: 'casoMedio' }, { type: 'casoSeccion' }, { type: 'casoCita' }],
    },

    /* El pie del caso: créditos, siguiente proyecto y contacto. */
    {
      name: 'creditos',
      title: 'Créditos',
      description: 'Quién hizo qué, aparte de 1000gracias. Por ejemplo: Fotografía · Casona Compañía.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'credito',
          fields: [
            { name: 'etiqueta', title: 'Qué', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'valor', title: 'Quién', type: 'string', validation: (Rule) => Rule.required() },
          ],
          preview: { select: { title: 'etiqueta', subtitle: 'valor' } },
        },
      ],
    },
    {
      name: 'siguiente',
      title: 'Siguiente proyecto',
      description: 'Si lo dejas vacío, va el que sigue en el orden de la home.',
      type: 'reference',
      to: [{ type: 'project' }],
    },
    {
      name: 'pregunta',
      title: 'Pregunta del contacto',
      description: 'La que invita a escribir, al final del caso.',
      type: 'string',
    },
    {
      name: 'boton',
      title: 'Botón del contacto',
      type: 'string',
      initialValue: 'Escríbenos',
    },
  ],
};
