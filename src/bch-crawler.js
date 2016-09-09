const cheerio   = require('cheerio');

let _selector    = null;  

let _contentHTML;
let _MP3Regx;     
let _extractMP3Url;
let _URL;
let _mp3;
let _artist;
let _track;

function _bindMP3 (mp3, _song) {
    /*mp3.stderr.on('data', (data) => {
       console.log(`${_song}: ${data}`);
    });*/

    mp3.on('close', (code) => {
        if(code === 0) {
            let message = `\n\nDownload of ${_song} successfully done.`
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
        _MP3Regx = /\{\"mp3-128\"\:\"\/\/(\S+)\"\}/i;
        let spawn     = require('child_process').spawn;
        let matchMP3Str =_MP3Regx.test(_contentHTML); 

        if (matchMP3Str) {
            _selector      = cheerio.load(_contentHTML);
            _artist        = this.getArtistName();
            _track         = this.getTrackName();
            let _song          = `${_artist} - ${_track}.mp3`;
            _extractMP3Url = _MP3Regx.exec(_contentHTML)[1];
            _URL           = `http://${_extractMP3Url}`;
            _mp3           = spawn('wget', ['-O', `${_song}`, _URL]);

            _bindMP3.bind(this)(_mp3, _song);
        }
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