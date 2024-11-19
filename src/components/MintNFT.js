// MintNFT.js
import React, { useState } from 'react';

const MintNFT = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Simulate an IPFS upload and pass the file name and URL to parent component
      const fileName = selectedFile.name;
      const fileUrl = `https://ipfs.io/ipfs/your_generated_hash`; // Replace with actual IPFS URL
      onFileUpload(fileName, fileUrl);
    }
  };

  return (
    <div className="mint-nft-container">
      <h2>Mint Your NFT</h2>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default MintNFT;

// src/components/MintNFT.js

// MintNFT.js
/*import React, { useState } from 'react';
import { uploadToIPFS } from '../utils/ipfsClient';
import Web3 from 'web3';

const MintNFT = ({ nft, account }) => {
  const [file, setFile] = useState(null);
  const [tokenURI, setTokenURI] = useState('');

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileUrl = await uploadToIPFS(selectedFile);
      setFile(selectedFile);
      setTokenURI(fileUrl);
    }
  };

  const mintNFT = async () => {
    if (!tokenURI) {
      alert("Please upload a file first.");
      return;
    }

    try {
      await nft.methods.mintNFT(account, tokenURI).send({ from: account });
      alert("NFT Minted Successfully!");
    } catch (error) {
      console.error("Failed to mint NFT:", error);
      alert("Failed to mint NFT.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Mint Your NFT</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={mintNFT} style={{ marginTop: '10px' }}>Mint NFT</button>
    </div>
  );
};

export default MintNFT;*/
