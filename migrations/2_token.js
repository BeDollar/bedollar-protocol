// ============ Contracts ============

// Token
// deployed first
const Cash = artifacts.require('Cash')
const Bond = artifacts.require('Bond')
const SimpleERCFund = artifacts.require('SimpleERCFund');
const Share = artifacts.require('Share')
const MockDai = artifacts.require('MockDai');

const knownContracts = require('./known-contracts');

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([deployToken(deployer, network, accounts)])
}

module.exports = migration

// ============ Deploy Functions ============

async function deployToken(deployer, network, accounts) {
  await deployer.deploy(Cash);
  await deployer.deploy(Bond);
  await deployer.deploy(Share);
  await deployer.deploy(SimpleERCFund)

  if (!knownContracts.DAI[network]) {
    const dai = await deployer.deploy(MockDai);
    console.log(`MockDAI address: ${dai.address}`);
  }
}
