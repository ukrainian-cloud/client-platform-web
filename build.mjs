#!/usr/bin/env zx
/// <reference types="zx/globals" />
// @ts-check

import { relative, resolve } from 'node:path'
import JSON5 from 'json5'
import packageJson from './package.json' assert { type: 'json' }

// -------------------------------------------------- CONSTANTS --------------------------------------------------- \\

const distDir = resolve('dist')

const prefixes = preparePrefixes({
	app: chalk.greenBright('full package'),
	platform: chalk.yellowBright('platform'),
	tsconfig: chalk.blue('tsconfig.json'),
	viteConfig: chalk.cyan('vite.config.ts'),
	packageJson: chalk.magenta('package.json'),
	cli: chalk.red('CLI'),
	static: chalk.white('static files'),
})

const tsconfigBuildDest = resolve('src/cli/@/ts.config.ts')
const viteConfigBuildDest = resolve('src/cli/@/vite.config.ts')

// --------------------------------------------------- HELPERS ---------------------------------------------------- \\

/**
 * @template {Record<string, string>} T
 * @arg {T} prefixes
 */
function preparePrefixes(prefixes) {
	let longestPrefix = 0
	for (const i in prefixes) if (prefixes[i].length > longestPrefix) longestPrefix = prefixes[i].length
	// @ts-ignore
	for (const i in prefixes) prefixes[i] = prefixes[i].padEnd(longestPrefix, ' ') + ' |'
	return prefixes
}

/**
 * @arg {import('stream').Readable} readable
 * @arg {(line: string) => void} callback
 */
function readLines(readable, callback) {
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

/**
 * @arg {string} config
 * @arg {string=} prefix
 */
async function tsup(config, prefix) {
	const start = Date.now()
	const process = $`tsup --config=${config}`.quiet()
	if (prefix) {
		readLines(process.stdout, (line) => {
			const unprefixedLine = line.replace(/^\S* /, '')
			if (unprefixedLine.match(/^tsup v/)) {
				console.log(`${prefix} ${unprefixedLine} started in ${Date.now() - start}ms`)
				return
			}
			const filewriteresults = /^(.*) (\d+(\.\d+)? [GMK]B)$/.exec(unprefixedLine);
			if (filewriteresults) {
				const [, file, size] = filewriteresults;
				console.log(`${prefix} ${chalk.bold(file)} ${chalk.green(size)}`)
			}
		})
	}
	readLines(process.stderr, (line) => console.error(line))
	await process
}

/**
 * @arg {any} from
 * @arg {any} to
 */
function recursivelyAssign(from, to) {
	for (const i in from) {
		if (i in to) {
			if (typeof to[i] === 'object' && typeof from[i] === 'object') {
				recursivelyAssign(from[i], to[i])
			}
		} else {
			to[i] = from[i]
		}
	}
}

/** @arg {string} configPath */
async function resolveTsconfigRecursively(configPath) {
	const config = await JSON5.parse(await fs.readFile(configPath, 'utf8'))
	if (!config.extends) return config
	const extendedConfig = await resolveTsconfigRecursively(resolve(configPath, '..', config.extends))
	recursivelyAssign(extendedConfig, config)
	delete config.extends
	return config
}

/** @arg {number} bytes */
function toKB(bytes) {
	return Math.floor(bytes * 100 / 1024) / 100
}

/**
 * @arg {string} prefix
 * @arg {string} file
 * @arg {number} size
 */
function notifyFileResult(prefix, file, size) {
	echo `${prefix} ${chalk.bold(relative(resolve('.'), file))} ${chalk.green(toKB(size) + ' KB')}`
}

/**
 * @template {(...args: any[]) => Promise<any | void>} T
 * @arg {string} name
 * @arg {T} implementation
 * @returns {T}
 */
function buildFunction(name, implementation) {
	// @ts-ignore
	return async (...args) => {
		const start = Date.now()
		echo `${name} Build start`
		const res = await implementation(...args)
		echo `${name} ⚡️ Build success in ${Date.now() - start}ms`
		return res
	}
}

const buildTsconfig = buildFunction(prefixes.tsconfig, (
	/** @arg {string} outFile */
	async (outFile) => {
		const resolvedConfig = await resolveTsconfigRecursively(resolve('tsconfig.json'))
		const text = 'export default () => JSON.stringify(' + JSON.stringify(resolvedConfig, null, '\t') + ', null, "\\t")'
		const buffer = Buffer.from(text)
		await fs.writeFile(resolve(outFile), buffer)
		notifyFileResult(prefixes.tsconfig, outFile, buffer.byteLength)
	}
))

const buildViteConfig = buildFunction(prefixes.viteConfig, (
	/** @arg {string} outFile */
	async (outFile) => {
		await tsup('tsup.vite.ts')
		const configSrcFile = resolve(distDir, 'vite.config.js')
		const configSrc = await fs.readFile(configSrcFile, 'utf8')
		const text = `export default () => ${JSON.stringify(configSrc)}`
		const buffer = Buffer.from(text)
		await Promise.all([
			fs.writeFile(outFile, buffer),
			fs.remove(configSrcFile),
		])
		notifyFileResult(prefixes.viteConfig, outFile, buffer.byteLength)
	}
))

async function buildCliConfigs() {
	await Promise.all([
		buildTsconfig(tsconfigBuildDest),
		buildViteConfig(viteConfigBuildDest),
	])
}

async function cleanupCliConfigs() {
	await $`git checkout HEAD -- ${[
		tsconfigBuildDest,
		viteConfigBuildDest,
	]}`.quiet()
}

const buildPackageJson = buildFunction(prefixes.packageJson, (
	/** @arg {string} outFile */
	async (outFile) => {
		const [providedVersion] = argv._
		const packageJsonSrc = {
			name: packageJson.name,
			description: packageJson.description,
			repository: packageJson.repository,
			version: providedVersion ? providedVersion.slice(1) : ('0.0.0-dev+' + (await $`git rev-parse --short HEAD`.quiet()).stdout.trim()),
			main: 'index.cjs',
			module: 'index.js',
			bin: 'cli.js',
			dependencies: {
				'firebase-tools': '^12.0.0',
				preact: packageJson.dependencies.preact,
				vite: '^4.2.0',
			},
		}
		const buffer = Buffer.from(JSON.stringify(packageJsonSrc, null, '\t'))
		await fs.writeFile(outFile, buffer)
		notifyFileResult(prefixes.packageJson, outFile, buffer.byteLength)
	}
))

const buildPackageTsup = buildFunction(prefixes.platform, () => tsup('tsup.package.ts', prefixes.platform))

async function buildCli() {
	await buildCliConfigs()
	const start = Date.now()
	echo `${prefixes.cli} Build start`
	await tsup('tsup.cli.ts', prefixes.cli)
	await cleanupCliConfigs()
	echo `${prefixes.cli} ⚡️ Build success in ${Date.now() - start}ms`
}

const copyStaticFiles = buildFunction(prefixes.static, (
	async () => {
		const filesToCopy = [
			'LICENSE',
			'cli.js',
		]
		await Promise.all(filesToCopy.map(async (file) => {
			const src = resolve(file)
			const dest = resolve(distDir, file)
			await fs.copy(src, dest)
			const stat = await fs.stat(src)
			await fs.chmod(dest, stat.mode)
			echo `${prefixes.static} ${chalk.bold(relative(resolve('.'), dest))} ${chalk.green(toKB(stat.size) + ' KB')}`
		}))
	}
))

async function buildPackage() {
	await Promise.all([
		buildPackageTsup(),
		buildPackageJson(resolve(distDir, 'package.json')),
		copyStaticFiles(),
	])
}

// ----------------------------------------------------- MAIN ----------------------------------------------------- \\

const start = Date.now()

echo `${prefixes.app} Cleaning output folder`

await fs.remove(distDir)

await fs.mkdirp(distDir)

echo `${prefixes.app} Build start`

await Promise.all([
	buildCli(),
	buildPackage(),
])

echo `${prefixes.app} ⚡️ Build success in ${Date.now() - start}ms`
