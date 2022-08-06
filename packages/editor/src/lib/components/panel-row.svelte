<script lang="ts">
	export let is_expanded = false;
</script>

<div class="components-panel__row" class:hidden={! is_expanded}>
	<slot />
</div>
