export function get_draft_stati(): string[] {
	return [ 'auto-draft', 'draft' ];
}

export function is_draft( status: string ): boolean {
	return get_draft_stati().includes( status );
}
