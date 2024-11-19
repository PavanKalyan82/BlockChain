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

/*import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import nftBazaarABI from './utils/nftbazaarABI.json';
import './styles.css';

const CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // Replace with your contract address

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

export default App;*/

/*import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { uploadToIPFS } from './utils/ipfsClient'; // Assuming this is correctly exporting the upload function
import nftBazaarABI from './utils/nftbazaarABI.json';
import './styles.css';

// Replace with your actual contract address
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [newNft, setNewNft] = useState({ name: '', image: '' });
  const [view, setView] = useState('create'); // State to control the current view (create, market, list, purchase)

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = nftBazaarABI.networks[networkId]?.address;

        if (deployedNetwork) {
          const nftBazaarContract = new web3.eth.Contract(nftBazaarABI, deployedNetwork);
          setContract(nftBazaarContract);
          fetchNfts(nftBazaarContract); // Fetch NFTs once the contract is set
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

  const fetchNfts = async (contract) => {
    // Fetch NFTs from contract
    const totalSupply = await contract.methods.totalSupply().call();
    const nftArray = [];
    for (let i = 0; i < totalSupply; i++) {
      const tokenId = await contract.methods.tokenByIndex(i).call();
      const tokenURI = await contract.methods.tokenURI(tokenId).call();
      nftArray.push({ tokenId, tokenURI });
    }
    setNfts(nftArray);
  };

  const mintNft = async () => {
    if (contract && newNft.name && newNft.image) {
      try {
        await contract.methods
          .mintNFT(account, newNft.image)
          .send({ from: account });
        alert('NFT minted!');
        fetchNfts(contract); // Refresh the list after minting
      } catch (error) {
        console.error('Error minting NFT:', error);
      }
    } else {
      alert('Contract not initialized or incomplete NFT data');
    }
  };

  const purchaseNft = async (tokenId) => {
    try {
      await contract.methods.purchaseNFT(tokenId).send({ from: account });
      alert('NFT purchased!');
      fetchNfts(contract); // Refresh the list after purchase
    } catch (error) {
      console.error('Error purchasing NFT:', error);
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
      <header className="header">
        <h1>NFTBazaar - Decentralized NFT Marketplace</h1>
        {account ? (
          <p>Connected Wallet: {account}</p>
        ) : (
          <button className="connect-btn" onClick={connectWallet}>Connect Wallet</button>
        )}
      </header>

      <nav className="navigation">
        <button onClick={() => setView('create')}>Create NFT</button>
        <button onClick={() => setView('market')}>Market</button>
        <button onClick={() => setView('list')}>My NFTs</button>
        <button onClick={() => setView('purchase')}>Purchase NFTs</button>
      </nav>

      <main className="content">
        {view === 'create' && (
          <section className="create-section">
            <h2>Create New NFT</h2>
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
          </section>
        )}

        {view === 'market' && (
          <section className="market-section">
            <h2>Market NFTs</h2>
            {/* Add Market NFT Listings here *//*}
            <p>Market feature coming soon!</p>
          </section>
        )}

        {view === 'list' && (
          <section className="list-section">
            <h2>Your Minted NFTs</h2>
            {nfts.length > 0 ? (
              <ul>
                {nfts.map((nft, index) => (
                  <li key={index}>
                    Token ID: {nft.tokenId}, Image: {nft.tokenURI}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No NFTs available.</p>
            )}
          </section>
        )}

        {view === 'purchase' && (
          <section className="purchase-section">
            <h2>Available NFTs for Purchase</h2>
            {nfts.length > 0 ? (
              <ul>
                {nfts.map((nft, index) => (
                  <li key={index}>
                    Token ID: {nft.tokenId}, Image: {nft.tokenURI}
                    <button onClick={() => purchaseNft(nft.tokenId)}>Purchase</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No NFTs available for purchase.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;*/

// src/App.js

// App.js
/*import React, { useState } from 'react';
import Web3 from 'web3';
import nftBazaarABI from './utils/nftbazaarABI.json';
import MintNFT from './components/MintNFT';
import CreateNFT from './components/CreateNFT';
import Market from './components/Market';
import MyNFTs from './components/MyNFTs';
import './styles.css';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [view, setView] = useState('mint');

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      const web3 = new Web3(window.ethereum);
      const contractInstance = new web3.eth.Contract(nftBazaarABI, CONTRACT_ADDRESS);
      setContract(contractInstance);
    } else {
      alert("Please install MetaMask to use this app.");
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>NFTBazaar - Decentralized NFT Marketplace</h1>
        {account ? (
          <p>Connected Wallet: {account}</p>
        ) : (
          <button className="connect-btn" onClick={connectWallet}>Connect Wallet</button>
        )}
      </header>

      <nav className="navigation">
        <button onClick={() => setView('mint')}>Mint NFT</button>
        <button onClick={() => setView('list')}>List NFT</button>
        <button onClick={() => setView('market')}>Market</button>
        <button onClick={() => setView('myNFTs')}>My NFTs</button>
      </nav>

      <main className="content">
        {view === 'mint' && <MintNFT nft={contract} account={account} />}
        {view === 'list' && <CreateNFT marketplace={contract} nft={contract} account={account} />}
        {view === 'market' && <Market contract={contract} account={account} />}
        {view === 'myNFTs' && <MyNFTs contract={contract} account={account} />}
      </main>
    </div>
  );
}

export default App;*/


import React, { useState } from 'react';
import Web3 from 'web3';
import CreateNFT from './components/CreateNFT';
import MintNFT from './components/MintNFT';
import PurchaseNFT from './components/PurchaseNFT';
import Market from './components/Market';
import MyNFTs from './components/MyNFTs';
import ListNFTs from './components/ListNFTs';
import './styles.css';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [view, setView] = useState('create'); // Controls which component to show

  // Function to connect MetaMask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        const web3 = new Web3(window.ethereum);

        // Load contract ABI and connect to it
        const contractABI = require('./contractsData/NFTBazaar.json').abi;
        const nftContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
        setContract(nftContract);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  // Function to render selected component based on `view` state
  const renderContent = () => {
    if (!account) {
      return <p>Please connect your wallet to use the app.</p>;
    }

    switch (view) {
      case 'create':
        return <CreateNFT contract={contract} account={account} />;
      case 'mint':
        return <MintNFT contract={contract} account={account} />;
      case 'market':
        return <Market contract={contract} account={account} />;
      case 'myNFTs':
        return <MyNFTs contract={contract} account={account} />;
      case 'list':
        return <ListNFTs contract={contract} account={account} />;
      case 'purchase':
        return <PurchaseNFT contract={contract} account={account} />;
      default:
        return <CreateNFT contract={contract} account={account} />;
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>NFTBazaar - Decentralized NFT Marketplace</h1>
        {account ? (
          <p>Connected Wallet: {account}</p>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </header>

      {/* Navigation */}
      <nav className="navigation">
        <button onClick={() => setView('create')}>Create NFT</button>
        <button onClick={() => setView('mint')}>Mint NFT</button>
        <button onClick={() => setView('market')}>Market</button>
        <button onClick={() => setView('myNFTs')}>My NFTs</button>
        <button onClick={() => setView('list')}>List NFTs</button>
        <button onClick={() => setView('purchase')}>Purchase NFT</button>
      </nav>

      {/* Render Content */}
      <main className="content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
