export const project = {
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Orden en la home',
      description: 'Número más chico = más arriba en la lista.',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1),
    },
    { name: 'year', title: 'Año', type: 'string' },
    {
      name: 'type',
      title: 'Tipo de organización',
      description: 'Por ejemplo: Espacio cultural, Cooperativa, ONG.',
      type: 'string',
    },
    {
      name: 'hoverImage',
      title: 'Imagen del escenario (hover)',
      description: 'La que reemplaza la imagen del hero al pasar por el proyecto. Vertical.',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Texto alternativo', type: 'string' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'hoverVideo',
      title: 'Video del escenario (hover)',
      description:
        'Si lo hay, reemplaza a la imagen del escenario al pasar por el proyecto. MP4 vertical, corto y en loop. Que pese menos de 3 MB: es lo que se descarga al pasar el mouse. La imagen de arriba se usa igual, como primer cuadro y para quien pide movimiento reducido.',
      type: 'file',
      options: { accept: 'video/mp4' },
    },
    {
      name: 'coverImage',
      title: 'Portada',
      description: 'Miniatura y portada de la futura página de proyecto.',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Texto alternativo', type: 'string' }],
    },
    {
      name: 'excerpt',
      title: 'Bajada',
      description: 'Dos o tres líneas de contexto.',
      type: 'text',
      rows: 3,
    },
    {
      name: 'tools',
      title: 'Herramientas',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    { name: 'liveUrl', title: 'Sitio publicado', type: 'url' },
    {
      name: 'body',
      title: 'Cuerpo',
      description: 'Para la futura página del proyecto.',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'gallery',
      title: 'Galería',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', title: 'Texto alternativo', type: 'string' }],
        },
      ],
    },
    {
      name: 'credits',
      title: 'Crédito de imágenes',
      type: 'string',
    },
  ],
  orderings: [
    {
      title: 'Orden en la home',
      name: 'ordenHome',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'type', media: 'coverImage' },
  },
};
