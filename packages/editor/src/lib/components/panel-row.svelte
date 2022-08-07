<script lang="ts">
	let cls = 'components-panel__row';
	export { cls as class };
	export let is_expanded = false;
</script>

<div class={cls} class:hidden={! is_expanded}>
	<slot />
</div>
