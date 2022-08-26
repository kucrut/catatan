import api_fetch from '@wordpress/api-fetch';
import App from './App.svelte';

const { editor_id, nonce, rest_url, ...rest_config } = window.catatanEditor;

api_fetch.use( api_fetch.createRootURLMiddleware( rest_url ) );
api_fetch.use( api_fetch.createNonceMiddleware( nonce ) );

const app = new App( {
	target: document.getElementById( editor_id ),
	props: { config: rest_config },
} );

export default app;
