import { defineHastPlugin } from 'satteri';

export const external = { target: '_blank', rel: 'noopener' } as const;
export const newTab = ' (öppnas i ny flik)';

// Rich-text links to other sites open in a new tab.
export const externalLinks = defineHastPlugin({
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties.href;
      if (typeof href !== 'string' || !/^https?:\/\//.test(href)) return;
      for (const [key, value] of Object.entries(external)) ctx.setProperty(node, key, value);
      ctx.appendChild(node, {
        type: 'element',
        tagName: 'span',
        properties: { className: ['sr-only'] },
        children: [{ type: 'text', value: newTab }],
      });
    },
  },
});
