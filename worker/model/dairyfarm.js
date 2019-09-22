const total=require('./total');
const path = require('path');
const fs = require('fs');
const ccpPath = path.resolve(__dirname, '..', 'config', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
async function putIpfs(req) {
    var result=await total.putIpfs(req);
    return result;
}

async function putValue(optContent) {
    console.log(optContent);
    var result=await total.putValue(optContent,ccp);
    return result;
}
async function upDate(optContent) {
    console.log(optContent);
    var result=await total.upDate(optContent,ccp);
    return result;
}
async function getValue(phoneNumber) {
    const result= await total.getValue(phoneNumber,ccp);
    return result;
}
async function getHistory(assertId) {
    const result= await total.getHistory(assertId,ccp);
    return result;
}

module.exports = {
    putValue,
    getHistory,
    putIpfs,
    getValue,
    upDate
}
