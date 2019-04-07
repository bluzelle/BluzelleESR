var BluzelleESR = artifacts.require("./BluzelleESR.sol");

var receipts = []

//owner
let myAccount = web3.eth.accounts[0];
let otherAccount = web3.eth.accounts[1];


module.exports = async function(callback){
    //record transaction summary
    function recordTransaction(description, receipt, display) {
        if (display) {
            console.log("TxID     : " + receipt.transactionHash)
            console.log("Gas used : " + receipt.gasUsed)
        }

        receipts.push([ description, receipt ])
    }
    

    let BluzelleESRInstance = await BluzelleESR.new({ from: myAccount });
    let receiptTx = await web3.eth.getTransactionReceipt(BluzelleESRInstance.transactionHash);
    let AddressBluzelleESR = BluzelleESRInstance.address;
    console.log("Address of Token Contract: " + AddressBluzelleESR);
    console.log("");
    recordTransaction("BluzelleESR.new", receiptTx, true);


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

}







