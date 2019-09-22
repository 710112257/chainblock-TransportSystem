//调用链码对应的函数
const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
var ipfsClient = require('ipfs-http-client');
var fs =require('fs');

async function putIpfs(req) {
    var ipfs = ipfsClient('localhost', '5001', { protocol: 'http' });
    var arr=new Array();
    for(var i=0; i< req.files.length;i++){
        var file = req.files[i];
        var buf = fs.readFileSync(file.path);
        const results = await ipfs.add(buf);
        await arr.push(results[0].hash);
        await fs.unlink(file.path,function(err){
           if(err){
              throw err;
           }
        })
    }
    return arr;
}
async function putValue(optContent,ccp) {
    try {
        // 创建一个用于管理身份的文件夹wallet
        const walletPath = path.join(__dirname, '../wallet/');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // 检查是否已经注册好普通用户user1
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // 创建一个用于与peer节点通信的网关对象
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
        // 获得我们的链码部署到的channel对象
        const network = await gateway.getNetwork('mychannel');
        // 创建一个用于与peer节点通信的网关对象
        const contract = network.getContract('cc_worker');
        // 提交特定的交易 .
        //注意，涉及到修改状态使用submitTransaction
        const TXID=await contract.submitTransaction('putValue', JSON.stringify(optContent));
        console.log('交易已提交');
        // 断开网关连接
        await gateway.disconnect();
        return TXID.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return false;
    }
}
async function upDate(optContent,ccp) {
    try {
        // 创建一个用于管理身份的文件夹wallet
        const walletPath = path.join(__dirname, '../wallet/');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // 检查是否已经注册好普通用户user1
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // 创建一个用于与peer节点通信的网关对象
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
        // 获得我们的链码部署到的channel对象
        const network = await gateway.getNetwork('mychannel');
        // 创建一个用于与peer节点通信的网关对象
        const contract = network.getContract('cc_worker');
        // 提交特定的交易 .
        //注意，涉及到修改状态使用submitTransaction
        const TXID=await contract.submitTransaction('upDate', JSON.stringify(optContent));
        console.log('交易已提交');
        // 断开网关连接
        await gateway.disconnect();
        return TXID.toString();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return false;
    }
}

async function getValue(phoneNumber,ccp) {
    try {
        // 创建一个用于管理身份的文件夹wallet
        const walletPath = path.join(__dirname, '../wallet/');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // 检查是否已经注册好普通用户user1
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        
        // 创建一个用于与peer节点通信的网关对象
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
        
        // 获得我们的链码部署到的channel对象
        const network = await gateway.getNetwork('mychannel');

        // 创建一个用于与peer节点通信的网关对象
        const contract = network.getContract('cc_worker');
        // 执行指定的交易.
        //注意，如果不修改状态使用evaluateTransactionr
        const result = await contract.evaluateTransaction('getValue', phoneNumber);

        // 断开网关连接
        await gateway.disconnect();
        return JSON.parse('['+result.toString()+']');
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return false;
    }
}

async function getHistory(assertId,ccp) {
    try {
        // 创建一个用于管理身份的文件夹wallet
        const walletPath = path.join(__dirname, '../wallet/');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // 检查是否已经注册好普通用户user1
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
            
        }

        // 创建一个用于与peer节点通信的网关对象
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

        // 获得我们的链码部署到的channel对象
        const network = await gateway.getNetwork('mychannel');

        // 创建一个用于与peer节点通信的网关对象
        const contract = network.getContract('cc_worker');
        // 执行指定的交易.
        //注意，如果不修改状态使用evaluateTransaction
        const result = await contract.evaluateTransaction('getHistory', assertId);
        // 断开网关连接
        await gateway.disconnect();
        return result.toString();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return false;
        
    }
}
module.exports = {
    putValue,
    getValue,
    getHistory,
    putIpfs,
    upDate
}