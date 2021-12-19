const cheerio = require('cheerio');
const request = require('request');
const scorecardObj = require('./scorecard')

//ALL MATCHES PAGE
function getAllMathcesLink(url) {
    request(url, function (err, response, html) {
        if (err) {
            console.log(err)
        } else {
            //console.log(html)
            extractAllMatchesLink(html)
        }
    })
}

function extractAllMatchesLink(html) {
    let $ = cheerio.load(html);
    let scorecardElement = $('a[data-hover="Scorecard"]');
    for (let i = 0; i < scorecardElement.length; i++) {
        let scorecardLink = $(scorecardElement[i]).attr("href");
        let fullScorecardLink = 'https://www.espncricinfo.com' + scorecardLink;
        console.log(fullScorecardLink)
        scorecardObj.getAllMatchDetails(fullScorecardLink);
    }
}

module.exports = {
    getAllMathcesLink : getAllMathcesLink
}