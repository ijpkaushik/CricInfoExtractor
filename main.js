const URL = 'https://www.espncricinfo.com/series/ipl-2021-1249214/'

const allMatchesObj = require('./allMatches')

const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const path = require('path');

const iplPath = path.join(__dirname, 'Indian Premier League 2021');
dirCreater(iplPath);

request(URL, cb);

//HOME PAGE
function cb(err, response, html) {
    if (err) {
        console.log(err)
    } else {
        //console.log(html)
        extractLink(html)
    }
}

function extractLink(html) {
    let $ = cheerio.load(html);
    let anchorElement = $('a[data-hover="View All Results"]');
    let link = anchorElement.attr("href");
    //console.log(link);
    let fullLink = 'https://www.espncricinfo.com' + link;
    console.log(fullLink);
    allMatchesObj.getAllMathcesLink(fullLink);
}

function dirCreater(filepath) {
    if (fs.existsSync(filepath) == false){
        fs.mkdirSync(filepath)
    }
}

