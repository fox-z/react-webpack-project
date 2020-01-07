/**
 * 注意保持此文件的干净，避免git冲突
 * 每次发布到线下的时候删除自己的配置
 */
const proxy = {
  'GET /mock/user': {
    id: 1,
    username: 'kenny',
    sex: 6,
    nick: '芬达六块腹肌的'
  },
  'GET /mock/user/list': [
    {
      id: 1,
      username: 'kenny',
      sex: 6
    },
    {
      id: 2,
      username: 'kenny',
      sex: 6
    }
  ],
  'POST /mock/login/account': (req, res) => {
    const { password, username } = req.body;
    if (password === '888888' && username === 'admin') {
      return res.send({
        status: 'ok',
        code: 0,
        token: 'sdfsdfsdfdsf',
        data: {
          id: 1,
          username: 'kenny',
          sex: 6
        }
      });
    }
    return res.send({
      status: 'error',
      code: 403
    });
  },
  'DELETE /mock/user/:id': (req, res) => {
    console.log('---->', req.body);
    console.log('---->', req.params.id);
    return res.send({ status: 'ok', message: '删除成功！' });
  },

  // ========================== 以上为mock数据示例,下面是自己的mock数据 start
  // 提交代码遇到冲突可删除
  'GET /dms/v1/getOwnList': [
    {
      id: 1,
      name: '一禅',
      tel: '15433458787'
    },
    {
      id: 2,
      name: '洛克',
      tel: '15433458787'
    },
    {
      id: 3,
      name: '花生',
      tel: '15433458787'
    },
    {
      id: 4,
      name: '思平',
      tel: '15433458787'
    },
  ],
  'GET /dms/v1/getDepartmentList': [
    {
      id: 1,
      name: '产品技术部',
    },
    {
      id: 2,
      name: '设计交互部',
    },
    {
      id: 3,
      name: '运营部',
    },
    {
      id: 4,
      name: '客服部',
    },
  ],
  'POST /dms/v1/login': (req, res) => {
    console.log('---->', req.body);
    return res.send({ status: 'ok', message: '删除成功！' });
  },
  'POST /dms/v1/addOwn': (req, res) => {
    console.log(req.body, 'body');
    return res.send({
      isSuccess: 1,
      message: '新增成功！',
      status: 200,
      data: null,
      statusText: 'OK'
    });
  },
  'GET /mock/market/activity/get': {
    isSuccess: 1,
    data: [
    {
      key: 0,
      spuId: 1355333,
      shopId: 55554,
      shopName: '店铺名',
      salePrice: 4534.67,
      productTitle: '商品标题',
      productCount: 33,
      spuMainImage: 'http://cdn1.showjoy.com/shop/product/20190818/G2LEDGHFCPEQ789FG3S11566122484365.jpg',
      place: 4,
      commission: 3344.5
    },
    {
      key: 1,
      spuId: 655333,
      shopId: 78554,
      shopName: '店铺名',
      salePrice: 4534.67,
      productTitle: '商品标题',
      productCount: 33,
      spuMainImage: 'http://cdn1.showjoy.com/shop/product/20190818/G2LEDGHFCPEQ789FG3S11566122484365.jpg',
      place: 4,
      commission: 3344.5
    },
    {
      key: 2,
      spuId: 555333,
      shopId: 123121,
      shopName: '店铺名',
      salePrice: 4534.67,
      productTitle: '商品标题',
      productCount: 33,
      spuMainImage: 'http://cdn1.showjoy.com/shop/product/20190818/G2LEDGHFCPEQ789FG3S11566122484365.jpg',
      place: 4,
      commission: 3344.5
    },
    {
      key: 3,
      spuId: 433232,
      shopId: 4444,
      shopName: '店铺名',
      salePrice: 4522234.67,
      productTitle: '商品标题',
      productCount: 33,
      spuMainImage: 'http://cdn1.showjoy.com/shop/product/20190818/G2LEDGHFCPEQ789FG3S11566122484365.jpg',
      place: 5,
      commission: 32344.5
    },
  ]},

  // ========================== 自己的mock数据 end
};

module.exports = proxy;
