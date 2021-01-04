const Timelock = artifacts.require('Timelock');

const DAY = 86400;

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(Timelock, accounts[0], 2 * DAY);
}
