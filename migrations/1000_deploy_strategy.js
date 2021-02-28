// ============ Contracts ============

const yCreamDAIStrategy = artifacts.require('yCreamDAIStrategy');
const yCreamUSDCStrategy = artifacts.require('yCreamUSDCStrategy');
const yForTubeBUSDStrategy = artifacts.require('yForTubeBUSDStrategy');
const yForTubeUSDTStrategy = artifacts.require('yForTubeUSDTStrategy');

// const knownContracts = require('./known-contracts');

const migration = async (deployer) => {
  await deployer.deploy(yCreamDAIStrategy);
  await deployer.deploy(yCreamUSDCStrategy);
  await deployer.deploy(yForTubeBUSDStrategy);
  await deployer.deploy(yForTubeUSDTStrategy);
}

module.exports = migration