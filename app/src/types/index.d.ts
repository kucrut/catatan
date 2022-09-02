import type { WP_REST_API_Attachment as Attachment } from 'wp-types';

// See https://stackoverflow.com/a/54827898
export type BetterOmit< T, K extends PropertyKey > = { [ P in keyof T as Exclude< P, K > ]: T[ P ] };

export type MapToBoolean< O > = {
	[ K in keyof O as K ]: boolean;
};

export interface Config {
	edit_link: string;
	editor_id: string;
	media_rest_route: string;
	post_id: number;
	post_list_url: string;
	post_rest_route: string;
	post_type: string;
	post_type_rest_route: string;
}

export interface SelectControlOption {
	label: string;
	value: string | number;
}

export type WP_Media_Orientation = 'landscape' | 'portrait';

export interface WP_Media_Size {
	height: number;
	width: number;
	url: string;
	orientation: WP_Media_Orientation;
}

export interface WP_Media {
	alt: string;
	author: string;
	authorLink: string;
	authorName: string;
	caption: string;
	context: string;
	date: string;
	dateFormatted: string;
	description: string;
	editLink: string;
	filename: string;
	filesizeHumanReadable: string;
	filesizeInBytes: number;
	height: number;
	icon: string;
	id: number;
	link: string;
	menuOrder: number;
	meta: boolean;
	mime: string;
	modified: string;
	name: string;
	orientation: WP_Media_Orientation;
	originalImageName: string;
	originalImageURL: string;
	status: string;
	subtype: string;
	title: string;
	type: string;
	uploadedTo: number;
	uploadedToLink: string;
	uploadedToTitle: string;
	url: string;
	width: number;
	compat?: {
		item: string;
		meta: string;
	};
	nonces?: {
		update?: string;
		delete?: string;
		edit?: string;
	};
	sizes: {
		full: WP_Media_Size;
		large?: WP_Media_Size;
		medium?: WP_Media_Size;
		thumbnail?: WP_Media_Size;
		[ k: string ]: WP_Media_Size;
	};
}

export interface WP_REST_API_Media_Size extends BetterOmit< WP_Media_Size, 'url' > {
	file: string;
	filesize: number;
	source_url: string;
	mime_type: string;
}

export interface WP_REST_API_Media_Details {
	file: string;
	filesize: number;
	height: number;
	original_image: string;
	width: number;
	sizes: {
		full: WP_REST_API_Media_Size;
		large?: WP_REST_API_Media_Size;
		medium?: WP_REST_API_Media_Size;
		thumbnail?: WP_REST_API_Media_Size;
		[ k: string ]: WP_REST_API_Media_Size;
	};
}

export interface WP_REST_API_Media extends BetterOmit< Attachment, 'media_details' > {
	media_details: WP_REST_API_Media_Details;
}

declare global {
	interface Window {
		catatanEditor: Config;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		wp: Record< string, any >;
	}
}

export {};
