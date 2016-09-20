const cheerio       = require('cheerio');
const fs            = require('fs');
const request       = require('request');
const MultiProgress = require('multi-progress');

const MP3_REGEX = /\{\"mp3-128\"\:\"\/\/(\S+)\"\}/i;

class BchCrawler {
    constructor (content) {
        this.content = content;
    }

    crawl (index) {
        if (MP3_REGEX.test(this.content)) {
            let selector      = cheerio.load(this.content);
            let artist        = this.getArtistName(selector);
            let track         = this.getTrackName(selector);
            let song          = `${artist} - ${track}.mp3`;
            let extractMP3Url = MP3_REGEX.exec(this.content)[1];
            let url           = `http://${extractMP3Url}`;
            let stream        = fs.createWriteStream(song);
            let multi         = new MultiProgress(process.stderr);

            request
                .get(url)
                .on('response', (response) => {
                    let size = parseInt(response.headers['content-length'], 10);
                    let bar = multi.newBar('[:bar] :percent :etas', {
                        complete:   '#',
                        incomplete: ' ',
                        width:      100,
                        total:      size
                    })

                    response.on('data', (chunk) => {
                        if (bar.tick) {
                            bar.tick(chunk.length);
                        }
                    })
                })
                .on('error', (err) => {
                    console.log(`Err: ${err}`);    
                })
                .pipe(fs.createWriteStream(song))
                .on('close', (err) => {
                    if (err) {
                        console.log(`Err: ${err}`);
                    }

                    console.log(`Download of ${song} successfully done.`);    
                 })
        }
    }

    getTrackName (selector) {
        return selector('#name-section')
            .find('.trackTitle')
        .text().trim();
    }

    getArtistName (selector) {
       return selector('#name-section')
            .find('.albumTitle')
            .find('span[itemprop=\'byArtist\']')
        .text().trim();
    }
}

exports.BchCrawler = BchCrawler;