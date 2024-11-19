/*import React, { useState } from 'react';
import { Row, Form, Button } from 'react-bootstrap';
import Web3 from 'web3';
import { uploadToIPFS } from '../utils/ipfsClient';

const CreateNFT = ({ marketplace, nft, account }) => {
  const [fileName, setFileName] = useState('');
  const [fileURL, setFileURL] = useState('');
  const [price, setPrice] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Upload file to IPFS
  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      try {
        const result = await client.add(file);
        setFileName(file.name);
        setFileURL(`http://localhost:3001/ipfs/${result.path}`);
      } catch (error) {
        console.log("IPFS image upload error: ", error);
        alert(`Failed to upload image to IPFS: ${error}`);
      }
    }
  };

  // Create NFT and list it on marketplace
  const createNFT = async () => {
    if (!fileURL || !price || !name || !description) {
      alert("All fields are required.");
      return;
    }

    try {
      const metadata = JSON.stringify({ image: fileURL, price, name, description });
      const metadataResult = await client.add(metadata);
      await mintAndListNFT(metadataResult);
    } catch (error) {
      console.log("IPFS URI upload error: ", error);
      alert(`Failed to create NFT: ${error}`);
    }
  };

  const mintAndListNFT = async (result) => {
    try {
      const uri = `http://localhost:3001/ipfs/${result.path}`;
      await nft.methods.mint(uri).send({ from: account });
      const tokenId = await nft.methods.tokenCount().call();

      await nft.methods.setApprovalForAll(marketplace.options.address, true).send({ from: account });
      const listingPrice = Web3.utils.toWei(price.toString(), 'ether');
      await marketplace.methods.makeItem(nft.options.address, tokenId, listingPrice).send({ from: account });

      alert('NFT created and listed successfully!');
    } catch (error) {
      console.log("Failed to create and list NFT: ", error);
      alert(`Failed to create and list NFT: ${error}`);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create and List Your NFT</h2>
      <Row className="g-4">
        <Form.Control
          type="file"
          required
          name="file"
          onChange={uploadToIPFS}
        />
        {fileName && (
          <div>
            <p><strong>File Name:</strong> {fileName}</p>
            <p><strong>File URL:</strong> <a href={fileURL} target="_blank" rel="noopener noreferrer">{fileURL}</a></p>
          </div>
        )}
        <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
        <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
        <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
        <Button onClick={createNFT} variant="success" size="lg">Create & List NFT</Button>
      </Row>
    </div>
  );
};

export default CreateNFT;*/


import React, { useState } from 'react';
import { Row, Form, Button } from 'react-bootstrap';
import Web3 from 'web3';
import { create } from 'ipfs-http-client';

const CreateNFT = ({ marketplace, nft, account }) => {
  const [fileName, setFileName] = useState('');
  const [fileURL, setFileURL] = useState('');
  const [price, setPrice] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Initialize IPFS client
  const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

  // Upload file to IPFS
  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      try {
        const result = await client.add(file);
        setFileName(file.name);
        setFileURL(`https://ipfs.infura.io/ipfs/${result.path}`);
      } catch (error) {
        console.log("IPFS image upload error: ", error);
        alert(`Failed to upload image to IPFS: ${error}`);
      }
    }
  };

  // Create NFT and list it on marketplace
  const createNFT = async () => {
    if (!fileURL || !price || !name || !description) {
      alert("All fields are required.");
      return;
    }

    try {
      const metadata = JSON.stringify({ image: fileURL, price, name, description });
      const metadataResult = await client.add(metadata);
      await mintAndListNFT(metadataResult);
    } catch (error) {
      console.log("IPFS URI upload error: ", error);
      alert(`Failed to create NFT: ${error}`);
    }
  };

  const mintAndListNFT = async (result) => {
    try {
      const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
      await nft.methods.mint(uri).send({ from: account });
      const tokenId = await nft.methods.tokenCount().call();

      await nft.methods.setApprovalForAll(marketplace.options.address, true).send({ from: account });
      const listingPrice = Web3.utils.toWei(price.toString(), 'ether');
      await marketplace.methods.makeItem(nft.options.address, tokenId, listingPrice).send({ from: account });

      alert('NFT created and listed successfully!');
    } catch (error) {
      console.log("Failed to create and list NFT: ", error);
      alert(`Failed to create and list NFT: ${error}`);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create and List Your NFT</h2>
      <Row className="g-4">
        <Form.Control
          type="file"
          required
          name="file"
          onChange={uploadToIPFS}
        />
        {fileName && (
          <div>
            <p><strong>File Name:</strong> {fileName}</p>
            <p><strong>File URL:</strong> <a href={fileURL} target="_blank" rel="noopener noreferrer">{fileURL}</a></p>
          </div>
        )}
        <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
        <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
        <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
        <Button onClick={createNFT} variant="success" size="lg">Create & List NFT</Button>
      </Row>
    </div>
  );
};

export default CreateNFT;


