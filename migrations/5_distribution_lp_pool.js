const knownContracts = require('./known-contracts');
const { POOL_START_DATE } = require('./pools');

const Cash = artifacts.require('Cash');
const Share = artifacts.require('Share');
// const Oracle = artifacts.require('Oracle');
const MockDai = artifacts.require('MockDai');
const IERC20 = artifacts.require('IERC20');

const DAIYSDLPToken_YSSPool = artifacts.require('DAIYSDLPTokenSharePool')
const DAIYSSLPToken_YSSPool = artifacts.require('DAIYSSLPTokenSharePool')

const UniswapV2Factory = artifacts.require('UniswapV2Factory');

module.exports = async (deployer, network, accounts) => {
  const uniswapFactory = ['dev'].includes(network)
    ? await UniswapV2Factory.deployed()
    : await UniswapV2Factory.at(knownContracts.UniswapV2Factory[network]);
  const dai = knownContracts.TargetedStableCoin[network]
    ? await IERC20.at(knownContracts.TargetedStableCoin[network])
    : await MockDai.deployed();

  // const oracle = await Oracle.deployed();

  // @XXX: remember to switch codehash for Oracle if you switch swap/network
  // const dai_bac_lpt = await oracle.pairFor(uniswapFactory.address, Cash.address, dai.address);
  // const dai_bas_lpt = await oracle.pairFor(uniswapFactory.address, Share.address, dai.address);
  const [dai_bac_lpt, dai_bas_lpt] = await Promise.all([
    uniswapFactory.getPair(Cash.address, dai.address),
    uniswapFactory.getPair(Share.address, dai.address)
  ])
  // const dai_bac_lpt = await uniswapFactory.getPair(Cash.address, dai.address);
  // const dai_bas_lpt = await uniswapFactory.getPair(Share.address, dai.address);

  await deployer.deploy(DAIYSDLPToken_YSSPool, Share.address, dai_bac_lpt, POOL_START_DATE);
  await deployer.deploy(DAIYSSLPToken_YSSPool, Share.address, dai_bas_lpt, POOL_START_DATE);
};
