// 一级菜单Icon
import nav0 from '$images/0.png';
// import nav1 from '$images/1.png';
// import nav2 from '$images/2.png';
// import nav3 from '$images/3.png';
import nav4 from '$images/4.png';
// import nav5 from '$images/5.png';
// import nav6 from '$images/6.png';
// import nav7 from '$images/7.png';
// import nav8 from '$images/8.png';
import nav9 from '$images/9.png';
import nav10 from '$images/10.png';

/**
 * name字段最大支持五个字
 */
// 页面导航
const routesArr = [
	{
		name: '后台首页',
		value: 'home',
		icon: nav0,
		open: true, // 一级菜单是否打开(折叠)
		hide: false, // 是否隐藏(权限相关)
	},
	// {
	// 	name: '商品管理',
	// 	value: 'commodityManagement',
	// 	icon: nav1,
	// 	open: true, // 一级菜单是否打开(折叠)
	// 	hide: true, // 是否隐藏(权限相关)
	// 	children: [ // 导航需要
	// 	]
	// },
	// {
	// 	name: '交易物流',
	// 	value: 'transactionLogistics',
	// 	icon: nav2,
	// 	open: true, // 一级菜单是否打开(折叠)
	// 	hide: true, // 是否隐藏(权限相关)
	// 	children: [
	// 	]
	// },
	// {
	// 	name: '售后管理',
	// 	value: 'afterSaleManagement',
	// 	icon: nav3,
	// 	open: true, // 一级菜单是否打开(折叠)
	// 	hide: true, // 是否隐藏(权限相关)
	// 	children: [
	// 	]
	// },
	{
		name: '营销中心',
		value: 'marketingCenter',
		icon: nav4,
		open: true, // 一级菜单是否打开(折叠)
		hide: true, // 是否隐藏(权限相关)
		children: [
			{
				name: '新闻中心',
        path: '/newsCenter',
				value: 'newsCenter', // 权限需要
				hide: true, // 是否隐藏(权限相关)
			},
		]
	},
	// {
	// 	name: '客户管理',
	// 	value: 'customerManagement',
	// 	icon: nav5,
	// 	open: true, // 一级菜单是否打开(折叠)
	// 	hide: true, // 是否隐藏(权限相关)
	// 	children: [
	// 	]
	// },
	// {
	// 	name: '仓储管理',
	// 	value: 'warehouseManagement',
	// 	icon: nav6,
	// 	open: true, // 一级菜单是否打开(折叠)
	// 	hide: true, // 是否隐藏(权限相关)
	// 	children: [
	// 	]
	// },
	// {
	// 	name: '资金财务',
	// 	value: 'capitalFinance',
	// 	icon: nav7,
	// 	open: true, // 一级菜单是否打开(折叠)
	// 	hide: true, // 是否隐藏(权限相关)
	// 	children: [
	// 	]
	// },
	// {
	// 	name: '合作管理',
	// 	value: 'cooperativeManagement',
	// 	icon: nav8,
	// 	open: true, // 一级菜单是否打开(折叠)
	// 	hide: true, // 是否隐藏(权限相关)
	// 	children: [
	// 	]
	// },
	// {
	// 	name: '配置中心',
	// 	value: 'configurationCenter',
	// 	icon: nav9,
	// 	open: true, // 一级菜单是否打开(折叠)
	// 	hide: true, // 是否隐藏(权限相关)
	// 	children: [
	// 	]
	// },
	{
		name: '管理中心',
		value: 'managementCenter',
		icon: nav10,
		open: true, // 一级菜单是否打开(折叠)
		hide: true, // 是否隐藏(权限相关)
		children: [
			// {
      //   name: '供应商管理',
      //   path: '/supplierMt',
			// 	value: 'supplierMt', // 权限需要
			// 	hide: true, // 是否隐藏(权限相关)
			// },
			// {
      //   name: '业务配置',
      //   path: '/supplier',
			// 	value: 'supplier', // 权限需要
			// 	hide: true, // 是否隐藏(权限相关)
			// },
			// {
      //   name: '消息管理',
      //   path: '/message',
			// 	value: 'message', // 权限需要
			// 	hide: true, // 是否隐藏(权限相关)
			// },
			// {
      //   name: '文档管理',
      //   path: '/doc',
			// 	value: 'doc', // 权限需要
			// 	hide: true, // 是否隐藏(权限相关)
			// },
			{
        name: '部门管理',
        path: '/department',
				value: 'department', // 权限需要
				hide: true, // 是否隐藏(权限相关)
			},
			{
        name: '功能管理',
        path: '/functional',
				value: 'functional', // 权限需要
				hide: true, // 是否隐藏(权限相关)
			},
		]
	},
	{
		name: '集市管理',
		value: 'marketManagement',
		icon: nav9,
		open: true, // 一级菜单是否打开(折叠)
		hide: true, // 是否隐藏(权限相关)
		children: [
			{
				name: '商品管理',
        path: '/marketGoods',
				value: 'marketGoods', // 权限需要
				hide: true, // 是否隐藏(权限相关)
			},
			{
				name: '订单管理',
        path: '/marketOrder',
				value: 'marketOrder', // 权限需要
				hide: true, // 是否隐藏(权限相关)
			},
			{
				name: '推荐管理',
        path: '/marketGoodsRecommend',
				value: 'marketGoodsRecommend', // 权限需要
				hide: true, // 是否隐藏(权限相关)
			},
		]
	},
	{
		name: '好货抢购',
		value: 'goodsSnapManager',
		icon: nav9,
		open: true, // 一级菜单是否打开(折叠)
		hide: true, // 是否隐藏(权限相关)
		children: [
			{
				name: '广告配置',
        path: '/adConfig',
				value: 'adConfig', // 权限需要
				hide: true, // 是否隐藏(权限相关)
			},
			{
				name: '抢购管理',
        path: '/rushtoBuy',
				value: 'rushtoBuy', // 权限需要
				hide: true, // 是否隐藏(权限相关)
			},
			{
				name: '店铺管理',
        path: '/shopManager',
				value: 'shopManager', // 权限需要
				hide: true, // 是否隐藏(权限相关)
			},
		]
	},
];

export default routesArr;
