// ============ Contracts ============
const YSDMultiPool = artifacts.require('YSDMultiPool');

const yCreamDAIStrategy = artifacts.require('yCreamDAIStrategy');
const yCreamUSDCStrategy = artifacts.require('yCreamUSDCStrategy');
const yForTubeBUSDStrategy = artifacts.require('yForTubeBUSDStrategy');
const yForTubeUSDTStrategy = artifacts.require('yForTubeUSDTStrategy');

const knownContracts = require('./known-contracts');

const migration = async (deployer, network, accounts) => {
  const multiPool = new web3.eth.Contract(YSDMultiPool.abi, YSDMultiPool.address);
  if (knownContracts.DAI[network]) await multiPool.methods.addYToken(knownContracts.DAI[network], yCreamDAIStrategy.address).send({ from: accounts[0] });
  if (knownContracts.USDC[network]) await multiPool.methods.addYToken(knownContracts.USDC[network], yCreamUSDCStrategy.address).send({ from: accounts[0] });
  if (knownContracts.BUSD[network]) await multiPool.methods.addYToken(knownContracts.BUSD[network], yForTubeBUSDStrategy.address).send({ from: accounts[0] });
  if (knownContracts.USDT[network]) await multiPool.methods.addYToken(knownContracts.USDT[network], yForTubeUSDTStrategy.address).send({ from: accounts[0] });
}

module.exports = migration