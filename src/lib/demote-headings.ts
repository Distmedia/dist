import { defineMdastPlugin } from 'satteri';

// Every page owns its h1, so rich-text headings shift one level down.
export const demoteHeadings = defineMdastPlugin({
  name: 'demote-headings',
  heading(node, ctx) {
    ctx.setProperty(node, 'depth', Math.min(node.depth + 1, 6) as typeof node.depth);
  },
});
