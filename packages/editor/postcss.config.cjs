module.exports = {
	plugins: [
		require( 'postcss-import' ),
		require( 'postcss-url' ),
		require( 'postcss-custom-properties' ),
		require( 'postcss-nested' ),
		require( 'postcss-flexbugs-fixes' ),
		require( 'autoprefixer' ),
	],
};
