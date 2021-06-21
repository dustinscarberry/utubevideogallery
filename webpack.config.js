const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const destDir = path.resolve(__dirname, 'public/js');
const sourceDir = path.resolve(__dirname, 'assets/js');

module.exports = {
  entry: {
    app: sourceDir + '/app.js',
    admin: sourceDir + '/admin.js'
  },
  output: {
    path: destDir,
    filename: "[name].min.js"
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },{
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {url: false}
          },
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({filename: '../css/[name].min.css'}),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new BundleAnalyzerPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin({})
    ]
  },
  resolve: {
    modules: ['assets/js', 'node_modules']
  }
};
