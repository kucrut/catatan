<script lang="ts">
	import Button from './button.svelte';
	import { get_store } from '$stores';

	export let title: string;
	export let id: string;

	const ui = get_store( 'ui' );
	let is_expanded = $ui.open_panels.includes( id );

	$: icon = is_expanded ? 'arrow-up' : 'arrow-down';

	function handle_click_button(): void {
		is_expanded = ! is_expanded;

		ui.update( ( { open_panels, ...rest } ) => ( {
			...rest,
			open_panels: is_expanded ? [ ...open_panels, id ] : open_panels.filter( i => i !== id ),
		} ) );
	}
</script>

<div class="components-panel">
	<div class="components-panel__body" class:is-opened={is_expanded}>
		<h2 class="components-panel__body-title">
			<Button
				{icon}
				aria-expanded={is_expanded}
				class="components-panel__body-toggle"
				icon_class="components-panel__arrow"
				on:click={handle_click_button}
			>
				{title}
			</Button>
		</h2>
		<div class="components-panel__content" class:hidden={! is_expanded}>
			<slot />
		</div>
	</div>
</div>
