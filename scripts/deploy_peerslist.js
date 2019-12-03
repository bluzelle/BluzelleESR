// Run this first:

// ./node_modules/.bin/ganache-cli --account="0x1f0d511e990ddbfec302e266d62542384f755f6cc6b3161b2e49a2a4e6c4be3d,100000000000000000000"

// or if with ganache-gui, copy one of the keys
const myAccount = "0xaa81f360c6bbef505b28760fee25443f9d33e499";



var BluzelleESR = artifacts.require("./BluzelleESR.sol");

var fs = require('fs');

var receipts = []

//record transaction summary
function recordTransaction(description, receipt, display) {
    if (display) {
        console.log("TxID     : " + receipt.transactionHash)
        console.log("Gas used : " + receipt.gasUsed)
    }

    receipts.push([ description, receipt ])
}



const addSwarm = async (peerslist, BluzelleESRInstance) => {

    await BluzelleESRInstance.addSwarm("BluzelleSwarm",7,"Canada",true,"Disk",0,[],{ from: myAccount });

    for(var i=0; i<peerslist.length; i++){

        await BluzelleESRInstance.addNode(
            "BluzelleSwarm",
            peerslist[i].host,
            peerslist[i].name,
            peerslist[i].port,
            peerslist[i].uuid,
            );
    }


};


module.exports = async () => main().catch(e => console.error(e));
const main = async () => {


    let BluzelleESRInstance = await BluzelleESR.new({ from: myAccount });
    let receiptTx = await web3.eth.getTransactionReceipt(BluzelleESRInstance.transactionHash);
    let AddressBluzelleESR = BluzelleESRInstance.address;


    recordTransaction("BluzelleESR.new", receiptTx, true);


    const json = JSON.parse(fs.readFileSync(__dirname + '/../peerslist.json', 'utf8'));

    console.log(json);


    await addSwarm(json, BluzelleESRInstance);


    
    //
    // Gas Statistics
    //
    // console.log('----------------------------------------------------------------------------------')
    // console.log('Gas usage summary')
    // console.log('----------------------------------------------------------------------------------')
    // var totalGas = 0
    // for (i = 0; i < receipts.length; i++) {
    //    console.log(receipts[i][0].padEnd(33) + receipts[i][1].gasUsed)
    //    totalGas += receipts[i][1].gasUsed
    // }
    // console.log('----------------------------------------------------------------------------------')
    // console.log('Total gas recorded '.padEnd(33) + totalGas)

    console.log('')
    console.log('Deployment completed successfully.')

    console.log('')

    console.log("Address of Bluzelle ESR Contract: \x1b[40m\x1b[37m" + AddressBluzelleESR + "\x1b[0m");


    process.exit()
};







