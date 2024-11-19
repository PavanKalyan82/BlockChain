import React, { useEffect, useState } from 'react';

const ListNFTs = ({ contract, account }) => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (contract && account) {
      fetchListedNFTs();
    }
  }, [contract, account]);

  const fetchListedNFTs = async () => {
    try {
      const itemCount = await contract.methods.itemCount().call();
      const listedNFTs = [];

      // Loop through all items to filter NFTs listed by the connected account
      for (let i = 1; i <= itemCount; i++) {
        const item = await contract.methods.items(i).call();
        if (item.seller.toLowerCase() === account.toLowerCase()) {
          const tokenURI = await contract.methods.tokenURI(item.tokenId).call();
          listedNFTs.push({
            id: item.tokenId,
            itemId: item.itemId,
            tokenURI,
            price: item.price,
            sold: item.sold,
          });
        }
      }
      setNfts(listedNFTs);
    } catch (error) {
      console.error('Error fetching listed NFTs:', error);
    }
  };

  return (
    <div>
      <h2>My Listed NFTs</h2>
      {nfts.length > 0 ? (
        <div>
          {nfts.map((nft) => (
            <div key={nft.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              <p><strong>NFT ID:</strong> {nft.id}</p>
              <p><strong>Token URI:</strong> <a href={nft.tokenURI} target="_blank" rel="noopener noreferrer">{nft.tokenURI}</a></p>
              <p><strong>Price:</strong> {window.web3.utils.fromWei(nft.price, 'ether')} ETH</p>
              <p><strong>Status:</strong> {nft.sold ? 'Sold' : 'Available'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No NFTs listed by you.</p>
      )}
    </div>
  );
};

export default ListNFTs;

