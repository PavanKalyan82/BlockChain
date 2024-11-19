// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTBazaar is ERC721URIStorage {
    uint public tokenCount;
    uint public itemCount;
    address payable public immutable feeAccount;
    uint public immutable feePercent;

    struct Item {
        uint itemId;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    mapping(uint => Item) public items;

    event Minted(uint tokenId, address indexed owner, string tokenURI);
    event Offered(uint itemId, uint tokenId, uint price, address indexed seller);
    event Bought(uint itemId, uint tokenId, uint price, address indexed seller, address indexed buyer);
    event RemovedFromSale(uint itemId, uint tokenId, address indexed seller);

    constructor(uint _feePercent) ERC721("NFTBazaar", "NFTB") {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function mintNFT(string memory _tokenURI) external returns (uint) {
        require(bytes(_tokenURI).length > 0, "Token URI required");

        tokenCount++;
        uint newTokenId = tokenCount;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        emit Minted(newTokenId, msg.sender, _tokenURI);
        return newTokenId;
    }

    function makeItem(uint _tokenId, uint _price) external {
        require(ownerOf(_tokenId) == msg.sender, "You must own the NFT to list it");
        require(_price > 0, "Price must be greater than zero");

        itemCount++;
        uint newItemId = itemCount;

        _transfer(msg.sender, address(this), _tokenId);

        items[newItemId] = Item({
            itemId: newItemId,
            tokenId: _tokenId,
            price: _price,
            seller: payable(msg.sender),
            sold: false
        });

        emit Offered(newItemId, _tokenId, _price, msg.sender);
    }

    function purchaseItem(uint _itemId) external payable {
        Item storage item = items[_itemId];
        uint totalPrice = getTotalPrice(_itemId);

        require(_itemId > 0 && _itemId <= itemCount, "Item does not exist");
        require(msg.value >= totalPrice, "Not enough ether to cover item price and fees");
        require(!item.sold, "Item already sold");

        item.seller.transfer(item.price);
        feeAccount.transfer(totalPrice - item.price);

        _transfer(address(this), msg.sender, item.tokenId);
        item.sold = true;

        emit Bought(_itemId, item.tokenId, item.price, item.seller, msg.sender);
    }

    function removeFromSale(uint _itemId) external {
        Item storage item = items[_itemId];
        
        require(item.seller == msg.sender, "Only the seller can remove the item from sale");
        require(!item.sold, "Item already sold");

        _transfer(address(this), msg.sender, item.tokenId);

        delete items[_itemId];

        emit RemovedFromSale(_itemId, item.tokenId, msg.sender);
    }

    function getTotalPrice(uint _itemId) public view returns (uint) {
        return (items[_itemId].price * (100 + feePercent)) / 100;
    }
}
