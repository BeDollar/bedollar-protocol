const {
  basPools,
  INITIAL_YSS_FOR_BUSD_YSD,
  INITIAL_YSS_FOR_BUSD_YSS,
  INITIAL_YSS_FOR_BUSD_Y3D
} = require('./pools');

// Pools
// deployed first
const Share = artifacts.require('Share');
const InitialShareDistributor = artifacts.require('InitialShareDistributor');

// ============ Main Migration ============

async function migration(deployer, network, accounts) {
  const unit = web3.utils.toBN(10 ** 18);
  const totalBalanceForBUSDYSD = unit.muln(INITIAL_YSS_FOR_BUSD_YSD)
  const totalBalanceForBUSDYSS = unit.muln(INITIAL_YSS_FOR_BUSD_YSS)
  const totalBalanceForBUSDY3D = unit.muln(INITIAL_YSS_FOR_BUSD_Y3D)
  const totalBalance = totalBalanceForBUSDYSD.add(totalBalanceForBUSDYSS).add(totalBalanceForBUSDY3D);

  const share = await Share.deployed();

  const lpPoolBUSDYSD = artifacts.require(basPools.BUSDYSD.contractName);
  const lpPoolBUSDYSS = artifacts.require(basPools.BUSDYSS.contractName);
  const lpPoolBUSDY3D = artifacts.require(basPools.BUSDY3D.contractName);

  await deployer.deploy(
    InitialShareDistributor,
    share.address,
    lpPoolBUSDYSD.address,
    totalBalanceForBUSDYSD.toString(),
    lpPoolBUSDYSS.address,
    totalBalanceForBUSDYSS.toString(),
    lpPoolBUSDY3D.address,
    totalBalanceForBUSDY3D.toString(),
  );
  const distributor = await InitialShareDistributor.deployed();

  await share.mint(distributor.address, totalBalance.toString());
  console.log(`Deposited ${INITIAL_YSS_FOR_BUSD_YSD} YSS to InitialShareDistributor.`);

  console.log(`Setting distributor to InitialShareDistributor (${distributor.address})`);
  await lpPoolBUSDYSD.deployed().then(pool => pool.setRewardDistribution(distributor.address));
  await lpPoolBUSDYSS.deployed().then(pool => pool.setRewardDistribution(distributor.address));
  await lpPoolBUSDY3D.deployed().then(pool => pool.setRewardDistribution(distributor.address));

  await distributor.distribute();
}

module.exports = migration;
