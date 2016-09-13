const crawler = require('./bch-crawler'); 
const cheerio = require('cheerio');
const request = require('request');
const fs      = require('fs');

let _getAllLinksFromArtistPage = $ => $('.title-col').find('a');

let _getBaseURL = fullURL => fullURL.split('/')[2];

let _getFullURL = (trackURL, baseURL) => `https://${baseURL}${trackURL}`;

class BchFetch {
    constructor(url) {
        this.crawler = null;
    }

    fetchOneTrack (url) {
        request(url, (err, res, body) => {
            if (err) throw `Error: ${err}`;

            this.crawler = new crawler.BchCrawler(body);
            this.crawler.crawl(); 
        });
    }

    fetchMultipleTracks (url) {
        request(url, (err, res, body) => {
            if (err) throw `Error: ${err}`;

            let self = this;
            let $ = cheerio.load(body);
            let songsEls = _getAllLinksFromArtistPage($);
            let baseURL = _getBaseURL(url);

            songsEls.each(function () {
                self.fetchOneTrack(_getFullURL($(this).attr('href').trim(), baseURL));
            })
        });
    };
}

exports.BchFetch = BchFetch;