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
          'red': '#FB2F1F',
          'green': '#13913C',
          'blue': '#24C5E7',
          'purple': '#A584A4',

        },
      },
      transitionProperty: {
        'blur': 'filter',
      },
      blur: {
        xs: '2px',
        xxs: '1px',
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
