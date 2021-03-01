const { ethers } = require('ethers');
const OracleJSON = require('./ABI/Oracle.json');

const [JSON_RPC_API, ORACLE_ADDRESS] = process.argv.slice(2);
const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_API);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const Oracle = new ethers.Contract(ORACLE_ADDRESS, OracleJSON.abi, wallet);

async function main() {
    const request = await Oracle.functions.update();
    return request.wait(1);
}

// Nice way to end a Promise function script
main()
  .then((receipt) => {
    console.info(`Oracle ${ORACLE_ADDRESS} updated at ${new Date().toLocaleString()}`);
    console.info(`Tx hash: ${receipt.transactionHash}`)
    process.exit(0);
  })
  .catch((error) => {
    console.error(`Error happened when update Oracle ${ORACLE_ADDRESS}: `)
    console.error(error);
    process.exit(1);
  });
