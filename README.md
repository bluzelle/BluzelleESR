# Bluzelle ESR

Bluzelle Ethereum Smart Contract Registry with a purpose of provisioning and tracking Swarms and Nodes

# Pre-req
Sign up for Infura here: https://infura.io/.

We will use their services for accessing the Ethereum blockchain (testnet ropsten) via Truffle framework.  You will not need this if you plan on running this project locally.

# Installation

Install the dependencies by running `npm install`.

You will also need Ganache (formerly TestRPC), to run this project locally, which can be downloaded here: https://truffleframework.com/ganache


## Deploying Local

1) Start Ganache and take note of the port it's running on (i.e. 7545)
2) In the truffle.js file, ensure that the port number for development under networks is the same as your Ganache instance.

```
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
```

3) run the following command to compile the solidity contracts:
```
    npm run truffle compile
```

4a) run the following command to deploy the contract to your Ganache instance:
```
    npm run truffle migrate
```

4b) If you would like to deploy your contracts to your Ganache instance using an external script (webjs library) then run the following commands from the root directory:
```
    cd scripts
    npm run truffle exec deploy.js
```


## Deploying to Ropsten
1) create a file in root directory called 'secret' (without a file extension).  Place your Ropsten Ethereum address mnemonic in this file (words are seperated by one space)

2) Take your infura API key after signing up with them and place it in the truffle.js at this line:

```
  const infuraKey = "YOUR INFURA API KEY";
```

3) Ensure contracts are built by running the following command:
```
  npm run truffle compile
```

4) Run the following command to deploy the contracts to Ropsten network:
```
  npm run truffle migrate --reset --network ropsten
```

Once deployed, the console will provide the contract address which you can use to interact with or view on Etherscan.

## Interacting with the Contract

Ways you can interact with the contract:

  - Web3 library 
  - Remix
  - MyEtherWallet

You will need the contract address and ABI which can be found in the project by going into build/contracts/BluzelleESR.json

Note: Ensure that you are only copying the ABI portion of the json file and not the whole thing.

## Contract functions:

```
  function addSwarm(string swarmID, uint256 swarmSize, string swarmGeo, bool isTrusted, string swarmType, uint256 swarmCost, string[] memory nodeList)
```

addSwarm() - A function that adds a swarm to the ESR

  - Only contract owner can call this function
  - swarmID represents the SID of the swarm. 
  - swarmSize is a numeric value representation of swarm size in bytes
  - swarmGeo = location of the swarm
  - isTrusted = whether the swarm is trusted or trustless
  - swarmType = Either 'Disk' or 'In-Memory'
  - swarmCost = a scale representation from 1-10 with 10 being the most exprensive
  - nodeList[] = an array of nodes joined in the particular swarm

```
  function removeSwarm(string swarmID)
```

removeSwarm() - A function that removes a swarm to the ESR

  - Only contract owner can call this function
  - swarmID represents the SID of the swarm.  

```
  function addNode(string swarmID, string nodeHost, string nodeName, uint256 nodeHttpPort, uint256 nodePort, string nodeUUID) 
```

addNode() - A function that adds a node to a specfic swarm given the swarm ID

  - Only contract owner can call this function
  - swarmID represents the SID of the swarm.  
  - nodeHost = the IP address of the node (127.0.0.1)
  - nodeName = name of the node (node_01)
  - nodeHttpPort = http port of the node (8080)
  - nodePort = port where node is exposed (5050)
  - nodeUUID = unique ID of node (MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEysScFkwI4d8I65aJnr8UAohqjYCYuBXgMb73Aa0SlQF62+ql4XGuTRoYZVX8L9WrzSlg3m4UY7KrIBJPYS++pA==)

```
  function removeNode(string swarmID, string nodeHostName) 
```

removeNode() - A function that removes a node from a specified swarm ID and node host name

  - Only contract owner can call this function
  - swarmID represents the SID of the swarm.  
  - nodeHostName = the URL of the node (http://testnet.bluzelle.com:5050) to remove from given swarm

```
  function getNodeCount(string swarmID)
```

getNodeCount() - A function that returns the number of nodes in a specific swarm

  - Only can be called if contract is active
  - swarmID represents the SID of the swarm.  

```
  function getSwarmCount()
```

getSwarmCount() - A function that returns the number of swarms on the network

  - Only can be called if contract is active

```
  function getSwarmInfo(string swarmID) 
```

getSwarmInfo() - A function that returns information about the specified swarm

  - Only can be called if contract is active
  - swarmID represents the SID of the swarm.  

```
  function getNodeInfo(string swarmID, string nodeHostName) 
```

getNodeInfo() - A function that returns information about a certain node in a specific swarm

  - Only can be called if contract is active
  - swarmID represents the SID of the swarm.  
  - nodeHostName = the URL of the node (http://testnet.bluzelle.com:5050)

```
  function getSwarmList()  
```

getSwarmList() - A function that returns a list of swarms on the network

  - Only can be called if contract is active

```
  function getNodeList(string swarmID)  
```

getNodeList() - A function that returns a list of nodes from a specified swarm

  - Only can be called if contract is active
  - swarmID represents the SID of the swarm.  

```
  function deactivateContract() 
```

deactivateContract() - A function that deactivates the contract

  - Only can be called by the Contract owner





