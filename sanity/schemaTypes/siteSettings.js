export const siteSettings = {
  name: 'siteSettings',
  title: 'Ajustes del sitio',
  type: 'document',
  fields: [
    {
      name: 'heroImage',
      title: 'Imagen del escenario (por defecto)',
      description: 'La que se ve al cargar la home, antes de pasar por un proyecto. Vertical.',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Texto alternativo', type: 'string' }],
    },
    {
      name: 'contactImage',
      title: 'Imagen del contacto',
      description: 'La que va dentro de la forma festoneada, en el bloque rojo.',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Texto alternativo', type: 'string' }],
    },
    { name: 'email', title: 'Correo', type: 'string' },
    { name: 'instagram', title: 'Instagram', type: 'url' },
    { name: 'folioUrl', title: 'Folio', type: 'url' },
  ],
  preview: {
    prepare: () => ({ title: 'Ajustes del sitio' }),
  },
};
