var BESR = artifacts.require("BluzelleESR");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(BESR);
};