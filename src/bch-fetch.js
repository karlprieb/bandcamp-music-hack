const spawn 	= require('child_process').spawn;
const bcCrawler = require('./bch-crawler'); 

function fetch (url) {
	let fetchedHTML = spawn('curl', [url]);
	let content 	= [];

	this.fetchOneTrack = () => {
		fetchedHTML.stdout.on('data', (data) => {
			content.push(data.toString());
		});

		fetchedHTML.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
		});

		fetchedHTML.on('close', (code) => {
			bcCrawler.crawl(content);
		});
	};

	this.fetchMultipleTracks = () => {
		console.log('teste');
	};
}

exports.fetch = fetch;