import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes/index.js';

// Reemplaza por el id del proyecto de Sanity (el mismo de SANITY_PROJECT_ID).
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'mil-gracias',
  title: '1000gracias',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            S.listItem()
              .title('Ajustes del sitio')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('project').title('Proyectos'),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
  document: {
    // El singleton no se puede duplicar ni borrar desde el estudio.
    actions: (prev, { schemaType }) =>
      schemaType === 'siteSettings'
        ? prev.filter(({ action }) => !['duplicate', 'delete', 'unpublish'].includes(action))
        : prev,
  },
});
