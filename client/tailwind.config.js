const { teal, black, white, gray, red } = require('tailwindcss/colors');

module.exports = {
	purge: ['./src/**/*.tsx'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		colors: {
			teal,
			black,
			white,
			gray,
			red
		},
		extend: {}
	},
	variants: {
		extend: {
			opacity: ['disabled']
		}
	},
	plugins: []
};
