const {
  basPools,
  INITIAL_YSS_FOR_DAI_YSD,
  INITIAL_YSS_FOR_DAI_YSS,
} = require('./pools');

// Pools
// deployed first
const Share = artifacts.require('Share');
const InitialShareDistributor = artifacts.require('InitialShareDistributor');

// ============ Main Migration ============

async function migration(deployer, network, accounts) {
  const unit = web3.utils.toBN(10 ** 18);
  const totalBalanceForDAIYSD = unit.muln(INITIAL_YSS_FOR_DAI_YSD)
  const totalBalanceForDAIYSS = unit.muln(INITIAL_YSS_FOR_DAI_YSS)
  const totalBalance = totalBalanceForDAIYSD.add(totalBalanceForDAIYSS);

  const share = await Share.deployed();

  const lpPoolDAIYSD = artifacts.require(basPools.BUSDYSD.contractName);
  const lpPoolDAIYSS = artifacts.require(basPools.BUSDYSS.contractName);

  await deployer.deploy(
    InitialShareDistributor,
    share.address,
    lpPoolDAIYSD.address,
    totalBalanceForDAIYSD.toString(),
    lpPoolDAIYSS.address,
    totalBalanceForDAIYSS.toString(),
  );
  const distributor = await InitialShareDistributor.deployed();

  await share.mint(distributor.address, totalBalance.toString());
  console.log(`Deposited ${INITIAL_YSS_FOR_DAI_YSD} YSS to InitialShareDistributor.`);

  console.log(`Setting distributor to InitialShareDistributor (${distributor.address})`);
  await lpPoolDAIYSD.deployed().then(pool => pool.setRewardDistribution(distributor.address));
  await lpPoolDAIYSS.deployed().then(pool => pool.setRewardDistribution(distributor.address));

  await distributor.distribute();
}

module.exports = migration;
