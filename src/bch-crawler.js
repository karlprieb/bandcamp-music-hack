const spawn     = require('child_process').spawn;
const cheerio   = require('cheerio');

let _selector    = null;  

let _contentHTML;
let _MP3Regx;     
let _extractMP3Url;
let _URL;
let _mp3;
let _artist;
let _track;
let _song;

function _bindMP3 (mp3) {
    mp3.stdout.on('data', (data) => {
        console.log('Downloading the mp3...');
    });

    mp3.stderr.on('data', (data) => {
        console.log('Handling errors...');
    });

    mp3.on('close', (code) => {
        if(code === 0) {
            let message = `\n\nDownload successfully done.\nTo check type 'open' followed by your songs name. In this scenario: ${_song}.\nHave fun!`
            console.log(message.trim());
        }
  });
}

class BchCrawler {
    constructor (content) {
        this.content = content;
    }

    crawl () {
        _contentHTML   = this.content.join('');
        _selector      = cheerio.load(_contentHTML);
        _artist        = this.getArtistName();
        _track         = this.getTrackName();
        _song          = `${_artist} - ${_track}.mp3`;
        _MP3Regx       = /\{\"mp3-128\"\:\"\/\/(\S+)\"\}/gmi;
        _extractMP3Url = _MP3Regx.exec(_contentHTML)[1];
        _URL           = `http://${_extractMP3Url}`;
        _mp3           = spawn('wget', ['-O', `${_song}`, _URL]);

        _bindMP3.bind(this)(_mp3);
    }

    getTrackName () {
        return _selector('#name-section')
            .find('.trackTitle')
        .text().trim();
    }

    getArtistName () {
       return _selector('#name-section')
            .find('.albumTitle')
            .find('span[itemprop=\'byArtist\']')
        .text().trim();
    }
}

exports.BchCrawler = BchCrawler;