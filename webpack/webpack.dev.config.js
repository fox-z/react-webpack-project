const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const apiMocker = require('webpack-api-mocker');
const argv = require('yargs'); // 获取到自定义的环境参数
const getThemeConfig = require('./theme');

console.log(argv.argv, '环境参数');

module.exports = {
  mode: 'development',
  /* 入口 */
  entry: {
    app: ['webpack/hot/only-dev-server', path.join(__dirname, '../src/main.js')],
  },
  /* 输出到dist目录，输出文件名字为bundle.js */
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      $src: path.resolve(__dirname, '../src'),
      $router: path.resolve(__dirname, '../src/routes'),
      $config: path.resolve(__dirname, '../src/config'),
      $server: path.resolve(__dirname, '../src/server'),
      $components: path.resolve(__dirname, '../src/components'),
      $views: path.resolve(__dirname, '../src/views'),
      $images: path.resolve(__dirname, '../src/images'),
      $utils: path.resolve(__dirname, '../src/utils'),
    }
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    compress: true, // gzip压缩
    host: '0.0.0.0', // 允许ip访问
    port: 9000, // 端口
    hot: true,
    inline: true,
    open: false,
    overlay: {
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    disableHostCheck: true,
    // clientLogLevel: 'error',
    proxy: { // 配置服务代理
      '/tms': {
        // target: 'http://192.168.0.46:62087', // 线下服务 误删
        target: 'http://10.1.2.156:62089',
        pathRewrite: { '^/tms/access-server': '' },
        changeOrigin: true,
      },
      '/com': {
        target: 'http://10.1.2.156:62053',
        pathRewrite: { '^/com': '' },
        changeOrigin: true,
      },
      '/gai': {
        target: 'http://10.1.2.196:62019',
        pathRewrite: { '^/gai': '' },
        changeOrigin: true,
      },
      '/hai': {
        target: 'http://10.1.2.132:62039',
        pathRewrite: { '^/hai': '' },
        changeOrigin: true,
      }
    },
    before(app) { // mock数据
      apiMocker(
        app,
        path.resolve(__dirname, '../mocker/mocker.js'),
      );
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: { // 抽离第三方插件
          test: /[\\/]node_modules[\\/]/, // 指定是node_modules下的第三方包
          name: 'vendors',
          priority: -10 // 抽取优先级
        },
      }
    },
    // 为 webpack 运行时代码创建单独的chunk
    runtimeChunk: {
      name: 'manifest'
    }
  },
  devtool: 'none', // 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
        include: path.join(__dirname, '../src')
      },
      {
        // 使用less配置
        test: /\.(less|css)$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false,
              localIdentName: '[local]--[hash:base64:5]',
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: 'postcss.config.js'
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              modifyVars: getThemeConfig('production'),
              javascriptEnabled: true,
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
            loader: 'url-loader',
            options: {
              limit: 10000, // 小于等于10K的图片会被转成base64编码，直接插入HTML中，减少HTTP请求
              name: 'images/[name].[ext]',
            }
        }]
      },
      {
        test: /\.svg$/,
        use: [{
          loader: 'url-loader',
        }]
      },
      {
        test: /\.json$/,
        use: [{
            loader: 'json-loader',
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.join(__dirname, '../public/index.html'),
        favicon: path.join(__dirname, '../public/favicon.ico')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __CURENV__: JSON.stringify(argv.argv.customenv)
    })
  ]
};
/**
 *  hash是跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的hash值都会更改，并且全部文件都共用相同的hash值

    chunkhash和hash不一样，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。

    contenthash是针对文件内容级别的，只有你自己模块的内容变了，那么hash值才改变，所以我们可以通过contenthash解决上诉问题
 */
