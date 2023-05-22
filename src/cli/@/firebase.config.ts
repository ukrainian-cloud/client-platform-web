const config = {
	hosting: {
		public: '.',
		ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
		rewrites: [
			{
				'source': '**',
				'destination': '/index.html',
			},
		],
	},
};

export default () => JSON.stringify(config, null, '\t');
