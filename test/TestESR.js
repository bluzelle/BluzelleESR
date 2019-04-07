const assert = require('assert');
const BluzelleESR = artifacts.require("./BluzelleESR.sol");

let BluzelleESRInstance;

contract('Bluzelle ESR Contract', function(accounts) {
    
    const deploy = async function() {
        BluzelleESRInstance = await BluzelleESR.new({from: accounts[0]});
    };

    describe('Bluzelle ESR Tests', function() {
    
        before(deploy);

        it('should be successful in adding a swarm', async () => {
            
            await BluzelleESRInstance.addSwarm(
                "TestSwarmID", 
                10,
                "Canada",
                true,
                "Disk",
                10,
                [], 
                {from: accounts[0]});

            let results = await BluzelleESRInstance.getSwarmInfo("TestSwarmID")
            
            assert.equal(results.size.toString(10),10)
            assert.equal(results.geo,'Canada')
            assert.equal(results.trust,true)
            assert.equal(results.swarmtype, 'Disk')
            assert.equal(results.cost.toString(10),10)
            assert.deepEqual(results.nodelist,[])

        });

        it('should be successful in removing a swarm', async () => {
            await BluzelleESRInstance.addSwarm(
                "TestSwarmID2", 
                10,
                "Canada",
                true,
                "Disk",
                10,
                [], 
                {from: accounts[0]});

            let results = await BluzelleESRInstance.getSwarmInfo("TestSwarmID2")
            
            assert.equal(results.size.toString(10),10)
            assert.equal(results.geo,'Canada')
            assert.equal(results.trust,true)
            assert.equal(results.swarmtype, 'Disk')
            assert.equal(results.cost.toString(10),10)
            assert.deepEqual(results.nodelist,[])

            await BluzelleESRInstance.removeSwarm("TestSwarmID2", {from: accounts[0]});
            let updatedResults = await BluzelleESRInstance.getSwarmInfo("TestSwarmID2")
            
            assert.equal(updatedResults.size.toString(10),0)
            assert.equal(updatedResults.geo,'')
            assert.equal(updatedResults.trust, false)
            assert.equal(updatedResults.swarmtype, '')
            assert.equal(updatedResults.cost.toString(10),0)
            assert.deepEqual(updatedResults.nodelist,[])
        });

        it('should be successful in adding a node to a swarm', async () => {
            await BluzelleESRInstance.addSwarm(
                "TestSwarmID3", 
                10,
                "Canada",
                true,
                "Disk",
                10,
                [], 
                {from: accounts[0]});

            await BluzelleESRInstance.addNode("TestSwarmID3", "http://test.bluzelle.com:5050", "online", {from: accounts[0]});
            let updatedResults = await BluzelleESRInstance.getSwarmInfo("TestSwarmID3")
            assert.deepEqual(updatedResults.nodelist,["http://test.bluzelle.com:5050"])
        });

        it('should be successfu in removing a node from a swarm', async () => {
            await BluzelleESRInstance.addSwarm(
                "TestSwarmID4", 
                10,
                "Canada",
                true,
                "Disk",
                10,
                [], 
                {from: accounts[0]});

            await BluzelleESRInstance.addNode("TestSwarmID4", "http://test.bluzelle.com:5050", "online", {from: accounts[0]});
            let updatedResults = await BluzelleESRInstance.getSwarmInfo("TestSwarmID4")
            assert.deepEqual(updatedResults.nodelist,["http://test.bluzelle.com:5050"])

            await BluzelleESRInstance.removeNode("TestSwarmID4", "http://test.bluzelle.com:5050", {from: accounts[0]});
            let result = await BluzelleESRInstance.getSwarmInfo("TestSwarmID4") 
            assert.deepEqual(result.nodelist,[''])
        });

        it('should return number of swarms', async () => {
            await BluzelleESRInstance.addSwarm(
                "TestSwarmID5", 
                10,
                "United States",
                true,
                "Disk",
                10,
                [], 
                {from: accounts[0]});
            
            await BluzelleESRInstance.addSwarm(
                "TestSwarmID6", 
                10,
                "Singapore",
                true,
                "-In-memory",
                10,
                [], 
                {from: accounts[0]});
            
            //count previous test swarms
            assert.equal((await BluzelleESRInstance.getSwarmCount()).toString(10),6);    
        });

        it('should return number of nodes from a specific swarm', async () => {
            await BluzelleESRInstance.addNode("TestSwarmID6", "http://test1.bluzelle.com:5050", "online", {from: accounts[0]});
            await BluzelleESRInstance.addNode("TestSwarmID6", "http://test2.bluzelle.com:5050", "online", {from: accounts[0]});
            await BluzelleESRInstance.addNode("TestSwarmID6", "http://test3.bluzelle.com:5050", "online", {from: accounts[0]});

            assert.equal((await BluzelleESRInstance.getNodeCount("TestSwarmID6")).toString(10),3); 
        });
    });
});