export function class_names( classes: string, default_class = '' ): string {
	return [ default_class, ...classes.split( ' ' ) ]
		.map( c => c.trim() )
		.filter( Boolean )
		.join( ' ' )
		.trim();
}
