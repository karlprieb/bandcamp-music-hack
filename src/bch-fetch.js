const spawn     = require('child_process').spawn;
const crawler = require('./bch-crawler'); 

class BchFetch {
    constructor(url) {
        this.fetchedHTML = spawn('curl', [url]);
        this.content     = [];
        this.crawler;
    }

    fetchOneTrack () {
        this.fetchedHTML.stdout.on('data', (data) => {
            this.content.push(data.toString());
        });

        this.fetchedHTML.stderr.on('data', (data) => {
            //console.log(`stderr: ${data}`);
            console.log('Fetching necessary data from bandcamp. Please wait...');
        });

        this.fetchedHTML.on('close', (code) => {
            this.crawler = new crawler.BchCrawler(this.content);
            this.crawler.crawl(); 
            //console.log(crawler);
        });
    }

    fetchMultipleTracks () {
        // TODO
        throw 'Not yet implemented';
    };
}

exports.BchFetch = BchFetch;