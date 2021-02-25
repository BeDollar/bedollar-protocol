// https://docs.basis.cash/mechanisms/yield-farming
const INITIAL_YSD_FOR_POOLS = 50000;
const INITIAL_YSS_FOR_DAI_YSD = 750000;
const INITIAL_YSS_FOR_DAI_YSS = 250000;

const POOL_START_DATE = Date.parse('2021-02-23T00:00:00Z') / 1000;

const bacPools = [
  { contractName: 'YSDDAIPool', token: 'DAI' },
  // { contractName: 'YSDSUSDPool', token: 'SUSD' },
  { contractName: 'YSDUSDCPool', token: 'USDC' },
  { contractName: 'YSDUSDTPool', token: 'USDT' },
  // { contractName: 'YSDyCRVPool', token: 'yCRV' },
];

const StakingTokens = ['TargetedStableCoin', 'USDC', 'USDT']

const basPools = {
  DAIYSD: { contractName: 'DAIYSDLPTokenSharePool', token: 'DAI_YSD-LPv2' },
  DAIYSS: { contractName: 'DAIYSSLPTokenSharePool', token: 'DAI_YSS-LPv2' },
}

module.exports = {
  POOL_START_DATE,
  INITIAL_YSD_FOR_POOLS,
  INITIAL_YSS_FOR_DAI_YSD,
  INITIAL_YSS_FOR_DAI_YSS,
  bacPools,
  StakingTokens,
  basPools,
};
