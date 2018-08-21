const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let distDir = path.resolve(__dirname, 'public/js');
let sourceDir = path.resolve(__dirname, 'src/js');

module.exports =
{
  entry: {
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
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['es2015', 'react']
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({filename: '../css/[name].min.css'})
  ]
};
