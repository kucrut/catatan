import App from './App.svelte';

const { editor_id, ...rest_config } = window.catatanEditor;

const app = new App( {
	target: document.getElementById( editor_id ),
	props: { config: rest_config },
} );

export default app;
