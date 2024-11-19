/*import { create } from 'ipfs-http-client';

// Replace with your Pinata or Infura credentials
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: 'Bearer YOUR_INFURA_PROJECT_SECRET',
  },
});

export const uploadToIPFS = async (file) => {
  try {
    const added = await ipfs.add(file);
    const url = `https://ipfs.io/ipfs/${added.path}`;
    return url;
  } catch (error) {
    console.error("IPFS upload error:", error);
    return null;
  }
};*/

import { create } from 'ipfs-http-client';

const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

export const uploadToIPFS = async (file) => {
  try {
    const added = await client.add(file);
    return `https://ipfs.io/ipfs/${added.path}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};


