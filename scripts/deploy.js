/*const Web3 = require('web3');
const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  // Connect Web3 to the Hardhat network
  const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
  const web3 = new Web3(provider);

  // Get accounts
  const accounts = await web3.eth.getAccounts();
  const deployer = accounts[0];
  console.log("Deploying contracts with the account:", deployer);

  // Retrieve the contract ABI and bytecode from Hardhat artifacts
  const NFTBazaarFactory = await hre.artifacts.readArtifact("NFTBazaar");
  const NFTBazaarContract = new web3.eth.Contract(NFTBazaarFactory.abi);

  // Deploy the contract
  const nftBazaar = await NFTBazaarContract.deploy({
    data: NFTBazaarFactory.bytecode,
    arguments: [1] // Adjust if your constructor has different arguments
  }).send({
    from: deployer,
    gas: 3000000,
  });

  console.log("NFTBazaar contract deployed to:", nftBazaar.options.address);

  // Save the contract's ABI and address for frontend usage
  saveFrontendFiles(nftBazaar, "NFTBazaar");
}

function saveFrontendFiles(contract, name) {
  const contractsDir = path.join(__dirname, "../frontend/contractsData");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save the contract address
  fs.writeFileSync(
    path.join(contractsDir, `${name}-address.json`),
    JSON.stringify({ address: contract.options.address }, null, 2)
  );

  // Save the contract ABI
  const contractArtifact = hre.artifacts.readArtifactSync(name);
  fs.writeFileSync(
    path.join(contractsDir, `${name}.json`),
    JSON.stringify(contractArtifact, null, 2)
  );

  console.log(`ABI and address saved to ${contractsDir}`);
}

// Execute the main function and handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in deployment:", error);
    process.exit(1);
  });*/


  const Web3 = require('web3');
  const fs = require('fs');
  const path = require('path');
  
  async function main() {
    // Use Hardhat's local provider URL
    const providerUrl = 'http://127.0.0.1:8545';
  
    // Initialize Web3 with a valid provider
    const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
  
    // Get accounts from Web3
    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0];
    console.log("Deploying contracts with the account:", deployer);
  
    // Check the balance
    const balance = await web3.eth.getBalance(deployer);
    console.log("Account balance:", web3.utils.fromWei(balance, 'ether'), "ETH");
  
    // Load the compiled contract artifact
    const NFTBazaarArtifact = JSON.parse(fs.readFileSync('./artifacts/contracts/NFTBazaar.sol/NFTBazaar.json', 'utf8'));
    const NFTBazaar = new web3.eth.Contract(NFTBazaarArtifact.abi);
  
    // Deploy the contract with any required constructor parameters
    const feePercent = 1;  // Adjust feePercent if necessary
    const nftBazaar = await NFTBazaar.deploy({
      data: NFTBazaarArtifact.bytecode,
      arguments: [feePercent]
    }).send({
      from: deployer,
      gas: 5000000,
      gasPrice: web3.utils.toWei('10', 'gwei'),
    });
  
    console.log("NFTBazaar contract deployed to:", nftBazaar.options.address);
  
    // Save the contract ABI and address for frontend use
    saveFrontendFiles(nftBazaar, 'NFTBazaar');
  }
  
  // Save the contract address and ABI for the frontend
  function saveFrontendFiles(contract, name) {
    const contractsDir = path.join(__dirname, '../frontend/contractsData');
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir, { recursive: true });
    }
  
    // Save contract address
    fs.writeFileSync(
      path.join(contractsDir, `${name}-address.json`),
      JSON.stringify({ address: contract.options.address }, null, 2)
    );
  
    // Save contract ABI
    fs.writeFileSync(
      path.join(contractsDir, `${name}.json`),
      JSON.stringify(contract.options.jsonInterface, null, 2)
    );
  
    console.log(`ABI and address saved to ${contractsDir}`);
  }
  
  // Execute the main function and handle errors
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error in deployment:", error);
      process.exit(1);
    });
  