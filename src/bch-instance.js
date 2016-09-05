const commander = require('commander');
const spawn 	= require('child_process').spawn;
const bchFetch	= require('./bch-fetch');

function BchHack () {
	const validAlbumURLRgx 	= /^(https:\/\/)?\w+\.bandcamp\.com\/album\/.+$/g; 
	const validMP3URLRgx	= /^(https:\/\/)?\w+\.bandcamp\.com\/track\/.+$/g

	let artist 	= null;

	/**
	* Main instance for BandCampHack. Initialize whe
	* whole process responsible to trigger the initial
	* state of the hacking.
	* @constructor 
	**/
	this._init = function () {
		commander
			.version('0.0.1')
			.option('-a, --album', 'set the artist\'s URL album')
			.option('-t, --track', 'set the track URL')
			.option('-s, --search', 'search for available album from specific artist')
			.parse(process.argv);

		let url = commander.args[0];

		if (commander.artist) {
			if (! validAlbumURLRgx.test(url)) {
				throw 'Error: URL does not match. See -h for help.';
			}

			bchFetch.fetch(url);
			bchFetch.fetchMultipleTracks();
		}

		if (commander.track) {
			console.log(url, validMP3URLRgx.test(url));
			if (! validMP3URLRgx.test(url)) {
				throw 'Error: URL does not match. See -h for help.';
			}

			bchFetch(url);
			bchFetch.fetchOneTrack();
		}
	}

	this._init();
}

BchHack();