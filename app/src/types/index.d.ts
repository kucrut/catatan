// See https://stackoverflow.com/a/54827898
export type BetterOmit< T, K extends PropertyKey > = { [ P in keyof T as Exclude< P, K > ]: T[ P ] };

export type MapToBoolean< O > = {
	[ K in keyof O as K ]: boolean;
};

export interface Config {
	edit_link: string;
	editor_id: string;
	post_id: number;
	post_list_url: string;
	post_rest_path: string;
	post_type: string;
	post_type_rest_path: string;
}

export interface SelectControlOption {
	label: string;
	value: string | number;
}

export interface TokenItem {
	description: string;
	id: number | string;
	label: string;
}

declare global {
	interface Window {
		catatanEditor: Config;
	}
}

export {};
