const path = require('path');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取css到单独文件的插件
const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');

// 获取到自定义的环境参数
const Argv = require('yargs');
const getThemeConfig = require('./theme');
/**
 * @argv return result
 *{ _: [],
    config: './webpack/webpack.dev.config.js',
    customenv: 'preview',
    env: { version: '0.5.6' },
    '$0': '/Users/yichan/Desktop/转型相关/code/Quickconsole/node_modules/.bin/webpack-dev-server'
  }
 */

// 拿到版本号
/**
 * 命令行参数
 * console-shop git:(feature/jenkins) ✗ npm run build-preview -- --env.version=0.5.6
 */
const version = Argv.argv.env ? Argv.argv.env.version : '';

console.log(version, '打包版本');
// 拿到命令里的 环境参数
const buildEnv = Argv.argv.customenv;
console.log(buildEnv, '环境参数');

// 获取 publicPath
const getPublicPath = (n, v) => {
  let p = '';
  switch (n) {
    case 'develop':
      p = 'https://assets.showjoy.net/showjoy-assets/tms/dist/';
      break;
    case 'test':
      p = 'https://assets.showjoy.com.cn/showjoy-assets/tms/dist/';
      break;
    case 'preview':
      p = `https://cdn1.showjoy.com/assets/f2e/showjoy-assets/tms/preview/${v}/dist/`;
      break;
    case 'production':
      p = `https://cdn1.showjoy.com/assets/f2e/showjoy-assets/tms/${v}/dist/`;
      break;
    default:
      p = 'https://assets.showjoy.net/showjoy-assets/tms/dist/';
      break;
  }
  console.log(p, 'publicPath');
  return p;
};

module.exports = {
  mode: 'production',
  stats: 'errors-only',
  /* 入口 */
  entry: {
    app: path.join(__dirname, '../src/main.js'),
  },
  /* 输出到dist目录，输出文件名字为bundle.js */
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: getPublicPath(buildEnv, version)
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
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      }
    },
    // 为 webpack 运行时代码创建单独的chunk
    runtimeChunk: {
      name: 'manifest'
    },
    minimizer: [
      new TerserPlugin({
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          compress: {
            drop_console: buildEnv === 'production', // 正式环境去掉console
            drop_debugger: true,
          },
        },
      }),
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.json'],
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
  devtool: 'none',
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
        test: /\.(css|less)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              modules: false,
              localIdentName: '[local]--[hash:base64:5]',
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
              config: {
                path: 'postcss.config.js'
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: getThemeConfig(buildEnv), // 自定义antd主题
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
          loader: 'url-loader'
        }]
      },
      {
        test: /\.json$/,
        use: [{
            loader: 'json-loader',
        }]
      },
    ]
  },
  plugins: [
    // 打包平台不需要
    // new CleanWebpackPlugin(['dist'], {
    //   root: path.resolve(__dirname, ''), //根目录
    //   verbose: true, //开启在控制台输出信息
    //   dry: false //启用删除文件
    // }), // 每次打包前清空
    // new HtmlWebpackPlugin({ // 需要java提供主页index.html（需要版本控制）
    //     filename: 'index.html',
    //     template: path.resolve(__dirname, '../public/index.html'),
    //     favicon: path.resolve(__dirname, '../public/favicon.ico')
    // }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css', // 都提到dist目录下的css目录中
      chunkFilename: 'css/[name].css'
    }),
    new OptimizeCssAssetsPlugin(), // 压缩css
    new webpack.DefinePlugin({
      __CURENV__: JSON.stringify(buildEnv)
    }),
  ]
};
/**
 *  hash是跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的hash值都会更改，并且全部文件都共用相同的hash值

    chunkhash和hash不一样，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。

    contenthash是针对文件内容级别的，只有你自己模块的内容变了，那么hash值才改变，所以我们可以通过contenthash解决上诉问题
 */
