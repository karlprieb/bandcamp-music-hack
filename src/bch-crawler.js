const cheerio   = require('cheerio');
const fs        = require('fs');
const request   = require('request');

const MP3_REGEX = /\{\"mp3-128\"\:\"\/\/(\S+)\"\}/i;

class BchCrawler {
    constructor (content) {
        this.content = content;
    }

    crawl () {
        let spawn     = require('child_process').spawn;
        let matchMP3Str = MP3_REGEX.test(this.content); 

        if (matchMP3Str) {
            let selector      = cheerio.load(this.content);
            let artist        = this.getArtistName(selector);
            let track         = this.getTrackName(selector);
            let song          = `${artist} - ${track}.mp3`;
            let extractMP3Url = MP3_REGEX.exec(this.content)[1];
            let url           = `http://${extractMP3Url}`;
            let stream        = fs.createWriteStream(song);

            request
                .get(url)
                .on('response', (response) => {
                    console.log(`Download of ${song} successfully done.`);    
                 })
                .on('error', (err) => {
                     console.log(`Err: ${err}`);    
                 })
                .pipe(fs.createWriteStream(song));
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