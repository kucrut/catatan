// See https://stackoverflow.com/a/54827898
export type BetterOmit< T, K extends PropertyKey > = { [ P in keyof T as Exclude< P, K > ]: T[ P ] };

export interface Config {
	edit_link_template: string;
	editor_id: string;
	l10n: Record< string, string >;
	nonce: string;
	post_id: number;
	post_type: string;
	rest_path: string;
	rest_url: string;
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
