pragma solidity >=0.4.21 <0.6.0;

contract BluzelleESR {
    bool public isActive = false;
    address public ownerAddress;

    struct Node {
        uint256 nodeCount;
        bytes32 nodeHostName;
        bytes32 nodeStatus;  
    }

    struct Swarm {
        uint256 swarmCount;
        uint256 swarmSize;
        bytes32 swarmGeo;
        bool isTrusted;
        bytes32 swarmType;
        uint256 swarmCost;
        bytes32[] nodeList; 
    }

    bytes32[] swarmList;
    mapping(bytes32 => Node) NodeStructs;
    mapping(bytes32 => Swarm) SwarmStructs;

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
    function addSwarm(bytes32 swarmID, uint256 swarmSize, bytes32 swarmGeo, bool isTrusted, bytes32 swarmType, uint256 swarmCost, bytes32[] memory nodeList) 
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
    function removeSwarm(bytes32 swarmID) public onlyOwner(){
        require(swarmList[(SwarmStructs[swarmID].swarmCount) - 1].length > 0,"This Swarm has already been removed.");
        //creates a gap in the array, no automatic element shift
        delete swarmList[(SwarmStructs[swarmID].swarmCount) - 1];
    }

    //add node to a swarm given the swarm ID
    function addNode(bytes32 swarmID, bytes32 nodeHostName, bytes32 nodeStatus) 
    public 
    onlyOwner()
    returns(bool success)
    {
        NodeStructs[swarmID].nodeCount = getNodeCount(swarmID) + 1;
        NodeStructs[swarmID].nodeHostName = nodeHostName;
        NodeStructs[swarmID].nodeStatus = nodeStatus;

        SwarmStructs[swarmID].nodeList.push(nodeHostName);

        return true;
    }

    //remove node from a swarm given the swarmID and nodehostname
    function removeNode(bytes32 swarmID, bytes32 nodeHostName) 
    public 
    onlyOwner()
    returns(bool success)
    {
        require(NodeStructs[swarmID].nodeHostName == nodeHostName, "No nodes with that host name located in the swarm");
        require(SwarmStructs[swarmID].nodeList[(NodeStructs[swarmID].nodeCount) - 1].length > 0,"This node has already been removed.");

        delete SwarmStructs[swarmID].nodeList[(NodeStructs[swarmID].nodeCount) - 1];

        return true;
    }

    //returns number of nodes in a swarm
    function getNodeCount(bytes32 swarmID) public view onlyIfActive() returns(uint256) {
        return (SwarmStructs[swarmID].nodeList.length);
    }

    //returns number of swarms on the network
    function getSwarmCount() public view onlyIfActive() returns(uint256) {
        return (swarmList.length);
    }

    //returns the specified swarm info
    function getSwarmInfo(bytes32 swarmID) 
    public view 
    onlyIfActive() 
    returns(uint256 size,
        bytes32 geo,
        bool trust,
        bytes32 swarmtype,
        uint256 cost,
        bytes32[] memory nodelist
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
    function getNodeInfo(bytes32 swarmID, bytes32 nodeHostName) 
    public view 
    onlyIfActive() 
    returns(bytes32 hostname, bytes32 status) 
    {
        require(NodeStructs[swarmID].nodeHostName == nodeHostName, "No node with that hostname in the swarm");
        
        return (NodeStructs[swarmID].nodeHostName, NodeStructs[swarmID].nodeStatus);
    }

    //returns the list of swarms by swarm id on the network
    function getSwarmList() 
    public view 
    onlyIfActive() 
    returns(bytes32[] memory)
    {
        return swarmList;
    }

    //returns a list of node from a given swarm ID
    function getNodeList(bytes32 swarmID) 
    public view 
    onlyIfActive()
    returns(bytes32[] memory)
    {
        return SwarmStructs[swarmID].nodeList;
    }

    //deactivate contract
    function deactivateContract() public onlyOwner() {
        isActive = false;
    }
}
