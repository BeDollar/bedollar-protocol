// https://docs.basis.cash/mechanisms/yield-farming
const INITIAL_YSD_FOR_POOLS = 50000;
const INITIAL_YSS_FOR_DAI_YSD = 750000;
const INITIAL_YSS_FOR_DAI_YSS = 250000;

const POOL_START_DATE = Date.parse('2021-02-28T12:00:00Z') / 1000;

// const bacPools = [
//   { contractName: 'YSDDAIPool', token: 'DAI' },
//   // { contractName: 'YSDSUSDPool', token: 'SUSD' },
//   { contractName: 'YSDUSDCPool', token: 'USDC' },
//   { contractName: 'YSDUSDTPool', token: 'USDT' },
//   // { contractName: 'YSDyCRVPool', token: 'yCRV' },
// ];

const StakingTokens = ['BUSD', 'DAI', 'USDC', 'USDT']

const basPools = {
  BUSDYSD: { contractName: 'BUSDYSDLPTokenSharePool', token: 'BUSD_YSD-LPv2' },
  BUSDYSS: { contractName: 'BUSDYSSLPTokenSharePool', token: 'BUSD_YSS-LPv2' },
}

module.exports = {
  POOL_START_DATE,
  INITIAL_YSD_FOR_POOLS,
  INITIAL_YSS_FOR_DAI_YSD,
  INITIAL_YSS_FOR_DAI_YSS,
  // bacPools,
  StakingTokens,
  basPools,
};
