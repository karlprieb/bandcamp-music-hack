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
            console.log('Fetching necessary data from bandcamp. Please wait...');
            content.push(data.toString());
        });

        fetchedHTML.stderr.on('data', (data) => {
            console.log('Please wait...');
        });

        fetchedHTML.on('close', (code) => {
            console.log('Finished fetching data.')    
            this.crawler = new crawler.BchCrawler(content);
            this.crawler.crawl(); 
        });
    }

    fetchMultipleTracks (url) {
        let content = [];
        let fetchedHTML = spawn('curl', [url]);
        let fullURL = url;

        fetchedHTML.stdout.on('data', (data) => {
            console.log('Fetching necessary data from bandcamp. Please wait...');
            content.push(data.toString());
        });

        fetchedHTML.on('close', (code) => {
            let self = this;

            if (code === 0) {
                let $ = cheerio.load(content.join(''));
                let songsEls = $('.title-col').find('a');
                let baseURL = fullURL.split('/')[2]

                songsEls.each(function () {
                    let trackURL = $(this).attr('href').trim();
                    let finalURL = `https://${baseURL}${trackURL}`;
                    console.log(finalURL);

                    self.fetchOneTrack(fullURL);
                })
            } else {
                throw `Error: Something went wrong. Code ${code}`;
            }
        });
    };
}

exports.BchFetch = BchFetch;