const total=require('./total');
const path = require('path');
const fs = require('fs');
const ccpPath = path.resolve(__dirname, '..', 'config', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
async function login(req) {
    const result= await total.login(req);
    console.log(result);
    return result;
}
async function getHistory(assertId) {
    const result= await total.getHistory(assertId,ccp);
    return result;
}
async function delDate(assertId) {
    const result= await total.delDate(assertId,ccp);
    return result;
}
module.exports = {
    getHistory,
    delDate,
    login
}
