// See https://stackoverflow.com/a/54827898
export type BetterOmit< T, K extends PropertyKey > = { [ P in keyof T as Exclude< P, K > ]: T[ P ] };

export type MapToBoolean< O > = {
	[ K in keyof O as K ]: boolean;
};

export interface Config {
	edit_link_template: string;
	editor_id: string;
	nonce: string;
	post_id: number;
	post_list_url: string;
	post_type: string;
	rest_url: string;
}

declare global {
	interface Window {
		catatanEditor: Config;
	}
}

export {};