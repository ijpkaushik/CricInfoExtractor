const fs = require('fs');
const xlsx = require('xlsx')

//write in excelfile
function excelWriter(filePath, json, sheetName) {
    let newB = xlsx.utils.book_new();
    let newS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newB, newS, sheetName);
    xlsx.writeFile(newB, filePath)
}

//read from excelfile
function excelReader(filePath, sheetName) {
    if(fs.existsSync(filePath)==false) {
    return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let json = xlsx.utils.sheet_to_json(excelData);
    return json;
}

module.exports = {
    excelWriter: excelWriter,
    excelReader: excelReader    
}