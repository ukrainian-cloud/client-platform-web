import { readFile, writeFile } from 'fs/promises';
import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['vite.config.ts'],
	format: ['cjs'],
	sourcemap: false,
	clean: false,
	dts: false,
	outExtension: () => ({
		js: '.js',
	}),
	outDir: 'dist',
	external: ['vite'],
	minify: false,
	//minifyWhitespace: true,
	//minifySyntax: true,
	//minifyIdentifiers: true,
	async onSuccess() {
		const configSrc = await readFile('dist/vite.config.js', 'utf8');
		await writeFile('src/cli/@/vite.config.ts', `export default () => ${JSON.stringify(configSrc)};`);
	},
});
