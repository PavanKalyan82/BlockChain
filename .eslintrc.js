 module.exports = {
    env: {
        node: true,  // Allows the use of Node.js globals
        es6: true,   // Enables ES6 features
    },
    globals: {
        ethers: 'readonly',  // Mark 'ethers' as a global variable
        process: 'readonly',  // Mark 'process' as a global variable
    },
    settings: {
        react: {
            version: 'detect',  // Automatically pick the installed React version
        },
    },
};

