import ac from '$components/async-load';

const routes = [
	{
		name: '组件专用', // 上线前需注释 或 清空com 文件的组件代码
		path: '/com',
		exact: true,
		value: 'com', // 权限需要
		component: ac(() => import('$views/com'))
	},
	{
		name: '后台首页',
		path: '/',
		exact: true,
		component: ac(() => import('$views/home')),
	},
	{
		name: '账户管理',
		path: '/userInfo',
		exact: true,
		component: ac(() => import('$views/userInfo')),
	},
	{
		name: '部门管理',
		path: '/department',
		exact: true,
		component: ac(() => import('$views/departmentMt')),
	},
	{
		name: '功能管理',
		path: '/functional',
		exact: true,
		component: ac(() => import('$views/functionalMt')),
	},
	{
		name: '消息通知',
		path: '/msg',
		exact: true,
		component: ac(() => import('$views/msg')),
	},
	// 达人集市
	{
		name: '商品管理',
		path: '/marketGoods',
		exact: true,
		component: ac(() => import('$views/marketGoods')),
	},
	{
		name: '商品详情',
		path: '/marketGoodsDetail',
		exact: true,
		component: ac(() => import('$views/marketGoods/detail')),
	},
	{
		name: '订单管理',
		path: '/marketOrder',
		exact: true,
		component: ac(() => import('$views/marketOrder')),
	},
  {
    name: '推荐管理',
    path: '/marketGoodsRecommend',
    exact: true,
    component: ac(() => import('$views/marketGoodsRecommend')),
  },
  {
    name: '抢购管理',
    path: '/rushtoBuy',
    exact: true,
    component: ac(() => import('$views/rushtoBuy')),
  },
  {
    name: '新闻中心',
    path: '/newsCenter',
    exact: true,
    component: ac(() => import('$views/newsCenter')),
	},
	{
    name: '新闻详情',
    path: '/newsCenterDetail',
    exact: false,
    component: ac(() => import('$views/newsCenter/details')),
  },
  {
    name: '广告配置',
    path: '/adConfig',
    exact: true,
    component: ac(() => import('$views/adConfig')),
  },
  {
    name: '店铺管理',
    path: '/shopManager',
    exact: true,
    component: ac(() => import('$views/shopManager')),
  },
  // @@@@
	// 404路由需放到最后---上面的占位符不要删除------------------------------------------------------------------------
	{
		name: '404',
		path: '*',
		exact: true,
		component: ac(() => import('$views/notFound')),
	},
];
export default routes;
