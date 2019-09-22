const total=require('./total');
const path = require('path');
const fs = require('fs');
const ccpPath = path.resolve(__dirname, '..', 'config', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function getHistory(assertId) {
    const result= await total.getHistory(assertId,ccp);
    return result;
}
async function getValue(assertId) {
    const result= await total.getValue(assertId,ccp);
    return result;
}
module.exports = {
    getHistory,
    getValue
}
