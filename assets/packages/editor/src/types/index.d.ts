export interface Config {
	editor_id: string;
	l10n: Record< string, string >;
	post_id: number;
}

export interface UiState {
	is_sidebar_open: boolean;
}

declare global {
	interface Window {
		catatanEditor: Config;
	}
}

export {};
