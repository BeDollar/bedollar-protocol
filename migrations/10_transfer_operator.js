const Boardroom = artifacts.require('Boardroom');
const Treasury = artifacts.require('Treasury');
const Cash = artifacts.require('Cash');
const Bond = artifacts.require('Bond');
const Share = artifacts.require('Share');
const Timelock = artifacts.require('Timelock');

const DAY = 86400;

async function handleTransferOperatorAndOwnership(contract, accounts, operatorTo, ownerTo) {
    if (await contract.isOperator()) await contract.transferOperator(operatorTo);
    if ((await contract.owner()) === accounts[0]) await contract.transferOwnership(ownerTo);
}

module.exports = async (deployer, network, accounts) => {
  const cash = await Cash.deployed();
  const share = await Share.deployed();
  const bond = await Bond.deployed();
  const treasury = await Treasury.deployed();
  const boardroom = await Boardroom.deployed();
  const timelock = await Timelock.deployed();

  for await (const contract of [cash, share, bond]) {
    await handleTransferOperatorAndOwnership(contract, accounts, treasury.address, treasury.address);
  }

  await handleTransferOperatorAndOwnership(boardroom, accounts, treasury.address, timelock.address)
  await handleTransferOperatorAndOwnership(treasury, accounts, timelock.address, timelock.address);

  console.log(`Transferred the operator role from the deployer (${accounts[0]}) to Treasury (${Treasury.address})`);
}
