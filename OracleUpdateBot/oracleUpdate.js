const { ethers } = require('ethers');
const Deployments = require('../build/deployments.hoo_testnet.json');
const { BondOracle, SeigniorageOracle } = Deployments;

const [JSON_RPC_API] = process.argv.slice(2);
const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_API);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const Oracle = new ethers.Contract(BondOracle.address, BondOracle.abi, wallet);

async function main() {
  const brequest = await Oracle.functions.update();
  const bReceipt = await brequest.wait(1);
  const srequest = await Oracle.attach(SeigniorageOracle.address).functions.update();
  const sReceipt = await srequest.wait(1);
  return { bReceipt, sReceipt }
}

// Nice way to end a Promise function script
main()
  .then((receipt) => {
    console.info(`Oracle updated at ${new Date().toLocaleString()}`);
    console.info(`Tx hash for BondOracle: ${receipt.bReceipt.transactionHash}`)
    console.info(`Tx hash for SeigniorageOracle: ${receipt.sReceipt.transactionHash}`)
    process.exit(0);
  })
  .catch((error) => {
    console.error(`Error happened when update Oracle: `)
    console.error(error);
    process.exit(1);
  });
