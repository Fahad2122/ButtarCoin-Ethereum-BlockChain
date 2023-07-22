const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  //connecting blockchain
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  //reading abi and bytecode
  const abi = fs.readFileSync("./Coin_sol_buttarCoin.abi", "utf8");
  const binary = fs.readFileSync("./Coin_sol_buttarCoin.bin", "utf8");

  //deploying the contract
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, Please wait...");
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);

  //set Owner name and then read address of that name
  const setPersonName = await contract.setMinterName("Fahad");
  await setPersonName.wait(1);
  const personName = await contract.person("Fahad");
  console.log(`Fahad address is: ${personName}`);

  //mint the coins for Fahad
  console.log("Minting Buttar Coin, Please wait...");
  const mintCoin = await contract.mint("Fahad", "1000");
  await mintCoin.wait(1);

  //get balance for Fahad
  let fahadBalance = await contract.getBalance("Fahad");
  console.log(`Fahad's Balance is: ${fahadBalance}`);

  //register a person
  const registerPerson = await contract.registerPerson(
    "Ahmad",
    "0x7276eFC7c5FAEeE4d775FFF5ABDFaD865Ebee308"
  );
  await registerPerson.wait(1);

  //send Coin to Ahmad
  console.log("Sending Buttar Coin, Please wait...");
  const sendCoin = await contract.send("Ahmad", "400");
  await sendCoin.wait(1);

  //get balance of Ahmad
  let ahmadBalance = await contract.getBalance("Ahmad");
  console.log(`Ahmad's Balance is: ${ahmadBalance}`);

  //get balance for Fahad
  fahadBalance = await contract.getBalance("Fahad");
  console.log(`Fahad's Balance is: ${fahadBalance}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
