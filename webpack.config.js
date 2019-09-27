const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

let distDir = path.resolve(__dirname, 'public/js');
let sourceDir = path.resolve(__dirname, 'assets/js');

module.exports =
{
  entry: {
    //app: ['idempotent-babel-polyfill', sourceDir + '/app.js'],
    //dashboard: ['idempotent-babel-polyfill', sourceDir + '/dashboard.js']
    app: sourceDir + '/app.js',
    dashboard: sourceDir + '/dashboard.js'
  },
  output: {
    path: distDir,
    filename: "[name].min.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
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
    new MiniCssExtractPlugin({filename: '../css/[name].min.css'})
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true
      }),
      new OptimizeCssAssetsPlugin({})
    ]
  }
};
