require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.27", // Solidity version to compile the contracts
  networks: {
    hardhat: {
      chainId: 1337, // Local network chain ID
    },
    localhost: {
      url: "http://127.0.0.1:8545", // RPC URL for Hardhat's local node
    },
  },
};

