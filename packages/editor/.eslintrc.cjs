module.exports = {
	root: true,
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:@wordpress/eslint-plugin/custom',
		'plugin:@wordpress/eslint-plugin/esnext',
		'plugin:@wordpress/eslint-plugin/jsdoc',
	],
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	globals: {
		BufferEncoding: false,
		NodeJS: false,
	},
	overrides: [ { files: [ '*.html', '*.svelte' ], processor: 'svelte3/svelte3' } ],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
	},
	plugins: [ 'svelte3', '@typescript-eslint' ],
	settings: {
		'svelte3/ignore-styles'() {
			return true;
		},
		'svelte3/typescript': () => require( 'typescript' ),
	},
	rules: {
		'arrow-parens': [ 'error', 'as-needed' ],
		'camelcase': 'off',
		// See https://github.com/sveltejs/eslint-plugin-svelte3/issues/41
		'no-multiple-empty-lines': [
			'error',
			{
				max: 2,
				maxBOF: 2,
				maxEOF: 1,
			},
		],
		'quote-props': [ 'error', 'consistent' ],
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'always',
				named: 'never',
				asyncArrow: 'always',
			},
		],
	},
};
