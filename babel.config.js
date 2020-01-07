const babelConf = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        /**
         *  false : 不启用polyfill, 如果 import '@babel/polyfill', 会无视 browserlist 将所有的 polyfill 加载进来

            entry : 启用，需要手动 import '@babel/polyfill', 这样会根据 browserlist 过滤出 需要的 polyfill

            usage : 不需要手动import '@babel/polyfill'(加上也无妨，构造时会去掉), 且会根据 browserlist +
         */
        corejs: 2,
        targets: ['ie >= 9', 'chrome >= 62']
      }
    ],
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-transform-runtime'],
    ['import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true // `style: true` 会加载 less 文件
    }]
  ],
};

module.exports = babelConf;
