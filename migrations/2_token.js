// ============ Contracts ============

// Token
// deployed first
const Cash = artifacts.require('Cash')
const Bond = artifacts.require('Bond')
const SimpleERCFund = artifacts.require('SimpleERCFund');
const Share = artifacts.require('Share')
const MockDai = artifacts.require('MockDai');
const MockY3d = artifacts.require('MockY3d');

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

  if (!knownContracts.BUSD[network]) {
    const dai = await deployer.deploy(MockDai);
    console.log(`MockDAI address: ${dai.address}`);
  }

  if (!knownContracts.Y3D[network]) {
    const my3d = await deployer.deploy(MockY3d);
    console.log(`Mock Y3D address: ${my3d.address}`);
  }

}
