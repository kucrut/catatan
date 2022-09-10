# Catatan

Simple post editor for WordPress using [TipTap](https://tiptap.dev) built with [Svelte](https://svelte.dev).

This is **alpha software**. There's no warranty whatsoever. Use it at your own risk :wink:

## Installation

1. Install via composer: `composer require kucrut/catatan`
1. Activate the plugin.
1. Go to Settings > Writing, scroll down to "Catatan" section, and tick the post types you want to edit with Catatan. Save the changes.

## Developing

1. Make sure you have PHP 7.4+ and composer installed, as well as Nodejs 16+ and [pnpm](https://pnpm.io).
1. Clone this repository onto your `wp-content/plugins` directory.
1. Install composer dependencies: `composer install`
1. Install JS dependencies: `pnpm install`
1. `pnpm dev`

## License

This plugin is released under GPLv2. All dependencies retain their original linceses.
