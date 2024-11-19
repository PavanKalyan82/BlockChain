const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
    assert: require.resolve("assert"),
    os: require.resolve("os-browserify/browser"),
    url: require.resolve("url"),
    https: require.resolve("https-browserify"),
    http: require.resolve("stream-http"),
    util: require.resolve("util"),
    vm: require.resolve("vm-browserify"),
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  return config;
};
