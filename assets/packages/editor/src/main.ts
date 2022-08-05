import App from './App.svelte';

const app = new App( {
	target: document.getElementById( window.catatanEditor.editor_id ),
	props: { config: window.catatanEditor },
} );

export default app;
