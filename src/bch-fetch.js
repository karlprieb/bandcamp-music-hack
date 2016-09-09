const spawn   = require('child_process').spawn;
const crawler = require('./bch-crawler'); 
const cheerio = require('cheerio');

class BchFetch {
    constructor(url) {
        this.crawler = null;
    }

    fetchOneTrack (url) {
        let fetchedHTML = spawn('curl', [url]);
        let content = [];

        fetchedHTML.stdout.on('data', (data) => {
            content.push(data.toString());
        });

        fetchedHTML.on('close', (code) => {
            this.crawler = new crawler.BchCrawler(content);
            this.crawler.crawl(); 
        });
    }

    fetchMultipleTracks (url) {
        let content = [];
        let fetchedHTML = spawn('curl', [url]);
        let fullURL = url;

        fetchedHTML.stdout.on('data', (data) => {
            content.push(data.toString());
        });

        /*fetchedHTML.stderr.on('data', (err) => {
            console.log(`${err}`);
        });*/

        fetchedHTML.on('close', (code) => {
            if (code === 0) {
                let $ = cheerio.load(content.join(''));
                let songsEls = $('.title-col').find('a');
                let baseURL = fullURL.split('/')[2]
                let urls = []

                let self = this;

                songsEls.each(function () {
                    let trackURL = $(this).attr('href').trim();
                    let finalURL = `https://${baseURL}${trackURL}`;
                    //console.log(finalURL);

                    self.fetchOneTrack(finalURL);
                })

            } else {
                throw `Error: Something went wrong. Code ${code}`;
            }
        });
    };
}

exports.BchFetch = BchFetch;