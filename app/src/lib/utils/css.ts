export function class_names( classes: string, default_class = '' ) {
	return [ default_class, ...classes.split( ' ' ) ]
		.map( c => c.trim() )
		.filter( Boolean )
		.join( ' ' )
		.trim();
}
