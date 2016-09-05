let spawn 			= require('child_process').spawn;

function crawl (content) {
	this.downloadMP3 = function (url, name) {
		return spawn('wget', ['-O', `${name}.mp3`, url]);
	} 

	const contentHTML 	= content.join('');
	const MP3Regx 		= /\{\"mp3-128\"\:\"\/\/(\S+)\"\}/gmi;
	const extractMP3Url = MP3Regx.exec(contentHTML)[1];
	const URL			= `http://${extractMP3Url}`;
	const mp3 			= spawn('wget', ['-O', 'test.mp3', URL]);

	mp3.stdout.on('data', (data) => {
		console.log('currently download mp3...');
	});

	mp3.stderr.on('data', (data) => {
		console.log(`Error: ${data}`);
	});

	mp3.on('close', (code) => {
		if(code === 0) {
			console.log('Download successfully done');
			return
		}

		console.log(`Something went wrong: ${code}`);
	});
}

exports.crawl = crawl;