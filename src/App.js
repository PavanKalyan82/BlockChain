/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/

/*import React, { useState, useEffect } from 'react';
import getWeb3 from './utils/web3';

function App() {
  const [account, setAccount] = useState(null);

  // Use Effect to run when the app loads
  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]); // Set the first account from MetaMask
      } catch (error) {
        console.error("Failed to load web3 or accounts:", error);
      }
    };
    init();
  }, []); // Empty array ensures this effect only runs once on component load

  return (
    <div>
      <h1>NFTBazaar</h1>
      <p>Connected Account: {account ? account : "Not connected"}</p>
    </div>
  );
}

export default App;
*/

// src/App.js

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import nftBazaarABI from './utils/nftbazaarABI.json';
import './styles.css';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with your contract address

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [newNft, setNewNft] = useState({ name: '', image: '' });
  let web3;

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        web3 = new Web3(window.ethereum); // Initialize Web3
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = nftBazaarABI.networks[networkId]?.address;

        if (deployedNetwork) {
          const nftBazaarContract = new web3.eth.Contract(nftBazaarABI, deployedNetwork);
          setContract(nftBazaarContract);
        } else {
          alert("Please connect to the correct Ethereum network.");
        }

      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert('Please install MetaMask to use this DApp!');
    }
  };

  const mintNft = async () => {
    if (contract && newNft.name && newNft.image) {
      await contract.methods
        .mint(newNft.image)
        .send({ from: account });
      alert('NFT minted!');
    }
  };

  const handlePurchase = async (tokenId) => {
    if (contract) {
      await contract.methods.buyNFT(tokenId).send({ from: account, value: web3.utils.toWei('0.1', 'ether') });
      alert('NFT purchased!');
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || '');
      });
    }
  }, []);

  return (
    <div className="App">
      <h1>NFTBazaar - Decentralized NFT Marketplace</h1>
      {account ? (
        <p>Connected Wallet: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}

      <h2>Mint New NFT</h2>
      <input
        type="text"
        placeholder="NFT Name"
        value={newNft.name}
        onChange={(e) => setNewNft({ ...newNft, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="NFT Image URL"
        value={newNft.image}
        onChange={(e) => setNewNft({ ...newNft, image: e.target.value })}
      />
      <button onClick={mintNft}>Mint NFT</button>

      <h2>Available NFTs</h2>
      <div className="nft-list">
        {nfts.map((nft, index) => (
          <div key={index} className="nft-card">
            <img src={nft} alt="NFT" />
            <button onClick={() => handlePurchase(index + 1)}>Buy NFT</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;