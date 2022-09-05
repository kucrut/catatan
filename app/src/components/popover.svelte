<script lang="ts">
	export let animate: null | 'appear' = null;
	export let is_from_center = false;
	export let is_from_top = false;
	export let is_without_arrow = false;

	const class_prefix = 'components-popover';
</script>

<div
	class={class_prefix}
	tabindex="-1"
	class:components-animate__appear={animate === 'appear'}
	class:is-from-center={is_from_center}
	class:is-from-top={is_from_top}
	class:is-without-arrow={is_without_arrow}
>
	<div class="{class_prefix}__content">
		<slot />
	</div>
</div>

<style>
	.components-popover {
		top: 25%;
		left: 50%;
		transform: translate( 50%, -50% );
		opacity: unset;
		display: grid;
		place-items: center;
	}
</style>
