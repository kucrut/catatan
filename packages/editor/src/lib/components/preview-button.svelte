<script lang="ts">
	import { getContext } from 'svelte';
	import Button from './button.svelte';
	import Icon from './icons/icon.svelte';
	import type { Config } from '$types';
	import type { EditorStore } from '$lib/stores/editor';

	const editor = getContext< EditorStore >( 'editor' );
	const l10n = getContext< Config[ 'l10n' ] >( 'l10n' );

	$: cls = 'editor-post-publish-button__button';
	$: is_disabled = ! $editor.data.id;

	function get_url() {
		const url = new URL( $editor.data.link.toString() );
		url.searchParams.append( 'preview', 'true' );

		return url.toString();
	}
</script>

{#if is_disabled}
	<Button is_tertiary aria-disabled={is_disabled} class={cls} disabled={is_disabled}
		>{l10n.preview} <Icon icon="external" /></Button
	>
{:else}
	<a class="components-button is-tertiary" href={get_url()} target="_blank">{l10n.preview} <Icon icon="external" /></a>
{/if}
