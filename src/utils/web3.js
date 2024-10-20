/*import Web3 from 'web3';

// Create a function to initialize Web3
const getWeb3 = () =>
  new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        // If MetaMask is already injected, use that provider
        resolve(new Web3(window.web3.currentProvider));
      } else {
        // If no web3 provider is detected, reject
        reject(new Error('MetaMask not detected'));
      }
    });
  });

export default getWeb3;
*/

// src/utils/web3.js
/*import Web3 from 'web3';

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('Please install MetaMask!'));
      }
    });
  });

export default getWeb3;
*/
/*import Web3 from 'web3';

const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else {
        alert('Please install MetaMask to use this app');
        reject(new Error('MetaMask not installed'));
      }
    });
  });
};*/
import Web3 from 'web3';

const getWeb3 = () => {
    return new Promise((resolve, reject) => {
        window.addEventListener('load', async () => {
            // Checking if Web3 has been injected by the browser (Mist/MetaMask)
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    await window.ethereum.enable();
                    // Acccounts now exposed, use them
                    resolve(web3);
                } catch (error) {
                    reject(error);
                }
            } else if (window.web3) {
                // Legacy dapp browsers
                const web3 = window.web3;
                resolve(web3);
            } else {
                // Fallback to localhost; use dev console port by default
                const provider = new Web3.providers.HttpProvider('http://localhost:8545');
                const web3 = new Web3(provider);
                resolve(web3);
            }
        });
    });
};

export default getWeb3;