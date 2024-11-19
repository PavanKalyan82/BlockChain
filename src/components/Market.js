import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

const Market = ({ contract, account }) => {
  const [nftsForSale, setNftsForSale] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch NFTs listed for sale
  const fetchNFTsForSale = async () => {
    setLoading(true);
    try {
      const itemIds = await contract.methods.getAllTokensForSale().call();

      // Fetching details of each NFT listed for sale
      const items = await Promise.all(
        itemIds.map(async (id) => {
          const item = await contract.methods.items(id).call();
          const tokenURI = await contract.methods.tokenURI(item.tokenId).call();

          return {
            id: item.itemId,
            tokenId: item.tokenId,
            price: Web3.utils.fromWei(item.price, 'ether'),
            seller: item.seller,
            sold: item.sold,
            tokenURI,
          };
        })
      );

      setNftsForSale(items);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      alert('Failed to load NFTs for sale.');
    }
    setLoading(false);
  };

  // Load NFTs for sale when the component mounts and when contract or account changes
  useEffect(() => {
    if (contract) {
      fetchNFTsForSale();
    }
  }, [contract, account]);

  // Function to handle purchase of an NFT
  const buyNFT = async (item) => {
    try {
      await contract.methods.purchaseItem(item.id).send({
        from: account,
        value: Web3.utils.toWei(item.price, 'ether'),
      });
      alert('NFT purchased successfully!');
      fetchNFTsForSale(); // Refresh the list after purchase
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      alert('Purchase failed.');
    }
  };

  return (
    <div>
      <h2>NFTs for Sale</h2>
      {loading ? (
        <p>Loading NFTs...</p>
      ) : nftsForSale.length > 0 ? (
        <div className="nft-list">
          {nftsForSale.map((nft) => (
            <div key={nft.id} className="nft-card">
              <img src={nft.tokenURI} alt={`NFT ${nft.tokenId}`} />
              <p>Price: {nft.price} ETH</p>
              <p>Seller: {nft.seller}</p>
              <button disabled={nft.sold} onClick={() => buyNFT(nft)}>
                {nft.sold ? 'Sold' : 'Buy NFT'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No NFTs available for sale.</p>
      )}
    </div>
  );
};

export default Market;
