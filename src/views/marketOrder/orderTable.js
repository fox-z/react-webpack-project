import React from 'react';
import ReactDOM from 'react-dom';
import { Tooltip, message, Input, Button } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import { secondConfirm } from '$utils/func';
import './orderTable.less';
import { FetchPost, FetchGet } from '../../server/request';
import { getOrderTypeText, getOrderPaidTypeText } from '$config/enums';

class OrderTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      top: 0,
      left: 400,
      remark: '',
      orderNumber: '', // 订单号
      showModal: false, // 是否展示弹窗
      transformObject: {},
      src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA2NCA0MSIgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K',
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data
    });
  }
  // 关闭订单
  closeOrder(r) {
    secondConfirm('确认关闭此订单？', '未支付订单系统会在24小时之后自动关闭！', () => {
      console.log('关闭订单', r);
      FetchPost({
        url: '/tms/trade-server/v1/market/order/close',
        data: {
          orderNumber: r.toString(),
        }
      }).then(res => {
        if (res.isSuccess) {
          message.success(res.msg || '操作成功！');
          // 重新拉取数据
          this.props.refresh();
        }
      });
    });
  }
  // 售后
  afterSales(r) {
    secondConfirm('是否执行售后操作？', '执行售后操作后将关闭此订单并退回佣金！', () => {
      console.log('售后操作', r);
      FetchPost({
        url: '/tms/trade-server/v1/market/order/close',
        data: {
          orderNumber: r.toString(),
        }
      }).then(res => {
        if (res.isSuccess) {
          message.success(res.msg || '操作成功！');
          // 重新拉取数据
          this.props.refresh();
        }
      });
    });
  }
  // 去商品管理
  // goToMarketList(tit) {
  //   const routerData = this.props.history.resolve({
  //     pathname: 'marketGoods',
  //     query: {
  //       goodsTitle: tit.substring(3),
  //     }
  //   });
  //   window.open(`#/marketGoods?goodsTitle=${tit.substring(3)}`, '_blank');
  // }

  // 物流信息
  async transformClick(orderItem) {
    const baseData = this.state.data;
    if (orderItem.transform) {
      baseData.forEach((item) => {
          item.transform = false;
          console.log(item.transform, '当前出于已展示');
      });
      this.setState({
        data: baseData,
        transformObject: {},
      });
    } else {
      const res = await FetchGet({
        url: '/tms/trade-server/v1/market/order/logistic',
        // url: '/gai/v1/market/order/logistic',
        params: {
          expressId: orderItem.expressId,
          notips: 1, // 不提示message, 默认提示
        },
        notips: 1, // 不提示message, 默认提示
      });
      console.log(res, '快递信息');
      if (res && res.isSuccess) {
        baseData.forEach((item) => {
          item.transform = false;
          if (item.orderNumber === orderItem.orderNumber) {
            console.log(item.transform, ' item.transform');
            item.transform = !item.transform;
          }
        });
        this.setState({
          transformObject: {
            receiveAddress: orderItem.receiveAddress,
            mobilePhone: orderItem.mobilePhone,
            ...res.data
          },
          data: baseData,
        });
      } else {
        baseData.forEach((item) => {
          item.transform = false;
          if (item.orderNumber === orderItem.orderNumber) {
            console.log(item.transform, ' item.transform');
            item.transform = !item.transform;
          }
        });
        this.setState({
          transformObject: {
            receiveAddress: orderItem.receiveAddress,
            mobilePhone: orderItem.mobilePhone,
          },
          data: baseData,
        });
      }
    }
  }

  // 备注
  searchIptChange(type, val) {
    this.setState({
      remark: val.trim(),
    });
  }
  // 备注提交
  async remarkConfirm() {
    const {orderNumber, remark} = this.state;
    if (!remark) {
      message.info('请填写备注');
      return;
    }
    const res = await FetchGet({
      url: '/tms/trade-server/v1/market/order/editNote',
      params: {
        orderNumber: orderNumber,
        remark: remark,
      },
    });
    if (res && res.isSuccess) {
      this.setState({
        showModal: false,
        remark: '',
        orderNumber: '',
      }, () => {
        message.info('操作成功');
      });
    }
  }
  // 展示备注
  remarkShow(orderItem) {
    const top = ReactDOM.findDOMNode(this.refs[`remark${orderItem.orderNumber}`]).offsetTop;
    const left = ReactDOM.findDOMNode(this.refs[`remark${orderItem.orderNumber}`]).offsetLeft;
    console.log(top, left, '位置信息');
    const self = this;
    FetchGet({
      url: '/tms/trade-server/v1/market/order/queryNote',
      params: {
        orderNumber: orderItem.orderNumber,
      }
    }).then(res => {
      if (res && res.isSuccess) {
        const remark = res.data && res.data.note;
        self.setState({
          showModal: true,
          remark: remark || '',
          orderNumber: orderItem.orderNumber,
          top: top - 140,
          left: left - 518,
        });
      }
    });
  }
  // 备注取消
  remarkCancle() {
    this.setState({
      showModal: false,
      orderNumber: '',
    });
  }

  render() {
    const { src, data, transformObject, remark, showModal, top, left } = this.state;
    const paidInfo = (item) => {
      return (
        <div className="paid-info-tips">
          <p className="item">
            <span className="tit">商户订单号</span>
            <span className="txt">{item.merchantTransactionNumber}</span>
          </p>
          <p className="item">
            <span className="tit">支付方式</span>
            <span className="txt">{getOrderPaidTypeText(item.paymentType)}</span>
          </p>
          <p className="item">
            <span className="tit">支付交易号</span>
            <span className="txt">{item.paymentTransactionNumber}</span>
          </p>
        </div>
      );
    };
    const transform = () => {
      return (
        <div className="paid-info-tips">
          <p className="item">
            <span className="tit">快递公司</span>
            <span className="txt">{transformObject.expressCompany || ''}</span>
          </p>
          <p className="item">
            <span className="tit">快递单号</span>
            <span className="txt">{transformObject.expressNumber || ''}</span>
          </p>
          <p className="item">
            <span className="tit">收货信息</span>
            <span className="txt">{transformObject.expressSignatory || ''}</span>
          </p>
          <p className="item">
            <span className="tit">电话</span>
            <span className="txt">{transformObject.mobilePhone || ''}</span>
          </p>
          <p className="item">
            <span className="tit">收货地址</span>
            <span className="txt">{transformObject.receiveAddress || ''}</span>
          </p>
          <p className="item">
            <span className="tit">更新时间</span>
            <span className="txt">{transformObject.expressUpdateTime || ''}</span>
          </p>
        </div>
      );
    };
    return (
    //  /** 交易成功 */
    // TRADE_SUCCESS(20),

    // /** 交易被取消 */
    // TRADE_CANCELED(-2),

    // /** 等待买家支付 */
    // WAIT_FOR_THE_PAYMENT(21),

    // /** 等待卖家发货 */
    // WAIT_FOR_THE_DELIVER(22),

    // /** 等待买家确认收货 */
    // WAIT_FOR_THE_CONFIRM(23),

    // /** 售后处理中**/
    // REFUND_DEALING(24),

    // /** 退货关闭 **/
    // REFUND_CLOSE(25),

    // /** 退货成功 **/
    // REFUND_SUCCESS(26),
      <div className="market-table-wrap">
        <div className="market-table-cont">
          <div className="table-title-wrap">
            <div className="goods-info">商品信息</div>
            <div className="paid-info">支付信息</div>
            <div className="paid-detail">支付明细</div>
            <div className="buyer-sheller">用户信息</div>
            <div className="order-status">订单状态</div>
            <div className="action-order">操作</div>
          </div>
          {
            data && data.length
            ? (
              data.map(item => {
                return (
                  <div className="order-item-wrap" key={item.orderNumber}>
                    <div className="order-info-wrap">
                      <div className="order-info">
                        <div className="info-left">
                          <div className="order-num">
                            <span>订单号：</span>
                            <span>{item.orderNumber}</span>
                          </div>
                          <div className="paid-time">
                            <span>支付时间：</span>
                            <span>{item.paymentTime}</span>
                          </div>
                        </div>
                        <div className="info-right">
                          <span>下单时间：</span>
                          <span>{item.orderTime}</span>
                        </div>
                      </div>
                      <Link className="goods-title-wrap" to={{
                        pathname: `marketGoods?goodsTitle=${item.goodsTitle.substring(3)}`,
                      }} target="_blank">
                        {item.goodsTitle}
                      </Link>
                    </div>
                    <div className="order-item">
                      <div className="goods-info">
                        <div className="order-common-item">
                          <span className="fir-tit">数量</span>
                          <span className="fir-txt">{item.orderGoodsCount}</span>
                        </div>
                        <div className="order-common-item">
                          <span className="fir-tit">规格</span>
                          <span className="fir-txt">{item.skuSpecinfo ? item.skuSpecinfo.replace(/规格:/g, '') : ''}</span>
                        </div>
                        <div className="order-common-item">
                          <span className="fir-tit">spuId</span>
                          <span className="fir-txt">{item.spuId}</span>
                        </div>
                        <div className="order-common-item">
                          <span className="fir-tit">skuId</span>
                          <span className="fir-txt">{item.skuId}</span>
                        </div>
                      </div>
                      <div className="paid-info">
                        <div className="order-common-item">
                          <span className="tit mr">应付金额</span>
                          <span className="text">{item.amountPayable}</span>
                          <span className="silver">
                            (运费
                            {item.expressFee}
                            )
                          </span>
                        </div>
                        <div className="order-common-item cent">
                          <span className="tit">支付方式</span>
                          <Tooltip
                            title={() => paidInfo(item)}
                            trigger="click"
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                          >
                            <p className="common-blue">{getOrderPaidTypeText(item.paymentType)}</p>
                          </Tooltip>
                        </div>
                        <div className="order-common-item">
                          <span className="tit">实付金额</span>
                          <span className="font-bold txt">{item.realPayable}</span>
                        </div>
                      </div>
                      <div className="paid-detail">
                        <div className="order-common-item">
                          <span className="tit">卖家收益</span>
                          <span className="txt">{item.sellerProfit}</span>
                        </div>
                        <div className="order-common-item cent">
                          <span className="tit">佣金</span>
                          <span className="txt">{item.commission}</span>
                        </div>
                        <div className="order-common-item">
                          <span className="tit">服务费</span>
                          <span className="txt">{item.serviceFee}</span>
                        </div>
                      </div>
                      <div className="buyer-sheller">
                        <div className="order-common-item">
                          <span className="tit">卖家(ID)</span>
                          <p className="txt"
                            title={`${item.sharerId}(${item.sharerName})`}
                          >
                            {item.sharerId}
                            (
                            {item.sharerName}
                            )
                          </p>
                        </div>
                        <div className="order-common-item cent">
                          <span className="tit">店长</span>
                          <p className="txt"
                            title={`${item.sellerId}(${item.sellerName})`}
                          >
                            {item.sellerId}
                            (
                            {item.sellerName}
                            )
                          </p>
                        </div>
                        <div className="order-common-item">
                          <span className="tit">买家(ID)</span>
                          <p className="txt"
                            title={`${item.buyerId}(${item.buyerName})`}
                          >
                            {item.buyerId}
                            (
                            {item.buyerName}
                            )
                          </p>
                        </div>
                      </div>
                      <div className="order-status">
                        <p
                          className={`status ${+item.orderStatus === 20
                            ? 'success' : +item.orderStatus === 21
                            ? 'pay' : +item.orderStatus === 22
                            ? 'send' : +item.orderStatus === -2
                            ? 'error' : ''}`}
                        >
                          { getOrderTypeText(item.orderStatus) }
                        </p>
                        <p className="status"></p>
                        <Tooltip
                          title={() => transform()}
                          trigger="click"
                          visible={item.transform}
                          onClick={() => this.transformClick(item)}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                          <p className="transfer">物流信息</p>
                        </Tooltip>
                      </div>
                      <div className="action-order">
                        {
                          (+item.orderStatus === 21) ? (
                            <div
                              className="common-blue"
                              onClick={() => this.closeOrder(item.orderNumber)}
                            >
                              关闭订单
                            </div>
                          ) : (+item.orderStatus !== -2
                          ? (
                            <div className="common-blue" onClick={() => this.afterSales(item.orderNumber)}>售后</div>)
                            : '-'
                          )
                        }
                        <div ref={'remark' + item.orderNumber} className="refund-btn" onClick={this.remarkShow.bind(this, item)}>备注</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )
            : (
              <div className="ant-table-placeholder-wrap">
                <div className="ant-empty ant-empty-normal">
                  <div className="ant-empty-image">
                    <img alt="暂无数据" src={src} />
                  </div>
                  <p className="ant-empty-description">暂无数据</p>
                </div>
              </div>)
          }
        </div>
        {
          showModal ? (
            <div className="modal" style={{ top: top + 'px', left: left + 'px' }}>
              <div className="modal-title">添加/修改备注</div>
              <Input
                className="modal-ipt"
                placeholder="请输入备注"
                value={remark}
                allowClear
                onChange={e => this.searchIptChange('remark', e.target.value)}
              />
              <div className="modal-btns">
                <Button type="primary" onClick={() => this.remarkConfirm()}>确定</Button>
                <Button type="default" className="right-btn" onClick={() => this.remarkCancle()}>取消</Button>
              </div>
            </div>
          ) : ''
        }
      </div>
    );
  }
}

export default withRouter(OrderTable);
