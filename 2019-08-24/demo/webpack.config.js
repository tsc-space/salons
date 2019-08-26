const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');


const browserConfig = {
  entry: './src/browser/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name]_[chunkhash:8].js',
    chunkFilename: '[name]_[chunkhash:8].js',
    publicPath: '/'
  },
  mode: 'production',
  devtool: 'inline-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.css/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')(),
              ],
            },
          },
        ],
      },
      {
        test: /\.less/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')(),
                require('postcss-px-to-viewport')({
                  viewportWidth: 375,
                }),
              ],
            },
          },
          'less-loader',
        ],
      },
      // {
      //   test: /\.(png|jpg|jpeg|gif)$/,
      //   use: {
      //     loader: 'file-loader',
      //     options: {
      //       name: '[hash].[ext]'
      //     }
      //   }
      // },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240,
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
    }),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      __isBrowser__: JSON.stringify(true),
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, `src/template/index.html`),
      filename: 'index.html',
      inject: true,
      minify: {
        // html5: true,
        // collapseWhitespace: true,
        // preserveLineBreaks: false,
        // minifyCSS: true,
        // minifyJS: true,
        // removeComments: false,
      },
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 30000,
      minChunks: 1,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: (module) => {
            let packageName = '';
            const packageScopeName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            if (packageScopeName.includes('@')) {
              const packageSubName = module.context.match(/[\\/]node_modules[\\/](.*?)[\\/](.*?)([\\/]|$)/)[2];
              packageName = `${packageScopeName}-${packageSubName}`;
            } else {
              packageName = packageScopeName;
            }

            return `npm.${packageName.replace('@', '')}`;
          },
          chunks: 'all',
        },
      },
    },
  },
};

const serverConfig = {
  entry: './src/server/index.js',
  // 为了不把node的原生模块, 如fs, 打包进包里
  target: 'node',
  // 为了不把node_modules下的第三方模块打包进包里
  externals: [nodeExternals()],
  mode: 'development',
  devtool: 'inline-cheap-module-source-map',
  output: {
    path: __dirname,
    filename: 'server.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        // 打包忽略less
        test: /\.less$/,
        use: 'ignore-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: JSON.stringify(false),
    }),
  ]
};

module.exports = [browserConfig, serverConfig];