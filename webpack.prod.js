const { resolve, join } = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  cache: false,

  output: {
    filename: '[name].bundle.[hash:8].js',
    chunkFilename: '[name].bundle.[hash:8].js',
    path: resolve(__dirname, 'dist'),
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        API_ENDPOINT: JSON.stringify('http://total-loss-api.herokuapp.com'),
      },
    }),

    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    // }),

    new optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor-[hash:8].js',
      minChunks(module) {
        const context = module.context;
        return context && context.indexOf('node_modules') >= 0;
      },
    }),

    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false, // Suppress uglification warnings
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
      },
      output: {
        comments: false,
      },
      exclude: [/\.min\.js$/gi], // skip pre-minified libs
    }),

    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$|\.jsx$/,
      threshold: 10240,
      minRatio: 0,
    }),
  ],
});
