<script lang="ts">
	import { getContext } from 'svelte';
	import Notice from './notice.svelte';
	import type { NoticesStore } from '$lib/stores/notices';

	const notices = getContext< NoticesStore >( 'notices' );

	$: dismissible_items = $notices.filter( ( { dismissible } ) => dismissible );
</script>

{#if $notices.length}
	<div class="interface-interface-skeleton__notices">
		{#if dismissible_items.length}
			<div class="components-notice-list components-editor-notices__dismissible">
				{#each dismissible_items as item}
					<Notice {item} />
				{/each}
			</div>
		{/if}
	</div>
{/if}
