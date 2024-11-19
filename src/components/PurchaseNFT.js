import React, { useEffect, useState } from 'react';

const PurchaseNFTs = ({ contract, account }) => {
  const [nftsForSale, setNftsForSale] = useState([]);

  useEffect(() => {
    const fetchNFTsForSale = async () => {
      const tokenIds = await contract.methods.getAllTokensForSale().call();
      const nfts = await Promise.all(
        tokenIds.map(async (id) => {
          const uri = await contract.methods.tokenURI(id).call();
          const price = await contract.methods.items(id).call();
          return { id, uri, price: price.price };
        })
      );
      setNftsForSale(nfts);
    };

    if (contract) fetchNFTsForSale();
  }, [contract]);

  const purchaseNFT = async (id, price) => {
    await contract.methods.purchaseItem(id).send({ from: account, value: price });
    alert('NFT Purchased Successfully!');
    fetchNFTsForSale(); // Refresh list after purchase
  };

  return (
    <div>
      <h2>Available NFTs for Purchase</h2>
      <div>
        {nftsForSale.map((nft) => (
          <div key={nft.id}>
            <img src={nft.uri} alt={`NFT ${nft.id}`} />
            <p>Price: {window.web3.utils.fromWei(nft.price, 'ether')} ETH</p>
            <button onClick={() => purchaseNFT(nft.id, nft.price)}>Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseNFTs;
