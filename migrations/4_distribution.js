const knownContracts = require('./known-contracts');
const { StakingTokens, POOL_START_DATE } = require('./pools');

// Tokens
// deployed first
const Cash = artifacts.require('Cash');
const YSDMultiPool = artifacts.require('YSDMultiPool');
const MockDai = artifacts.require('MockDai');

// ============ Main Migration ============
module.exports = async (deployer, network, accounts) => {
  // for await (const { contractName, token } of bacPools) {
  //   const tokenAddress = knownContracts[token][network] || MockDai.address;
  //   if (!tokenAddress) {
  //     // network is mainnet, so MockDai is not available
  //     throw new Error(`Address of ${token} is not registered on migrations/known-contracts.js!`);
  //   }

  //   const contract = artifacts.require(contractName);
  //   await deployer.deploy(contract, Cash.address, tokenAddress, POOL_START_DATE);
  // }
  await deployer.deploy(YSDMultiPool, Cash.address, accounts[0], POOL_START_DATE); // rewardsToken owner startTime

  for await (const token of StakingTokens) {
    const tokenAddress = knownContracts[token][network] || MockDai.address;
    if (!tokenAddress) {
      // network is mainnet, so MockDai is not available
      throw new Error(`Address of ${token} is not registered on migrations/known-contracts.js!`);
    }

    const multiPool = new web3.eth.Contract(YSDMultiPool.abi, YSDMultiPool.address);
    await multiPool.methods.addSupportedToken(tokenAddress, 1).send({ from: accounts[0], gas: 100000 });
    console.log(`YSDMultiPool::addSupportedToken(${tokenAddress}, 1).send({ from: ${accounts[0]}, gas: 100000 })`);
  }
};
