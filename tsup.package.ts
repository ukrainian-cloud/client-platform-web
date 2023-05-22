import { defineConfig } from 'tsup';
import { sassPlugin, postcssModules } from 'esbuild-sass-plugin';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['cjs', 'esm'],
	sourcemap: true,
	clean: false,
	dts: true,
	outDir: 'dist',
	esbuildPlugins: [
		sassPlugin({
			filter: /\.module\.s[ac]ss$/,
			transform: postcssModules({}),
		}),
		sassPlugin({
			filter: /\.s[ac]ss$/,
		}),
	],
	minify: true,
	minifyWhitespace: true,
	minifySyntax: true,
	minifyIdentifiers: true,
	external: ['preact', 'dev-only:preact/debug'],
	noExternal: ['@ukrainian-cloud/utils'],
});
