## 开发须知
> 此文件在达人店后台开发中必读

### 开发规范

+ 每一个函数方法都必须给出注释，注释越多越好
+ 工程文件中的修改都要及时通知大家
+ 组件编写可选择性的review
+ 必须执行eslint规范

以上遇到疑问可联系@一禅


### 命名规则

+ 文件名 驼峰明名法 例如：isGood
+ 函数名 驼峰明名法 例如：isGood
+ 样式名 横杠的连接 例如：my-class
+ 路由名 斜杆的连接 例如：商品成本管理 ----》 good/cost || /cost  ‘管理’， ‘中心’ 等可忽略

##### 文件目录讲解

+ src 目录
  - -- config // 配置文件（环境，导航菜单）
  - -- components // 公共组件（包含业务组件）

      --- 文件夹的形式

      --- async-load.js // 特殊组件（用于懒加载）

  - -- images // 静态资源

  - -- server // 数据请求相关

  - -- style // less文件 变量配置

  - -- utils // 工具函数

    --- func.js // 常用函数
    --- regular.js // 正则校验

  - -- views // 所有的页面

    // 单个文件示例
    --- com // 组件路由，用于组件编写
        --- index.js // 页面
        --- index.less // 样式
        --- reducer.js // 状态管理

  - -- app.js // 相框层

  - -- index.js // 入口

  - -- reducers.js // 所有的reducer集合

  - -- routes.js // 路由配置

    --- com // 组件路由需注释，不能上线



+ dist 目录
  - -- css 样式目录
  - -- images 图片目录
  - -- verdor.js // 公共js
  - -- app.js // 入口js
  - -- 1.js // 页面
  - -- 2.js // 页面

+ pulic 静态目录
  - -- index.html // 用于本地开发的结构层，线上将由java提供

+ webpack 项目配置目录
  - -- webpack.dev.config.js // 本地开发用到的配置
  - -- webpack.pro.config.js // 所有环境用到的配置


##### 项目开发流程

+ 配置本地开发代理服务器
```
  proxy: { // 配置服务代理
    '/shop/*': {
      target: 'http://0.0.0.0:12000',
      changeOrigin: true
    }
  }

  // 每次更改都需要重启服务器
```

+ 添加新页面

> 第一种方式

// 例如如下命令
```
node init.js --fileName rushtoBuy --cnName 抢购管理
```

> 第二种方式
+ 在 src/views 下新建文件夹

```
home
  -- index.js
  -- index.less
  -- reducer.js (费必须)
```

+ 配置路由

  > 需在404页面之前配置
```
	{
		name: '首页',
		icon: 'home',
		path: '/',
		exact: true,
		component: ac(() => import('$views/home'))
	},

	// 404页面配置在页面的最后 --------------------------------------------------------------------------------------
	{
		name: '404',
		icon: '404',
		path: '',
		exact: false,
		component: ac(() => import('$views/notFound'))
	},
```
+ 配置菜单导航

> 在 src/config 下配置 二级菜单，需在产品指引下 放到指定的 一级菜单

```
	{
		name: '商品管理',
		value: 'commodityManagement',
		icon: nav1,
		open: true, // 一级菜单是否打开(折叠)
		hide: false, // 是否隐藏(权限相关)
		children: [ // 导航需要
			{
        name: '打招呼页',
        path: '/hello',
				value: 'hello', // 权限需要
				hide: false, // 是否隐藏(权限相关)
			},
			{
        name: '测试页面',
        path: '/test',
				value: 'test', // 权限需要
				hide: false, // 是否隐藏(权限相关)
			}
		]
	},
```

+ 启动本地

```
npm start
```
  即可开发了


##### 注意点
   package.json 文件依赖版本不得随便改动，若是想升级版本，需要进过充分测试，任何工程改动联系 @一禅
