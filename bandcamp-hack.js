'use strict';

let spawn 			= require('child_process').spawn;
let curlFetchHTML	= spawn('curl', ['https://owenmusic.bandcamp.com/track/lost'])

let list = [];
let regex = /\{\"mp3-128\"\:\"\/\/(\S+)\"\}/gmi;

function callback () {
	let stringfied = list.join('');
	let url = 'https://' + regex.exec(stringfied)[1];
	let curlFetchMP3 = downloadMP3(url);

	curlFetchMP3.stdout.on('data', (data) => {
		console.log('downloading process...')
	});

	/*curlFetchMP3.stderr.on('data', (data) => {
		console.log(`stdeer: ${data}`);
	});
*/
	curlFetchMP3.on('close', (code) => {
		 console.log(`DONE DOWNLOAD! ${code}`);
	});	
}

function downloadMP3 (url) {
	return spawn('wget', ['-O', 'somefile.mp3', url]);
} 

curlFetchHTML.stdout.on('data', (data) => {
	list.push(data.toString());
});

curlFetchHTML.stderr.on('data', (data) => {
	console.log(`stdeer: ${data}`);
});

curlFetchHTML.on('close', (code) => {
	 callback();
	 console.log(`child process exited with code ${code}`);
});
