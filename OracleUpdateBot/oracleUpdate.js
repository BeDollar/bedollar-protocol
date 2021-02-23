const { ethers } = require('ethers');
const OracleJSON = require('./ABI/Oracle.json');

const oracleAddress = process.env.ORACLE_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_API);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const Oracle = new ethers.Contract(oracleAddress, OracleJSON.abi, wallet);

async function main() {
    const request = await Oracle.functions.update();
    return request.wait(1);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
