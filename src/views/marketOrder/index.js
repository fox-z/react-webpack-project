import React from 'react';
import {
 Button, Tabs, Input, DatePicker, Spin
} from 'antd';
import { Title, PaginationSimple } from '$components/index';
import OrderTable from './orderTable';
import { FetchGet } from '$server/request';
import './index.less';

const RangePicker = DatePicker.RangePicker;
const TabPane = Tabs.TabPane;

class MarketOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      orderNumber: '', // 搜索 订单号
      tabsKey: '',
      goodsTitle: '', // 商品标题
      buyerId: '', // 买家ID
      sellerId: '', // 卖家ID
      paymentTransactionNumber: '', // 支付交易号
      merchantTransactionNumber: '', // 商户交易号
      startTime: '',
      endTime: '',
      page: 1,
      pageSize: 20,
      pageCount: 0,
      total: 0,

      orderList: [
        // {
        //   key: 3,
        //   orderNumber: 234354564, // 订单号
        //   orderTime: '2019-10-23 10:00:00', // 下单时间
        //   paymentTime: '2019-11-23 11:00:00', // 支付时间
        //   goodsTitle: '我是商品标题我是商品标题我是商品标题我是商品标题我是商品标题我是商品标题我是商品标题', // 商品标题
        //   orderGoodsCount: 3, // 订单商品数量
        //   amountPayable: 3344.55, // 应付金额
        //   realPayable: 4455.44, // 实付金额
        //   buyerId: 33333, // 买家ID
        //   buyerName: '一禅的店铺', // 买家名
        //   sellerProfit: 2000, // 卖家收益
        //   sellerId: 4546, // 卖家ID
        //   sellerName: '逍遥的保健店订单电风扇范德萨', // 卖家名
        //   commission: 433.344, // 佣金
        //   sharerId: 343223, // 推手id
        //   sharerName: '推手的名字',
        //   serviceFee: 332.99, // 服务费
        //   orderStatus: 20, // 订单状态
        //   orderStatusText: '待支付', // 订单状态
        //   paymentType: '阿里支付', // 支付方式
        //   merchantTransactionNumber: 3431343, // 商户订单号
        //   paymentTransactionNumber: 343545342, // 支付交易号
        //   receiveAddress: '杭州市余杭区梦想小镇', // 收货地址
        //   expressNumber: 3431343, // 快递号
        //   expressUpdateTime: '2019-10-19 10:00:23', // 快递时间
        //   expressCompany: '圆通快递', // 快递公司
        //   expressFee: 32.3, // 快递费
        //   expressSignatory: '一禅', // 签收人
        //   expressId: 4,
        // },
        // {
        //   key: 3,
        //   orderNumber: 234354533364, // 订单号
        //   orderTime: '2019-10-23 10:00:00', // 下单时间
        //   paymentTime: '2019-11-23 11:00:00', // 支付时间
        //   goodsTitle: '我是商品标题我是商品标题我是商品标题我是商品标题我是商品标题我是商品标题我是商品标题', // 商品标题
        //   orderGoodsCount: 3, // 订单商品数量
        //   amountPayable: 3344.55, // 应付金额
        //   realPayable: 4455.44, // 实付金额
        //   buyerId: 33333, // 买家ID
        //   buyerName: '一禅的店铺', // 买家名
        //   sellerProfit: 2000, // 卖家收益
        //   sellerId: 4546, // 卖家ID
        //   sellerName: '逍遥的保健店订单电风扇范德萨', // 卖家名
        //   commission: 433.344, // 佣金
        //   sharerId: 343223, // 推手id
        //   sharerName: '推手的名字',
        //   serviceFee: 332.99, // 服务费
        //   orderStatus: 20, // 订单状态
        //   orderStatusText: '待支付', // 订单状态
        //   paymentType: '阿里支付', // 支付方式
        //   merchantTransactionNumber: 3431343, // 商户订单号
        //   paymentTransactionNumber: 343545342, // 支付交易号
        //   receiveAddress: '杭州市余杭区梦想小镇', // 收货地址
        //   expressNumber: 3431343, // 快递号
        //   expressUpdateTime: '2019-10-19 10:00:23', // 快递时间
        //   expressCompany: '圆通快递', // 快递公司
        //   expressFee: 32.3, // 快递费
        //   expressSignatory: '一禅', // 签收人
        //   expressId: 5,
        // }
      ], // 订单列表
    };
  }

  componentDidMount() {
    this.reqData(1);
  }
  // 添加key
  addKey(data) {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    const arr = JSON.parse(JSON.stringify(data));
    for (const [index, item] of arr.entries()) {
      console.log(item, 'item');
      item.key = index;
      item.transform = false;
    }
    return arr;
  }
  // 列表数据请求
  reqData(p) {
    const {
      page, pageSize, orderNumber, paymentTransactionNumber,
      tabsKey, goodsTitle, buyerId, sellerId, startTime, endTime,
      merchantTransactionNumber
    } = this.state;
    const params = {
      page: p || page,
      pageSize,
    };
    if (tabsKey) {
      params.orderStatus = tabsKey;
    }
    if (orderNumber) {
      params.orderNumber = orderNumber;
    }
    if (paymentTransactionNumber) {
      params.paymentTransactionNumber = paymentTransactionNumber;
    }
    if (merchantTransactionNumber) {
      params.merchantTransactionNumber = merchantTransactionNumber;
    }
    if (startTime) {
      params.startTime = startTime;
    }
    if (endTime) {
      params.endTime = endTime;
    }
    if (goodsTitle) {
      params.goodsTitle = goodsTitle;
    }
    if (buyerId) {
      params.buyerId = buyerId;
    }
    if (sellerId) {
      params.sellerId = sellerId;
    }
    this.setState({
      loading: true,
    }, () => {
      FetchGet({
        url: '/tms/trade-server/v1/market/order/list',
        params,
      }).then(res => {
        if (res.isSuccess) {
          const result = res.data;
          this.setState({
            loading: false,
            page: result.page,
            pageCount: result.pageCount,
            total: result.total,
            orderList: this.addKey(result.marketGoods),
          });
        } else {
          this.setState({
            loading: false,
            page: 1,
            pageCount: 0,
            total: 0,
            orderList: [],
          });
        }
      }).catch(() => {
        this.setState({
          loading: false,
          page: 1,
          pageCount: 0,
          total: 0,
          orderList: [],
        });
      });
    });
  }
  // 时间框选择栏
  rangePickChange(arr) {
    this.setState({
      startTime: arr[0],
      endTime: this.$moment(arr[1]).valueOf() > this.$moment('2036-12-31 23:59:59').valueOf() ? '2036-12-31 23:59:59' : arr[1],
    }, () => {
      this.reqData(1);
    });
  }
  // 搜索框内容变化
  searchIptChange(type, val) {
    this.setState({
      [type]: val,
    });
  }
  // 表格切换
  tabsChange(key) {
    this.setState({
      tabsKey: key,
    }, () => {
      this.reqData(1);
    });
  }
  // 分页切换
  pageAndSizeChange(p, s) {
    console.log(p, s, '分页切换');
    this.setState({
      page: +p,
      pageSize: +s
    }, () => {
      this.reqData();
    });
  }
  render() {
    const {
      orderNumber, goodsTitle, buyerId, sellerId, paymentTransactionNumber, tabsKey, orderList,
      merchantTransactionNumber, startTime, endTime, page, pageSize, pageCount, total, loading
    } = this.state;
    return (
      <div className="app">
        <Title title="订单管理" />
        <Spin spinning={loading}>
          <div className="market-order-wrap">

            <div className="search-wrap">
              <div className="search-left">
                <div className="search-item">
                  <div className="item-tit">订单号</div>
                  <Input
                    className="item-ipt"
                    value={orderNumber}
                    placeholder="请输入订单号"
                    allowClear
                    onChange={e => this.searchIptChange('orderNumber', e.target.value)}
                    onPressEnter={() => this.reqData(1)}
                  />
                </div>

                <div className="search-item sec">
                  <div className="item-tit">商品标题</div>
                  <Input
                    className="item-ipt"
                    value={goodsTitle}
                    placeholder="请输入商品标题"
                    allowClear
                    onChange={e => this.searchIptChange('goodsTitle', e.target.value)}
                    onPressEnter={() => this.reqData(1)}
                  />
                </div>

                <div className="search-item">
                  <div className="item-tit">买家ID</div>
                  <Input
                    className="item-ipt"
                    value={buyerId}
                    placeholder="请输入买家ID"
                    allowClear
                    onChange={e => this.searchIptChange('buyerId', e.target.value)}
                    onPressEnter={() => this.reqData(1)}
                  />
                </div>

                <div className="search-item sec">
                  <div className="item-tit">支付交易号</div>
                  <Input
                    className="item-ipt"
                    value={paymentTransactionNumber}
                    placeholder="请输入支付交易号"
                    allowClear
                    onChange={e => this.searchIptChange('paymentTransactionNumber', e.target.value)}
                    onPressEnter={() => this.reqData(1)}
                  />
                </div>

                <div className="search-item">
                  <div className="item-tit">卖家ID</div>
                  <Input
                    className="item-ipt"
                    value={sellerId}
                    placeholder="请输入卖家ID"
                    allowClear
                    onChange={e => this.searchIptChange('sellerId', e.target.value)}
                    onPressEnter={() => this.reqData(1)}
                  />
                </div>

                <div className="search-item sec">
                  <div className="item-tit">商户交易号</div>
                  <Input
                    className="item-ipt"
                    value={merchantTransactionNumber}
                    placeholder="请输入商户交易号"
                    allowClear
                    onChange={e => this.searchIptChange('merchantTransactionNumber', e.target.value)}
                    onPressEnter={() => this.reqData(1)}
                  />
                </div>

                <div className="search-item">
                  <div className="item-tit"></div>
                  <Button type="primary" className="item-btn" onClick={() => this.reqData(1)}>搜索</Button>
                </div>

              </div>
              <div className="search-right">
                <div className="search-item">
                  <div className="item-tit">时间选择</div>
                  <RangePicker
                    allowClear
                    className="item-picker"
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{
                      defaultValue: [this.$moment('00:00:00', 'HH:mm:ss'), this.$moment('00:00:00', 'HH:mm:ss')],
                    }}
                    value={[startTime
                    ? this.$moment(startTime) : null,
                    endTime ? this.$moment(endTime) : null]}
                    onChange={(m, dateString) => this.rangePickChange(dateString)}
                  />
                </div>
              </div>
            </div>

            <Tabs
              activeKey={tabsKey}
              animated={{ inkBar: true, tabPane: false }}
              onChange={key => this.tabsChange(key)}
            >
              <TabPane tab="全部交易" key="">
                <OrderTable data={orderList} refresh={() => this.reqData()} key="all" />
              </TabPane>
              <TabPane tab="待支付" key="21">
                <OrderTable data={orderList} refresh={() => this.reqData()} key="pay" />
              </TabPane>
              <TabPane tab="待发货" key="22">
                <OrderTable data={orderList} refresh={() => this.reqData()} key="send" />
              </TabPane>
              <TabPane tab="已发货" key="23">
                <OrderTable data={orderList} refresh={() => this.reqData()} key="sended" />
              </TabPane>
              <TabPane tab="交易成功" key="20">
                <OrderTable data={orderList} refresh={() => this.reqData()} key="success" />
              </TabPane>
              <TabPane tab="交易失败" key="-2">
                <OrderTable data={orderList} refresh={() => this.reqData()} key="err" />
              </TabPane>
            </Tabs>

            <PaginationSimple
              page={page}
              pageSize={pageSize}
              pageCount={pageCount}
              total={total}
              pageAndSizeChange={(p, s) => this.pageAndSizeChange(p, s)}
            />
          </div>
        </Spin>
      </div>
    );
  }
}

export default MarketOrder;
