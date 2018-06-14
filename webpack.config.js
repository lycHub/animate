const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  target: 'web',
  entry: path.join(__dirname, 'src/js/index.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.json', '.scss'],
    alias: {
      '@': resolve('src'),
      'style': resolve('src/style'),
      'js': resolve('src/js')
    }
  },
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    overlay: {
      errors: true,
    },
    // hot: true,
    historyApiFallback: {
      index: '/src/index.html'
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.scss$/,
      use: ['style-loader', {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }],
      include: path.resolve(__dirname, 'src'),
      exclude: path.resolve(__dirname, 'node_modules')
    }, {
      test: /\.(gif|jpg|jpeg|png|svg)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 1024,
            // 静态资源生成的文件目录,与原目录路径统一
            name: 'resources/[path][name]-[hash:8].[ext]'
          }
        }
      ]
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new HTMLPlugin({
      template: path.join(__dirname, 'src/index.html')
    })
  ]
};


function resolve (dir) {
  return path.join(__dirname, '.', dir)
}