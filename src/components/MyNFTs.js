import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

const MyNFTs = ({ contract, account }) => {
  const [myNFTs, setMyNFTs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch NFTs owned by the connected account
  const fetchMyNFTs = async () => {
    setLoading(true);
    try {
      const tokenIds = await contract.methods.getTokensOwnedBy(account).call();

      // Fetch each NFT's details and token URI
      const nfts = await Promise.all(
        tokenIds.map(async (tokenId) => {
          const tokenURI = await contract.methods.tokenURI(tokenId).call();
          return {
            tokenId,
            tokenURI,
          };
        })
      );

      setMyNFTs(nfts);
    } catch (error) {
      console.error('Error fetching owned NFTs:', error);
      alert('Failed to load your NFTs.');
    }
    setLoading(false);
  };

  // Load NFTs owned by the account when the component mounts or account changes
  useEffect(() => {
    if (contract && account) {
      fetchMyNFTs();
    }
  }, [contract, account]);

  return (
    <div>
      <h2>My NFTs</h2>
      {loading ? (
        <p>Loading your NFTs...</p>
      ) : myNFTs.length > 0 ? (
        <div className="nft-list">
          {myNFTs.map((nft) => (
            <div key={nft.tokenId} className="nft-card">
              <img src={nft.tokenURI} alt={`NFT ${nft.tokenId}`} />
              <p>Token ID: {nft.tokenId}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>You don't own any NFTs.</p>
      )}
    </div>
  );
};

export default MyNFTs;
