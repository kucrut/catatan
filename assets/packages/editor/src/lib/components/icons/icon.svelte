<script lang="ts">
	import paths from './paths.json';
	let cls = '';

	export let icon: string;
	export let height = 24;
	export let width = 24;
	export let viewBox = `0 0 ${ width } ${ height }`;
	export { cls as class };
</script>

<svg
	{width}
	{height}
	{viewBox}
	aria-hidden="true"
	class={cls}
	focusable="false"
	xmlns="http://www.w3.org/2000/svg"
	{...$$restProps}
>
	{#each paths[ icon ] as path_props}
		<path {...path_props} />
	{/each}
</svg>
