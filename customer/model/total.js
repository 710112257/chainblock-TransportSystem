//调用链码对应的函数
const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

async function getValue(assertId,ccp) {
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
        const contract = network.getContract('cc_customer');

        // 执行指定的交易.
        //注意，如果不修改状态使用evaluateTransaction
        const result = await contract.evaluateTransaction('getValue', assertId);
        console.log("result",result);
        // 断开网关连接
        await gateway.disconnect();
        return JSON.parse('['+result.toString()+']');
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
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
        const contract = network.getContract('cc_customer');
        // 执行指定的交易.
        //注意，如果不修改状态使用evaluateTransaction
        const result = await contract.evaluateTransaction('getHistory', assertId);
        console.log("result",result);
        // 断开网关连接
        await gateway.disconnect();
        return result.toString();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return false;
    }
}
module.exports = {
    getValue,
    getHistory,
}