export interface URLParams {
	[ key: string ]: string;
}

export function generate_url( url: string, params: URLParams ): string {
	const url_object = new URL( url );

	Object.entries( params ).forEach( ( [ key, value ] ) => {
		url_object.searchParams.append( key, value );
	} );

	return url_object.toString();
}
