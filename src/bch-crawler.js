const spawn = require('child_process').spawn;

let _contentHTML;
let _MP3Regx;     
let _extractMP3Url;
let _URL;
let _mp3;

function _bindMP3 (mp3) {
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

class BchCrawler {
    constructor (content) {
        this.content = content;
    }

    crawl () {
        _contentHTML   = this.content.join('');
        _MP3Regx       = /\{\"mp3-128\"\:\"\/\/(\S+)\"\}/gmi;
        _extractMP3Url = _MP3Regx.exec(_contentHTML)[1];
        _URL           = `http://${_extractMP3Url}`;
        _mp3           = spawn('wget', ['-O', 'lost.mp3', _URL]);

        _bindMP3.bind(this)(_mp3);
    }
}

exports.BchCrawler = BchCrawler;