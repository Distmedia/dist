/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
      fontFamily: {
        'karlst': ['"KarlST"', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        'karlst': {
          green: '#FF0000',
        },

      },
      transitionProperty: {
        'blur': 'filter',
      },
      blur: {
        xs: '2px',
      }
    },
	},
	plugins: [],
}
