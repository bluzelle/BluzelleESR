pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;

contract BluzelleESR {
    bool public isActive = false;
    address public ownerAddress;

    struct Node {
        uint256 nodeCount;
        string nodeHost;
        uint256 nodeHttpPort;
        string nodeName;
        uint256 nodePort;
        string nodeUUID;  
    }

    struct Swarm {
        uint256 swarmCount;
        uint256 swarmSize;
        string swarmGeo;
        bool isTrusted;
        string swarmType;
        uint256 swarmCost;
        string[] nodeList; 
    }

    string[] public swarmList;
    mapping(string => Node) NodeStructs;
    mapping(string => Swarm) SwarmStructs;

    constructor () public {
        ownerAddress = msg.sender;
        isActive = true;
    }

    modifier onlyTrusted(address _account){
        require(msg.sender == _account, "Address is not trusted");
        _;
    }

    modifier onlyIfActive() {
        require(isActive, "The contract is not Active");
        _;
    }

    modifier onlyOwner(){
        require(msg.sender == ownerAddress, "Address is not owner");
        _;
    }

    //add swarm to the registry.  Only the owner of the contract can add to the registry
    function addSwarm(string memory swarmID, uint256 swarmSize, string memory swarmGeo, bool isTrusted, string memory swarmType, uint256 swarmCost, string[] memory nodeList) 
    public 
    onlyOwner() 
    returns(bool success)
    {
        SwarmStructs[swarmID].swarmCount = getSwarmCount() + 1;
        SwarmStructs[swarmID].swarmSize = swarmSize;
        SwarmStructs[swarmID].swarmGeo = swarmGeo;
        SwarmStructs[swarmID].isTrusted = isTrusted;
        SwarmStructs[swarmID].swarmType = swarmType;
        SwarmStructs[swarmID].swarmCost = swarmCost;
        SwarmStructs[swarmID].nodeList = nodeList;

        swarmList.push(swarmID);

        success = true;

        return success;
    }

    //remove swarm to the registry.  Only the owner of the contract can remove from the registry
    function removeSwarm(string memory swarmID) 
    public 
    onlyOwner() 
    returns(bool)
    {
        uint j;

        for(j=0; j< swarmList.length; j++) {
            if(keccak256(abi.encodePacked(swarmList[j])) == keccak256(abi.encodePacked(swarmID)))
            {
                delete swarmList[j];
                delete SwarmStructs[swarmID];
            }
        }
    }

    //add node to a swarm given the swarm ID
    function addNode(string memory swarmID, 
    string memory nodeHost, 
    string memory nodeName, 
    uint256 nodeHttpPort, 
    uint256 nodePort, 
    string memory nodeUUID) 
    public 
    onlyOwner()
    returns(bool success)
    {
        NodeStructs[nodeUUID].nodeCount = getNodeCount(swarmID) + 1;
        NodeStructs[nodeUUID].nodeHost = nodeHost;
        NodeStructs[nodeUUID].nodeName = nodeName;
        NodeStructs[nodeUUID].nodeHttpPort = nodeHttpPort;
        NodeStructs[nodeUUID].nodePort = nodePort;
        NodeStructs[nodeUUID].nodeUUID = nodeUUID;

        SwarmStructs[swarmID].nodeList.push(nodeUUID);

        return true;
    }

    //remove node from a swarm given the swarmID and nodeUUID
    function removeNode(string memory swarmID, string memory nodeUUID) 
    public 
    onlyOwner()
    returns(bool)
    {
        uint j;

        for(j=0; j< SwarmStructs[swarmID].nodeList.length; j++) {
            if(keccak256(abi.encodePacked(SwarmStructs[swarmID].nodeList[j])) == keccak256(abi.encodePacked(nodeUUID)))
            {
                delete SwarmStructs[swarmID].nodeList[j];
                delete NodeStructs[nodeUUID];
            }
        } 
    }

    //returns number of nodes in a swarm
    function getNodeCount(string memory swarmID) public view onlyIfActive() returns(uint256) {

        uint i;
        uint256 trueCount = 0;
        bytes memory nodeEntryBytes;
        
        for(i=0; i<SwarmStructs[swarmID].nodeList.length; i++){
            nodeEntryBytes = bytes(SwarmStructs[swarmID].nodeList[i]);
            if(nodeEntryBytes.length != 0)
            {
                trueCount = trueCount + 1;
            }
        }

        return trueCount;
    }

    //returns number of swarms on the network
    function getSwarmCount() public view onlyIfActive() returns(uint256) {

        uint i;
        uint256 trueCount = 0;
        bytes memory swarmEntryBytes;
        
        for(i=0; i<swarmList.length; i++){
            swarmEntryBytes = bytes(swarmList[i]);
            if(swarmEntryBytes.length != 0)
            {
                trueCount = trueCount + 1;
            }
        }

        return trueCount;
    }

    //returns the specified swarm info
    function getSwarmInfo(string memory swarmID) 
    public view 
    onlyIfActive() 
    returns(uint256 size,
        string memory geo,
        bool trust,
        string memory swarmtype,
        uint256 cost,
        string[] memory nodelist
    ) 
    {
        return (SwarmStructs[swarmID].swarmSize, 
        SwarmStructs[swarmID].swarmGeo, 
        SwarmStructs[swarmID].isTrusted, 
        SwarmStructs[swarmID].swarmType,
        SwarmStructs[swarmID].swarmCost,
        SwarmStructs[swarmID].nodeList);
    }


    //returns the specified swarm info
    function getNodeInfo(string memory swarmID, string memory nodeUUID) 
    public view
    onlyIfActive() 
    returns(uint256 nodeCount,
        string memory nodeHost,
        uint256 nodeHttpPort,
        string memory nodeName,
        uint256 nodePort
    ) 
    {
        uint j;

        for(j=0; j< SwarmStructs[swarmID].nodeList.length; j++) {
            if(keccak256(abi.encodePacked(SwarmStructs[swarmID].nodeList[j])) == keccak256(abi.encodePacked(nodeUUID)))
            {
                return (NodeStructs[nodeUUID].nodeCount,
                NodeStructs[nodeUUID].nodeHost,
                NodeStructs[nodeUUID].nodeHttpPort,
                NodeStructs[nodeUUID].nodeName,
                NodeStructs[nodeUUID].nodePort);
            }
        }

    }

    //returns the list of swarms by swarm id on the network
    function getSwarmList() 
    public view 
    onlyIfActive() 
    returns(string[] memory)
    {
        return swarmList;
    }

    //returns a list of node from a given swarm ID
    function getNodeList(string memory swarmID) 
    public view 
    onlyIfActive()
    returns(string[] memory)
    {
        return SwarmStructs[swarmID].nodeList;
    }

    //deactivate contract
    function deactivateContract() public onlyOwner() {
        isActive = false;
    }
}
