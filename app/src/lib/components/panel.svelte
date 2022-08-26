<script lang="ts">
	import Button from './button.svelte';
	export let title: string;

	let is_expanded = false;
	$: icon = is_expanded ? 'arrow-up' : 'arrow-down';

	function handle_click_button() {
		is_expanded = ! is_expanded;
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
