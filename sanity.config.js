import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './studio/index'
import {media} from 'sanity-plugin-media'

const singletonListItem = (S, typeName, title) =>
  S.listItem()
    .title(title || typeName)
    .id(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName))

const singletonActions = new Set(["publish", "discardChanges", "restore"])
const singletonTypes = new Set(["site", "read", "listen"])

const structure = (S) => 
  S.list()
    .id("conent")
    .title("Content")
    .items([
      singletonListItem(S, "site", "Site"),
      singletonListItem(S, "read", "Read"),
      singletonListItem(S, "listen", "Listen")
    ])

export default defineConfig({
  name: 'default',
  title: 'Dist',
  projectId: '6gim9zt5',
  dataset: 'production',

  plugins: [
    structureTool({ structure: structure }), 
    visionTool(),
    media()
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
