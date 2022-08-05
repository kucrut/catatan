<script lang="ts">
	import Button from './button.svelte';
	import Icon from './icons/icon.svelte';
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
				aria-expanded={is_expanded}
				class="components-button components-panel__body-toggle"
				on:click={handle_click_button}
			>
				<span aria-hidden="true"><Icon {icon} class="components-panel__arrow" /></span>
				{title}
			</Button>
		</h2>
		<slot {is_expanded} />
	</div>
</div>
