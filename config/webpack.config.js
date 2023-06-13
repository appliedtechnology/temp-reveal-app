const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const path = require('path');

module.exports = {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  entry: {
    index: './src/index.js',
    search: './src/search.js',
    //... 
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: {
          loader: "raw-loader",
        },
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          }
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/search.html",
      filename: "./search.html",
      inject: true,
      chunks: ['search'],
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      inject: true,
      chunks: ['index'],
    }),
    // new FriendlyErrorsWebpackPlugin({
    //   compilationSuccessInfo: {
    //     messages: [
    //       "</SALT> Slides available here: http://localhost:4000",
    //       "Search: http://localhost:4000/search",
    //       "",
    //       "Speaker notes accessible by pressing »S« key",
    //       "Pressing »O« key will bring up the overview",
    //     ],
    //   },
    // }),
    new CopyPlugin([{ from: "src/assets", to: "assets" }]),
  ],
  devServer: {
    historyApiFallback: true,
    port: 4000,
    quiet: true,
    hot: true,
    proxy: {
      '/search': {
        target: 'http://localhost:4000/search.html',
        pathRewrite: { '^/search': '' }
      },
    }
  },
};
