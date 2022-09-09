<script lang="ts">
	import BaseControl from './base-control.svelte';

	export let id: string;
	export let label: string;
	export let value: string;
</script>

<BaseControl {id} {label}>
	<textarea {id} {value} class="components-textarea-control__input " rows="4" on:input />
	<slot name="help" slot="help" />
</BaseControl>

<style>
	textarea {
		width: 100%;
	}
</style>
