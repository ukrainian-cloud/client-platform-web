import { resolve, relative } from 'node:path';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { exit, env } from 'node:process';
import firebaseConfig from './@/firebase.config';
import viteConfig from './@/vite.config';
import tsconfig from './@/ts.config';
import { runCmd } from './@/run-cmd';
import type { ArgParsers, ArgMap, CheckFunc } from '../../cli';

interface HTMLConfig extends Record<string, unknown> {
	lang?: string;
}

interface Args {
	input: string;
	output: string;
	options?: {
		htmlConfig?: HTMLConfig;
	};
}

export const argParsers: ArgParsers<Args> = {
	input: (next) => next,
	output: (next) => next,
	options: (next) => JSON.parse(next),
};

export const argMap: ArgMap<Args> = {
	'-i': 'input',
	'--input': 'input',
	'-o': 'output',
	'--output': 'output',
	'--options': 'options',
};

export const checkArgs: CheckFunc<Args> = (args) => {
	if (!args.input) {
		console.warn('Input should be specified either with -i or with --input');
		exit(1);
	}
	if (!args.output) {
		console.warn('Output should be specified either with -o or with --output');
		exit(1);
	}
}

function serializeShellArg(arg: string) {
	return '"' + arg.replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll('$', '\\$') + '"';
}

function buildCmd(outDir: string, viteConfig: string, logLevel: string) {
	function vite(...args: string[]) {
		return `vite ${args.map(serializeShellArg).join(' ')}`
	}
	return vite('build', '-l', logLevel, '-d', '-c', viteConfig, '--emptyOutDir', '--outDir', outDir);
}

function readLines(readable: import('stream').Readable, callback: (line: string) => void) {
	let unfinishedLine = ''
	readable.on('data', (chunk) => {
		const lines = Buffer.from(chunk).toString('utf8').split('\n')
		const lastLine = lines.pop()
		lines.forEach((line, i) => callback(!i ? unfinishedLine + line : line))
		unfinishedLine = lastLine || ''
	})
	readable.on('close', () => {
		if (unfinishedLine) callback(unfinishedLine)
	})
}

export default async ({ input, output, options }: Args) => {
	const tmpDir = await mkdtemp(resolve(tmpdir(), 'ukrainian-cloud-client-builder-web-'));
	const outDir = resolve(output);

	const dirRelationPrefix = relative(tmpDir, resolve()) + '/';

	console.log('Temp dir:', tmpDir);

	const htmlFile = resolve(tmpDir, 'index.html');

	await Promise.all([
		writeFile(
			htmlFile,
			`<!DOCTYPE html>\n<html lang="${
				options?.htmlConfig?.lang ?? 'uk'
			}"><head><title></title></head><body><script type="module" src="${
				relative(tmpDir, input)
			}"></script></body></html>`,
		),
		writeFile(
			resolve(tmpDir, 'vite.config.cjs'),
			viteConfig(),
		),
		writeFile(
			resolve(tmpDir, 'tsconfig.json'),
			tsconfig(),
		),
	]);

	const { stdout: builderStdout, stderr: builderStderr, process: builderProcess } = await runCmd(
		'sh',
		[
			'-c',
			buildCmd(outDir, resolve(tmpDir, 'vite.config.cjs'), 'info'),
		],
		{
			...env,
			UC_HTML_CONFIG: JSON.stringify(options?.htmlConfig || {}),
			UC_HTML_FILE: htmlFile,
		},
	);

	readLines(builderStdout, (line) => console.log(line.replaceAll(dirRelationPrefix, '')));
	readLines(builderStderr, (line) => console.warn(line.replaceAll(dirRelationPrefix, '')));

	const { code: builderExitCode } = await builderProcess;

	if (builderExitCode) return;

	await writeFile(
		resolve(outDir, 'firebase.json'),
		firebaseConfig(),
	);
}
