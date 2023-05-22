import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'tsup';

const cliCommands: string[] = [];

for (const dirent of readdirSync(resolve('src', 'cli'), { withFileTypes: true })) {
	if (dirent.isFile() && dirent.name.endsWith('.ts')) {
		cliCommands.push('src/cli/' + dirent.name);
	}
}

export default defineConfig({
	entry: cliCommands,
	format: ['esm'],
	sourcemap: false,
	clean: false,
	dts: false,
	outDir: 'dist/cli',
	minify: true,
	minifyWhitespace: true,
	minifySyntax: true,
	minifyIdentifiers: true,
	outExtension: () => ({
		js: '.mjs',
	}),
});
