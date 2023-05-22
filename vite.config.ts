import prefresh from '@prefresh/vite';
import { env } from 'node:process';
import htmlPlugin from 'vite-plugin-html-config';

const htmlConfig = JSON.parse(env.UC_HTML_CONFIG!);

function devOnlyNamespacePlugin() {
	const prefix = 'dev-only:';
	const resolvedPrefix = '\0' + prefix;

	let isDev = false;

	return {
		name: 'Dev-only namespace',
		config(_userConfig: any, { mode }: any) {
			isDev = mode === 'development';
		},
		resolveId(id: string) {
			if (id.startsWith(prefix)) {
				return '\0' + id;
			}
		},
		load(id: string) {
			if (id.startsWith(resolvedPrefix)) {
				const realId = id.slice(resolvedPrefix.length);
				return isDev
					? `import '${realId}';\nconsole.log('Loaded ${realId} for development-only env. You should not see this in production');`
					: 'export {}';
			}
		},
	};
}

console.log("READ ENV:", env);

export default {
	plugins: [prefresh(), devOnlyNamespacePlugin(), htmlPlugin(htmlConfig)],
	resolve: {
		alias: {
			'react': 'preact/compat',
			'react-dom/test-utils': 'preact/test-utils',
			'react-dom': 'preact/compat', // Must be below test-utils
			'react/jsx-runtime': 'preact/jsx-runtime',
		},
	},
	build: {
		rollupOptions: {
			input: env.UC_HTML_FILE,
		},
	},
};
