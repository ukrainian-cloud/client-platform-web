#!/bin/env node

const { argv, exit } = require('node:process');

const importBase = '@ukrainian-cloud/platform-web/cli/';

/**
 * @template {Record<string, never>} T
 * @arg {string[]} args
 * @arg {import('./cli').CheckFunc<T>} check
 * @arg {import('./cli').ArgParsers<T>} argParsers
 * @arg {import('./cli').ArgMap<T>} argMap
 */
function parseArgs(args, check, argParsers, argMap) {
	/** @type T */
	const res = {};
	let skipNext = false;
	args.forEach((v, i) => {
		if (skipNext) {
			skipNext = false;
			return;
		}
		if (v in argMap) {
			skipNext = true;
			res[argMap[v]] = argParsers[argMap[v]](args[i + 1] || '');
		}
	});
	check(res);
	return res;
}

/**
 * @arg {string} name
 * @return {Promise<() => Promise<void>>}
 */
async function getCLIScript(name) {
	const { argParsers, argMap, checkArgs, default: runScript } = await import(importBase + name + '.mjs');
	const args = parseArgs(argv.slice(3), checkArgs, argParsers, argMap);
	return runScript.bind(null, args);
}

async function main() {
	let runScript;
	const isDebug = argv[3] === '--debug';
	try {
		runScript = await getCLIScript(argv[2]);
	} catch(e) {
		console.warn(
			"Couldn't find the command " + JSON.stringify(argv[2]) + (
				isDebug ? '' : '. Pass --debug right after the command to see the original error'
			)
		);
		if (isDebug) console.warn(e);
		exit(1);
	}
	try {
		await runScript();
	} catch(e) {
		console.warn(isDebug ? e : (e.message + '. Pass --debug right after the command to see the stacktrace'));
		exit(1);
	}
}

main();
