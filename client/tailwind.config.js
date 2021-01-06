const { teal, black, white, blueGray, red } = require('tailwindcss/colors');

module.exports = {
	purge: ['./src/**/*.tsx'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		colors: {
			teal,
			black,
			white,
			gray: blueGray,
			red
		},
		extend: {
			fontFamily: {
				poppins: "Poppins, 'sans-serif', ui-sans-serif, system-ui"
			}
		}
	},
	variants: {
		extend: {
			opacity: ['disabled']
		}
	},
	plugins: []
};
