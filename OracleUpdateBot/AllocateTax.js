const { ethers } = require('ethers');
const Deployments = require('../build/deployments.hoo_testnet.json');
const { Treasury } = Deployments;
const [JSON_RPC_API] = process.argv.slice(2);
const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_API);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const TreasuryContract = new ethers.Contract(Treasury.address, Treasury.abi, wallet);

async function main() {
    const [ initialized ] = await TreasuryContract.functions.initialized();
    console.info('is initialized:', initialized)
    if (!initialized) {
      console.info("Init Treasury")
      const initReq = await TreasuryContract.functions.initialize();
      await initReq.wait(2);
    }
    const request = await TreasuryContract.functions.allocateSeigniorage();
    return request.wait(1);
}

// Nice way to end a Promise function script
main()
  .then((receipt) => {
    console.info(`Tax Allocated ${Treasury.address} at ${new Date().toLocaleString()}`);
    console.info(`Tx hash: ${receipt.transactionHash}`)
    process.exit(0);
  })
  .catch((error) => {
    console.error(`Error happened when Allocate Tax in ${Treasury.address}: `)
    console.error(error);
    process.exit(1);
  });
