const assert = require('assert');
const BluzelleESR = artifacts.require("./BluzelleESR.sol");

let BluzelleESRInstance;

contract('Bluzelle ESR Contract', function(accounts) {
    
    const deploy = async function() {
        BluzelleESRInstance = await BluzelleESR.new({from: accounts[0]});
    };
    describe('Bluzelle ESR Tests', function() {
    
        before(deploy);

        it('should return true on successful add swarm', async () => {
            assert.equal(await BluzelleESRInstance.addSwarm(
                "TestSwarmID", 
                10,
                "Canada",
                true,
                "Disk",
                10,
                [], 
                {from: accounts[0]}
                ),
                true);
        });

    // it('should display help message', async () => {
    //     const stub = sinon.stub(helpers, 'printHelpMessage');
    //     await pluginAnalyze({ compilers: {}, help: true });
    //     assert.ok(stub.called);
    // });

    // it('should display version information', async () => {
    //     const stub = sinon.stub(helpers, 'printVersion');
    //     await pluginAnalyze({ compilers: {}, version: true });
    //     assert.ok(stub.called);
    // });

    // it('should terminate with return code 0 when analyze returns 0', async () => {
    //     const returnCode = 0;
    //     analyzeStub.returns(returnCode);
        
    //     await rewiredIndex(config);
        
    //     assert.ok(analyzeStub.called);
    //     assert.ok(!errorStub.calledWith('Unexpected Error occured. return value of analyze should be either 0 or 1'));
    //     assert.ok(!exitStub.callled);
    // });

    // it('should terminate with return code 1 when analyze returns 1', async () => {
    //     analyzeStub.returns(1);
        
    //     await rewiredIndex(config);
        
    //     assert.ok(analyzeStub.called);
    //     assert.ok(!errorStub.calledWith('Unexpected Error occured. return value of analyze should be either 0 or 1'));
    //     assert.ok(exitStub.calledWith(1));
    // });

    // it('should terminate with return code 1 when analyze returns neither 0 nor 1', async () => {
    //     analyzeStub.returns(2)
        
    //     await rewiredIndex(config);
        
    //     assert.ok(analyzeStub.called);
    //     assert.ok(errorStub.calledWith('Unexpected Error occured. return value of analyze should be either 0 or 1'));
    //     assert.ok(exitStub.calledWith(1));
    // });
    });
});