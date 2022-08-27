<script lang="ts">
	import Notice from './notice.svelte';
	import Snackbar from './snackbar.svelte';
	import { get_store } from '$lib/stores';

	const notices = get_store( 'notices' );

	$: dismissibles = $notices.filter( ( { dismissible, type } ) => dismissible && type !== 'snack' );
	$: snacks = $notices.filter( ( { type } ) => type === 'snack' );
</script>

{#if $notices.length}
	<div class="interface-interface-skeleton__notices">
		{#if dismissibles.length}
			<div class="components-notice-list components-editor-notices__dismissible">
				{#each dismissibles as item}
					<Notice {item} />
				{/each}
			</div>
		{/if}
		{#if snacks.length}
			<div class="components-snackbar-list components-editor-notices__snackbar" tabindex="-1">
				<div class="components-snackbar-list__notice-container">
					{#each snacks as item}
						<Snackbar {item} />
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}
