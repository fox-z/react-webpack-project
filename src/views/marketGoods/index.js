import React from 'react';
import { Link } from 'react-router-dom';
import {
 Button, Table, Tabs, Input, Modal, Radio, message, Spin,
 Select, DatePicker,
} from 'antd';
import { Title, PaginationSimple, ImgView } from '$components/index';
import './index.less';
import { FetchPost, FetchGet } from '../../server/request';
import { getUserInfo } from '$config/cookies';
import { getShopLvPositionText } from '$config/enums';
import { getUrlParam } from '$utils/func';

const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class MarketGoods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userInfo: getUserInfo(), // 用户信息
      page: 1,
      pageSize: 20,
      pageCount: 0,
      total: 0,
      tabsKey: '1',
      shopId: '', // 搜素 店铺ID
      shopName: '', // 搜素 店铺名称
      goodsTitle: getUrlParam('goodsTitle') || '', // 搜素 商品标题
      goodsList: [
        // {
        //   key: 0,
        //   shopId: 23444,
        //   shopName: '店铺名',
        //   shopLvPosition: '店铺职级（店长，营销顾问，市场经理）',
        //   goodsTitle: '我是商品标题我是商品标题我是商品标题我是商品标题我是商品标题我是商品标题我是商品标题我是商品标题我是商品标题',
        //   publicTime: '2019.12.30 10:00:00', // 发布时间
        //   skuId: 3334, // 商品ID,
        //   spuId: 3334, // 商品ID,
        //   price: 333.4, // 售价
        //   commission: 34.5, // 佣金
        //   goodsCount: 3, // 商品数量
        //   mainImageUrl: 'http://cdn1.showjoy.com/shop/product/20190703/EELR9S88SKZOPJ1SKMEW1562119206238.jpg',
        //   lowerShelfResource: '要你下你就下', // 停售原因
        // },
        // {
        //   key: 1,
        //   shopId: 333,
        //   shopName: '店铺名',
        //   shopLvPosition: '店铺职级（店长，营销顾问，市场经理）',
        //   goodsTitle: '我是商品标题',
        //   publicTime: '2019.12.30 10:00:00', // 发布时间
        //   skuId: 3334, // 商品ID,
        //   spuId: 3334, // 商品ID,
        //   price: 333.4, // 售价
        //   commission: 34.5, // 佣金
        //   goodsCount: 3, // 商品数量
        //   mainImageUrl: 'http://cdn1.showjoy.com/shop/product/20190703/EELR9S88SKZOPJ1SKMEW1562119206238.jpg',
        //   lowerShelfResource: '要你下你就下', // 停售原因
        // }
      ], // 商品列表
      selectedRowKeys: [], // 选择的row
      selectskuIds: [], // 选择的skuId

      radioId: '', // 停售理由Id
      lowerShelfResource: '', // 停售理由
      lowerShelfModle: false, // 停售理由弹窗
      radioGroups: [
        {
          id: 1,
          text: '属于禁售品',
        },
        {
          id: 2,
          text: '假冒品牌、盗版',
        },
        {
          id: 3,
          text: '疑似欺诈',
        },
        {
          id: 4,
          text: '垃圾广告',
        },
        {
          id: 99,
          text: '其他',
        },
      ],
      btnLoading: false, // 按钮加载中

      cateIdList: '', // 选择的类目
      cateList: [], // 预设类目数组
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      viewImg: false, // 开关
      viewImgs: [], // 图片数组
    };
  }

  componentDidMount() {
    this.getCateList();
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
    }
    return arr;
  }
  // 获取类目数组
  async getCateList() {
    const result = await FetchGet({
      url: 'tms/goods-server/v1/common/market/goods/cateList',
      // url: 'hai/v1/market/goods/cateList',
      params: {},
    });
    if (result && result.isSuccess) {
      console.log(result.data);
      this.setState({
        cateList: result.data,
      });
    }
  }
  // 获取列表数据
  reqData(p) {
    const {
      page, pageSize, shopId, shopName, goodsTitle, tabsKey,
      cateIdList, startTime, endTime
    } = this.state;
    const params = {
      page: p || page,
      pageSize: pageSize || 20,
      goodsStatus: +tabsKey
    };
    if (shopId) {
      params.shopId = shopId;
    }
    if (shopName) {
      params.shopName = shopName;
    }
    if (goodsTitle) {
      params.goodsTitle = goodsTitle;
    }
    if (cateIdList) {
      params.cateIdList = cateIdList;
    }
    if (startTime) {
      params.startTime = this.$moment(startTime).format('YYYY-MM-DD HH:mm:ss');
    }
    if (endTime) {
      params.endTime = this.$moment(endTime).format('YYYY-MM-DD HH:mm:ss');
    }
    this.setState({
      loading: true,
    }, () => {
      FetchGet({
        url: '/tms/goods-server/v1/market/goods/list',
        // url: '/hai/v1/market/goods/list',
        params,
      }).then(res => {
        if (res.isSuccess) {
          const result = res.data;
          this.setState({
            loading: false,
            page: result.page,
            pageCount: result.pageCount,
            total: result.total,
            goodsList: this.addKey(result.backstageGoodsListDTOList),
          });
        } else {
          this.setState({
            loading: false,
            page: 1,
            pageCount: 0,
            total: 0,
            goodsList: [],
          });
        }
      });
    });
  }
  // 输入框内容保存
  searchIptChange(type, val) {
    if (type === 'shopId') {
      this.setState({
        [type]: val.replace(/[^\d+]/, '')
      });
    } else {
      this.setState({
        [type]: val.trim(),
      });
    }
  }
  // 时间框选择栏
  rangePickChange(arr) {
    console.log(arr, 'arr');
    this.setState({
      startTime: arr[0],
      endTime: this.$moment(arr[1]).valueOf() > this.$moment('2036-12-31 23:59:59').valueOf()
        ? '2036-12-31 23:59:59'
        : arr[1],
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
  // 多选框
  rowSelectionChange(selectKey, selectedRows) {
    const arr = [];
    if (selectedRows && selectedRows.length) {
      selectedRows.forEach((item) => {
        arr.push(item.skuId);
      });
    }
    this.setState({
      selectedRowKeys: selectKey,
      selectskuIds: arr,
    });
  }
  // 表头切换
  tabsChange(key) {
    this.setState({
      tabsKey: key,
    }, () => {
      this.reqData(1);
    });
  }

  // 图片点击
  imgViewClick(src) {
    this.setState({
      viewImgs: [src],
      viewImg: true,
    });
  }
  // 查看
  // viewDetail(r) {
  //   console.log(r.skuId);
  //   this.props.history.push({
  //     pathname: '/marketGoodsDetail',
  //     state: {
  //       skuId: r.skuId,
  //       spuId: r.spuId,
  //       status: +this.state.tabsKey,
  //       shopId: r.shopId,
  //       shopName: r.shopName,
  //       shopLvPosition: r.shopLvPosition,
  //       goodsTitle: r.goodsTitle,
  //       publicTime: r.publicTime, // 发布时间
  //       price: r.price, // 售价
  //       commission: r.commission, // 佣金
  //       goodsCount: r.goodsCount, // 商品数量
  //       lowerShelfResource: r.lowerShelfResource, // 停售原因
  //       expressFee: r.expressFee, // 快递费
  //       goodsCate: r.goodsCate, // 类目
  //       recommend: r.recommend, // 是否推荐
  //       from: 1, // 2 推荐管理 1 商品管理
  //     }
  //   });
  // }
  // 单个停售
  singleLowerShelf(r) {
    this.setState({
      lowerShelfModle: true,
      selectskuIds: [r.skuId],
    });
  }
  // 批量停售
  patchLowerShelf() {
    this.setState({
      lowerShelfModle: true,
    });
  }
  // 停售理由选择
  radioChange(v) {
    const { radioGroups } = this.state;
    const lowerShelfReasonItem = radioGroups.find(item => item.id === +v);
    this.setState({
      radioId: v,
      lowerShelfResource: +v === 99 ? '' : lowerShelfReasonItem.text
    });
  }

  // 停售理由弹窗取消
  reasonCancle() {
    this.setState({
      radioId: '',
      lowerShelfResource: '',
      lowerShelfModle: false,
      btnLoading: false,
      selectskuIds: [],
      selectedRowKeys: [],
    });
  }

  // 停售理由弹窗确认
  reasonConfirm() {
    const {
      selectskuIds, lowerShelfResource, userInfo, radioId
    } = this.state;
    const data = {
      skuIdList: selectskuIds,
      lowerShelfResource,
      lowerType: radioId,
      userId: userInfo.userId,
    };
    console.log(data, 'data');
    this.setState({
      btnLoading: true,
    }, () => {
      FetchPost({
        url: '/tms/goods-server/v1/market/goods/lowerShelf',
        // url: '/hai/v1/market/goods/lowerShelf',
        data,
      }).then(res => {
        if (res.isSuccess) {
          message.success('操作成功！');
          this.reasonCancle();
          this.reqData(1);
        }
      });
    });
  }

  render() {
    const {
      tabsKey, shopId, shopName, goodsTitle, goodsList, selectedRowKeys, lowerShelfModle, loading,
      page, pageSize, pageCount, total, lowerShelfResource, radioId, radioGroups, btnLoading,
      cateIdList, cateList, startTime, endTime, viewImg, viewImgs
    } = this.state;
    return (
      <div className="app">
        <Title title="商品管理" />
        <Spin spinning={loading}>
          <div className="market-goods-wrap">
            <div className="goods-search-area">
              <div className="search-row">
                <div className="search-item">
                  <div className="item-tit">店铺ID</div>
                  <Input
                    className="item-ipt"
                    value={shopId}
                    placeholder="请输入店铺ID"
                    allowClear
                    onChange={e => this.searchIptChange('shopId', e.target.value)}
                    onPressEnter={() => this.reqData(1)}
                  />
                </div>

                <div className="search-item">
                  <div className="item-tit">店铺名称</div>
                  <Input
                    className="item-ipt"
                    value={shopName}
                    placeholder="请输入店铺名称"
                    allowClear
                    onChange={e => this.searchIptChange('shopName', e.target.value)}
                    onPressEnter={() => this.reqData(1)}
                  />
                </div>

                <div className="search-item">
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
              </div>

              <div className="search-row">
                <div className="search-item">
                  <div className="item-tit">类目&nbsp;&nbsp;&nbsp;&nbsp;</div>
                  <Select
                    placeholder="请选择类目"
                    className="item-ipt"
                    showArrow
                    allowClear
                    // showSearch
                    // optionFilterProp="children"
                    // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onChange={v => this.searchIptChange('cateIdList', v)}
                    value={cateIdList || undefined}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    <Option value="">全部</Option>
                    {
                      cateList.map(item => {
                        return <Option key={item.cateId} value={item.showCateValueList.join(',')}>{item.showCateName}</Option>;
                      })
                    }
                  </Select>
                </div>

                <div className="search-item">
                  <div className="item-tit">发布时间</div>
                  <RangePicker
                    allowClear
                    className="goods-picker"
                    format="YYYY/MM/DD HH:mm:ss"
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

              <div className="search-row">
                <div className="search-item">
                  <div className="item-tit"></div>
                  <Button type="primary" className="item-btn" onClick={() => this.reqData(1)}>搜索</Button>
                </div>
              </div>

            </div>

            <Tabs
              className="market-tab"
              activeKey={tabsKey}
              animated={{ inkBar: true, tabPane: false }}
              onChange={key => this.tabsChange(key)}
              tabBarExtraContent={
                selectedRowKeys && selectedRowKeys.length && tabsKey === '1'
                ? (
                  <Button className="head-btn" onClick={() => this.patchLowerShelf()}>批量停售</Button>
                ) : ''
              }
            >
              <TabPane tab="在售中" key="1">
                <Table
                  rowSelection={{
                    selectedRowKeys,
                    onChange: this.rowSelectionChange.bind(this)
                  }}
                  pagination={false}
                  dataSource={goodsList}
                  bordered
                  columns={[
                    {
                      title: '店铺名称',
                      dataIndex: 'shopName',
                      key: 'shopName',
                      width: 146,
                    },
                    {
                      title: '店铺ID',
                      dataIndex: 'shopId',
                      key: 'shopId',
                      width: 90,
                    },
                    {
                      title: '店铺职级',
                      dataIndex: 'shopLvPosition',
                      key: 'shopLvPosition',
                      width: 120,
                      render: (t) => {
                        return (
                          <div>{ getShopLvPositionText(t) }</div>
                        );
                      }
                    },
                    {
                      title: 'spuId',
                      dataIndex: 'spuId',
                      key: 'spuId',
                      width: 90,
                    },
                    {
                      title: '商品标题',
                      dataIndex: 'goodsTitle',
                      key: 'goodsTitle',
                      render: (t) => {
                        return (
                          <div className="font-12 line-two">{t}</div>
                        );
                      }
                    },
                    {
                      title: '主图',
                      dataIndex: 'mainImageUrl',
                      key: 'mainImageUrl',
                      render: (t) => {
                        return (
                          <img
                            src={t}
                            className="main-img"
                            alt="商品主图"
                            onClick={() => this.imgViewClick(t)}
                          />
                        );
                      }
                    },
                    {
                      title: '售价',
                      dataIndex: 'price',
                      key: 'price',
                      width: 76,
                      render: (t) => {
                        return (
                          <div className="font-12">
                            <span className="price-pre">¥ </span>
                            <span>{t}</span>
                          </div>
                        );
                      }
                    },
                    {
                      title: '佣金',
                      dataIndex: 'commission',
                      key: 'commission',
                      width: 76,
                      render: (t) => {
                        return (
                          <div className="font-12">
                            <span className="price-pre">¥ </span>
                            <span>{t}</span>
                          </div>
                        );
                      }
                    },
                    {
                      title: '数量',
                      dataIndex: 'goodsCount',
                      key: 'goodsCount',
                      width: 76,
                      render: (t) => {
                        return (
                          <div className="font-12">{t}</div>
                        );
                      }
                    },
                    {
                      title: '发布时间',
                      dataIndex: 'publicTime',
                      key: 'publicTime',
                      width: 90,
                      render: (t) => {
                        return (
                          <div className="font-12">{this.$moment(t).format('YYYY.MM.DD HH:mm:ss')}</div>
                        );
                      }
                    },
                    {
                      title: '操作',
                      dataIndex: 'key',
                      key: 'key',
                      width: 115,
                      render: (t, r) => {
                        return (
                          <div className="flex">
                            <Link
                              target="_blank"
                              to={{ pathname: `/marketGoodsDetail?skuId=${r.skuId}` }}
                              // to={{
                              //   pathname: '/marketGoodsDetail',
                              //   search: JSON.stringify({
                              //     skuId: r.skuId,
                              //     spuId: r.spuId,
                              //     status: +this.state.tabsKey,
                              //     shopId: r.shopId,
                              //     shopName: r.shopName,
                              //     shopLvPosition: r.shopLvPosition,
                              //     goodsTitle: r.goodsTitle,
                              //     publicTime: r.publicTime, // 发布时间
                              //     price: r.price, // 售价
                              //     commission: r.commission, // 佣金
                              //     goodsCount: r.goodsCount, // 商品数量
                              //     lowerShelfResource: r.lowerShelfResource, // 停售原因
                              //     expressFee: r.expressFee, // 快递费
                              //     goodsCate: r.goodsCate, // 类目
                              //     recommend: r.recommend, // 是否推荐
                              //     from: 1, // 2 推荐管理 1 商品管理
                              //   })
                              // }}
                              className="blue"
                            >
                              查看
                            </Link>
                            {/* <span className="blue" onClick={() => this.viewDetail(r)}>查看</span> */}
                            <span className="blue" style={{ marginLeft: '5px' }} onClick={() => this.singleLowerShelf(r)}>停售</span>
                          </div>
                        );
                      }
                    },
                  ]}
                />
              </TabPane>
              <TabPane tab="已停售" key="2">
                <Table
                  pagination={false}
                  dataSource={goodsList}
                  bordered
                  columns={[
                    {
                      title: '店铺名称',
                      dataIndex: 'shopName',
                      key: 'shopName',
                      width: 120,
                    },
                    {
                      title: '店铺ID',
                      dataIndex: 'shopId',
                      key: 'shopId',
                      width: 70,
                    },
                    {
                      title: '店铺职级',
                      dataIndex: 'shopLvPosition',
                      key: 'shopLvPosition',
                      render: (t) => {
                        return (
                          <div>{ getShopLvPositionText(t) }</div>
                        );
                      }
                    },
                    {
                      title: 'spuId',
                      dataIndex: 'spuId',
                      key: 'spuId',
                      width: 90,
                    },
                    {
                      title: '商品标题',
                      dataIndex: 'goodsTitle',
                      key: 'goodsTitle',
                      width: 120,
                      render: (t) => {
                        return (
                          <div className="font-12">{t}</div>
                        );
                      }
                    },
                    {
                      title: '主图',
                      dataIndex: 'mainImageUrl',
                      key: 'mainImageUrl',
                      render: (t) => {
                        return (
                          <img
                            src={t}
                            className="main-img"
                            alt="商品主图"
                            onClick={() => this.imgViewClick(t)}
                          />
                        );
                      }
                    },
                    {
                      title: '售价',
                      dataIndex: 'price',
                      key: 'price',
                      width: 76,
                      render: (t) => {
                        return (
                          <div className="font-12">
                            <span className="price-pre">¥ </span>
                            <span>{t}</span>
                          </div>
                        );
                      }
                    },
                    {
                      title: '佣金',
                      dataIndex: 'commission',
                      key: 'commission',
                      width: 76,
                      render: (t) => {
                        return (
                          <div className="font-12">
                            <span className="price-pre">¥ </span>
                            <span>{t}</span>
                          </div>
                        );
                      }
                    },
                    {
                      title: '数量',
                      dataIndex: 'goodsCount',
                      key: 'goodsCount',
                      width: 70,
                      render: (t) => {
                        return (
                          <div className="font-12">{t}</div>
                        );
                      }
                    },
                    {
                      title: '发布时间',
                      dataIndex: 'publicTime',
                      key: 'publicTime',
                      width: 90,
                      render: (t) => {
                        return (
                          <div className="font-12">{this.$moment(t).format('YYYY.MM.DD HH:mm:ss')}</div>
                        );
                      }
                    },
                    {
                      title: '停售原因',
                      dataIndex: 'lowerShelfResource',
                      key: 'lowerShelfResource',
                      width: 120,
                      render: (t) => {
                        return (
                          <div className="font-12">{t}</div>
                        );
                      }
                    },
                    {
                      title: '操作',
                      dataIndex: 'key',
                      key: 'key',
                      width: 50,
                      render: (t, r) => {
                        return (
                          <div className="flex">
                            <Link
                              target="_blank"
                              to={{ pathname: `/marketGoodsDetail?skuId=${r.skuId}` }}
                              // to={{
                              //   pathname: '/marketGoodsDetail',
                              //   search: JSON.stringify({
                              //     skuId: r.skuId,
                              //     spuId: r.spuId,
                              //     status: +this.state.tabsKey,
                              //     shopId: r.shopId,
                              //     shopName: r.shopName,
                              //     shopLvPosition: r.shopLvPosition,
                              //     goodsTitle: r.goodsTitle,
                              //     publicTime: r.publicTime, // 发布时间
                              //     price: r.price, // 售价
                              //     commission: r.commission, // 佣金
                              //     goodsCount: r.goodsCount, // 商品数量
                              //     lowerShelfResource: r.lowerShelfResource, // 停售原因
                              //     expressFee: r.expressFee, // 快递费
                              //     goodsCate: r.goodsCate, // 类目
                              //     recommend: r.recommend, // 是否推荐
                              //     from: 1, // 2 推荐管理 1 商品管理
                              //   })
                              // }}
                              className="blue"
                            >
                              查看
                            </Link>
                            {/* <span className="blue" onClick={() => this.viewDetail(r)}>查看</span> */}
                          </div>
                        );
                      }
                    },
                  ]}
                />
              </TabPane>
            </Tabs>

            <PaginationSimple
              page={page}
              pageSize={pageSize}
              total={total}
              pageCount={pageCount}
              pageAndSizeChange={(p, s) => this.pageAndSizeChange(p, s)}
            >
            </PaginationSimple>
          </div>

          <Modal
            title="请选择停售理由"
            maskClosable={false}
            visible={lowerShelfModle}
            width={330}
            onCancel={() => this.reasonCancle()}
            footer={
              null
            }
          >
            <RadioGroup
              value={radioId}
              className="radios-wrap"
              onChange={e => this.radioChange(e.target.value)}
            >
              {
                radioGroups.map(item => {
                  return (
                    <Radio key={item.id} value={item.id} className="radio-item">{item.text}</Radio>
                  );
                })
              }
              {
                +radioId === 99
                ? (
                  <div className="other-wrap">
                    <TextArea
                      autosize={{ maxRows: 2 }}
                      placeholder="请输入停售理由"
                      className="other-ipt"
                      maxLength={20}
                      value={lowerShelfResource}
                      onChange={e => this.setState({
                        lowerShelfResource: e.target.value.trim()
                      })}
                    />
                    <span className="other-len">
                      <span className="len">
                        {lowerShelfResource.length}
                        /20
                      </span>
                    </span>
                  </div>
                ) : ''
              }
            </RadioGroup>
            <div className="btns-wrap">
              <Button
                type="ghost"
                onClick={() => this.reasonCancle()}
                className="left-btn"
              >
                取消
              </Button>
              <Button
                type="primary"
                className="right-btn"
                onClick={() => this.reasonConfirm()}
                disabled={!lowerShelfResource}
                loading={btnLoading}
              >
                确定
              </Button>
            </div>
          </Modal>

          <ImgView
            onClose={() => this.setState({ viewImg: false })}
            show={viewImg}
            index={0}
            imgArrs={viewImgs}
          />
        </Spin>
      </div>
    );
  }
}

export default MarketGoods;
