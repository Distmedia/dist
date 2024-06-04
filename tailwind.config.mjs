/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
      fontFamily: {
        'karlst': ['"KarlST"', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        'base': {
          'red': '#FF0000',
        },
      },
      transitionProperty: {
        'blur': 'filter',
      },
      blur: {
        xs: '2px',
      },
    },
	},
  plugins: [
    plugin(function({addVariant}) {
      addVariant('theme-red', '.theme.theme--red &')
      addVariant('theme-green', '.theme.theme--green &')
      addVariant('theme-blue', '.theme.theme--blue &')
      addVariant('theme-purple', '.theme.theme--purple &')
    })
  ],
}
