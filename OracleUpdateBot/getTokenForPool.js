const { ethers } = require('ethers');
const { abi } = require('./ABI/LPTokenWrapper.json');

const [JSON_RPC_API, POOL_ADDRESS] = process.argv.slice(2);
const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_API);
// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const LPTWrapper = new ethers.Contract(POOL_ADDRESS, abi, provider);

async function main() {
    const res = await LPTWrapper.callStatic.lpt();
    return res;
}

// Nice way to end a Promise function script
main()
  .then((res) => {
    console.info(`Oracle ${POOL_ADDRESS} wrapped token: ${res}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`Error happened when update Oracle ${POOL_ADDRESS}: `)
    console.error(error);
    process.exit(1);
  });
