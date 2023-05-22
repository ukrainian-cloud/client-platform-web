import { spawn } from 'node:child_process';
import { Readable } from 'node:stream';

function selfResolveablePromise<T>() {
	let resolve: (value: T) => void, reject: (reason: unknown) => void;
	const promise = new Promise<T>(($, _) => {
		resolve = $;
		reject = _;
	});
	// ignore possible variables using before initialization due to Promises/A+ implemented in Node.js
	// @ts-ignore
	return Object.assign(promise, { resolve, reject });
}

/**
 * @arg {string} executable
 * @arg {string[]} args
 * @arg {Record<string, string | undefined>=} env
 * @return {}
 */
export function runCmd(executable: string, args: string[], env?: Record<string, string | undefined>) {
	return new Promise<{
		[x in 'stdout' | 'stderr']: Readable;
	} & {
		process: Promise<{
			[x in 'stdout' | 'stderr']: Buffer;
		} & {
			code: number;
		}>
	}>((resolveProcess, rejectProcess) => {
		const stdout: Buffer[] = [];
		const stderr: Buffer[] = [];
		const stdoutReadStream = new Readable({ read() {} });
		const stderrReadStream = new Readable({ read() {} });
		const processPromise = selfResolveablePromise<{ [x in 'stdout' | 'stderr']: Buffer } & { code: number }>();
		const cp = spawn(executable, args, { env });
		cp.once('spawn', () => {
			resolveProcess({
				stdout: stdoutReadStream,
				stderr: stderrReadStream,
				process: processPromise.then((v) => v),
			});
		});
		cp.once('error', rejectProcess);
		function onStdout(chunk: Buffer) {
			stdout.push(chunk);
			stdoutReadStream.push(chunk);
		}
		function onStderr(chunk: Buffer) {
			stderr.push(chunk);
			stderrReadStream.push(chunk);
		}
		cp.stdout.on('data', onStdout);
		cp.stderr.on('data', onStderr);
		cp.once('exit', (code) => {
			cp.stdout.off('data', onStdout);
			cp.stderr.off('data', onStderr);
			stdoutReadStream.push(null);
			stderrReadStream.push(null);
			processPromise.resolve({
				stdout: Buffer.concat(stdout),
				stderr: Buffer.concat(stderr),
				code: code ?? -1,
			});
		});
	});
}
