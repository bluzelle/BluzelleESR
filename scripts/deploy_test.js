var BluzelleESR = artifacts.require("./BluzelleESR.sol");
var fs = require('fs');
var jsonObj = JSON.parse(fs.readFileSync('../peerlist.json', 'utf8'));

var receipts = []

//owner
var myAccount = "0x9cE2037b7bb23526222B55DAB84cF9ea450C223e";
var ropstenContract = "0x407cA38Ded7929843BCF1f00A3303FC7dFdc12fC";

module.exports = async function(callback){
    //record transaction summary
    function recordTransaction(description, receipt, display) {
        if (display) {
            console.log("TxID     : " + receipt.transactionHash)
            console.log("Gas used : " + receipt.gasUsed)
        }

        receipts.push([ description, receipt ])
    }
    
    if((await web3.eth.getCode(ropstenContract))){
        let BluzelleESRInstance = await BluzelleESR.at(ropstenContract);

        //TODO: Dynamically interchange which swarm to check (if existing)
        let SwarmInfo = await BluzelleESRInstance.getSwarmInfo("BluzelleSwarm");
        
        if(SwarmInfo.size.toString(10) == 0 && 
            SwarmInfo.geo == '' &&
            SwarmInfo.trust == false &&
            SwarmInfo.swarmtype == '' &&
            SwarmInfo.cost.toString(10) == 0 &&
            SwarmInfo.nodelist.length == 0){

                //TODO: Dynamic call during swarm creation?
                await BluzelleESRInstance.addSwarm("BluzelleSwarm",7,"Canada",true,"Disk",0,[],{ from: myAccount });

                for(var i=0; i<jsonObj.length; i++){
                    await BluzelleESRInstance.addNode("BluzelleSwarm",
                        jsonObj[i].host,
                        jsonObj[i].name,
                        jsonObj[i].http_port,
                        jsonObj[i].port,
                        jsonObj[i].uuid
                        );
                }

                console.log(await BluzelleESRInstance.getSwarmInfo("BluzelleSwarm"));
            }
    }
    else{
        let BluzelleESRInstance = await BluzelleESR.new({ from: myAccount });
        let receiptTx = await web3.eth.getTransactionReceipt(BluzelleESRInstance.transactionHash);
        let AddressBluzelleESR = BluzelleESRInstance.address;
        console.log("Address of Bluzelle ESR Contract: " + AddressBluzelleESR);
        console.log("");

        recordTransaction("BluzelleESR.new", receiptTx, true);
    }
    
    //
    // Gas Statistics
    //
    console.log('----------------------------------------------------------------------------------')
    console.log('Gas usage summary')
    console.log('----------------------------------------------------------------------------------')
    var totalGas = 0
    for (i = 0; i < receipts.length; i++) {
       console.log(receipts[i][0].padEnd(33) + receipts[i][1].gasUsed)
       totalGas += receipts[i][1].gasUsed
    }
    console.log('----------------------------------------------------------------------------------')
    console.log('Total gas recorded '.padEnd(33) + totalGas)

    console.log('')
    console.log('Deployment completed successfully.')
    console.log('')

    process.exit()
}







