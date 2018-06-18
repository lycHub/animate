const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  target: 'web',
  entry: {
    index: path.join(__dirname, 'src/js/index.js'),
    a: path.join(__dirname, 'src/js/a.js'),
    b: path.join(__dirname, 'src/js/b.js'),
    c: path.join(__dirname, 'src/js/c.js')
  },
  output: {
    // chunk可以理解为一个块，即entry中对应的入口
    // hash指本次打包的hash值，那么所有输出的hash值都一样
    // chunkhash指本次打包，给每个入口都分配不同的hash值输出
    // 只有当文件内容改变后，chunkhash才会变化
    filename: 'js/[name]-[hash:8].bundle.js',
    path: path.join(__dirname, 'dist')

    // 默认情况资源文件的请求都会引用相对路径，比如：<script src="js/aaa.js"></script>
    // 如果设置了publicPath: 'http://cdn.com', 就会变成<script src="http://cdn.com/js/aaa.js"></script>
    // 一般用于上线后，有自己的cdn
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
      },
        'postcss-loader',
      {
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
          loader: 'file-loader',
          options: {
            name: 'assets/[name]-[hash:8].[ext]'
          }
        },
        'image-webpack-loader'
      ]
    }, {
      // 在html中加载图片
      test: /\.(htm|html)$/,
      loader: 'html-withimg-loader'
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
      // template: path.join(__dirname, 'src/index.html')
      // 默认就是当前根目录，依据context配置项
      template: 'src/index.html',

      // 文件名默认和template一样，当然可以自定义
      filename: 'index-[hash:8].html',

      // 压缩配置 https://github.com/kangax/html-minifier#options-quick-reference
      minify: {
        collapseInlineTagWhitespace: true       // 删空格
      }

      // 缓存文件默认true  cache: true
      // 所有的javascript脚本默认添加在body标签最后面，可以通过inject: 'head'改变
    }),

    new HTMLPlugin({
      template: 'src/a.html',
      filename: 'a-[hash:8].html',

      // 指定该模板依赖的js
      // 相当于直接把src/js/index.js和src/js/a.js放入body最后面(依据inject)
      chunks: ['index', 'a']

      // 如果要依赖很多的chunk，可以用反向派出法
      // excludeChunks: ['c'], 表示除了c，都需要依赖
    }),

    new HTMLPlugin({
      template: 'src/b.html',
      filename: 'b-[hash:8].html',
      chunks: ['b']
    }),

    new HTMLPlugin({
      template: 'src/c.html',
      filename: 'c-[hash:8].html',
      chunks: ['c']
    })
  ]
}

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}