//const URL = 'https://www.espncricinfo.com/series/ipl-2021-1249214/chennai-super-kings-vs-kolkata-knight-riders-final-1254117/full-scorecard'

const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx')
let allPlayersArr = [];

const excelObj = require('./excel');
const { excelWriter } = require('./excel');

function getAllMatchDetails(URL) {
    request(URL, cb);
}

//MATCH PAGE
function cb(err, response, html) {
    if (err) {
        console.log(err)
    } else {
        //console.log(html)
        extractMatchDetail(html)
    }
}

function extractMatchDetail(html) {
    let $ = cheerio.load(html)

    let descriptionElement = $('.header-info .description');
    let strArr = descriptionElement.text().split(',');
    let venue = strArr[1].trim();
    let date = strArr[2].trim();

    // console.log(venue)    
    // console.log(date)

    let resultElement = $('.match-header .status-text')
    let result = resultElement.text();
    // console.log(result)

    //htmlString = ""

    let innings = $('.match-scorecard-page .Collapsible')
    for (let i = 0; i < innings.length; i++) {
        //htmlString += $(innings[i]).html();
        let teamName = $(innings[i]).find("h5").text()
        teamName = teamName.split('INNINGS')[0].trim();
        console.log('Team Name:' + teamName);

        let opponentIndex = i == 0 ? 1 : 0;
        opponentTeam = $(innings[opponentIndex]).find("h5").text()
        opponentTeam = opponentTeam.split('INNINGS')[0].trim();
        console.log('Opponent Name:' + opponentTeam);

        let currentInning = $(innings[i]);
        let allRows = currentInning.find(".table.batsman tbody tr")
        for (j = 0; j < allRows.length; j++) {
            let allCols = $(allRows[j]).find("td")
            let isBatsman = $(allCols[0]).hasClass("batsman-cell")

            if (isBatsman) {
                //console.log(allCols.text())
                let playerName = $(allCols[0]).text().trim();
                let playerRuns = $(allCols[2]).text().trim();
                let playerBalls = $(allCols[3]).text().trim();
                let playerFours = $(allCols[5]).text().trim();
                let playerSixes = $(allCols[6]).text().trim();
                let playerStrikeRate = $(allCols[7]).text().trim();
                // console.log(`${playerName} ${playerRuns} ${playerBalls} ${playerFours} ${playerSixes} ${playerStrikeRate}`)

                let playerObj = {
                    playerName: '',
                    playerRuns: '',
                    playerBalls: '',
                    playerFours: '',
                    playerSixes: '',
                    playerStrikeRate: ''
                }

                {
                    playerObj.playerName = playerName;
                    playerObj.playerRuns = playerRuns;
                    playerObj.playerBalls = playerBalls;
                    playerFours.playerFours = playerFours;
                    playerObj.playerSixes = playerSixes;
                    playerObj.playerStrikeRate = playerStrikeRate;
                }
                allPlayersArr.push(playerObj);
                console.log(playerObj);

                processPlayer(teamName, playerName, playerRuns, playerBalls, playerFours, playerSixes, playerStrikeRate, opponentTeam, venue, date, result)
            }
        }
    }

    function processPlayer(teamName, playerName, playerRuns, playerBalls, playerFours, playerSixes, playerStrikeRate, opponentTeam, venue, date, result) {
        let teamPath = path.join(__dirname, 'Indian Premier League 2021', teamName);
        dirCreater(teamPath);

        let filePath = path.join(teamPath, playerName + ".xlsx");
        let content = excelObj.excelReader(filePath, playerName);
        let playerObj = {
            playerName,
            playerRuns,
            playerBalls,
            playerFours,
            playerSixes,
            playerSixes,
            playerStrikeRate,
            opponentTeam,
            venue,
            date,
            result
        }
        content.push(playerObj);

        excelWriter(filePath, content, playerName)
    }

    console.log("**************************************")
    let allPlayersJSON = JSON.stringify(allPlayersArr);
    fs.writeFileSync("allPlayersData.json", allPlayersJSON, "utf-8");
    //console.log(htmlString);
}

function dirCreater(filepath) {
    if (fs.existsSync(filepath) == false) {
        fs.mkdirSync(filepath)
    }
}


module.exports = {
    getAllMatchDetails: getAllMatchDetails
}