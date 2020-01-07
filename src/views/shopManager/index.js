import React from 'react';
import XLSX from 'xlsx';
import {
 Button, Table, Input, Modal, message, Spin,
 notification
} from 'antd';
import { Title, ImgView } from '$components/index';
import './index.less';
import { FetchPost, FetchGet, FetchDelete } from '../../server/request';
import { secondConfirm } from '../../utils/func';

class ShopManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      viewImg: false, // 开关
      viewImgs: [], // 图片数组

      spuId: '',
      shopId: '',
      shopName: '',
      productTitle: '', // 搜索框四个ipt

      list: [],
      navList: [], // 时间轴
      btnLoading: false, // 提交上传按钮
      fileDataModalVisible: false, // 弹窗控制
      fileData: [], // 上传的表格数据

      selectedRowKeys: [], // 选中的行
      selectIds: [], // 选中的id数组

      currentTime: '', // 当前时间戳
      cur: 0, // 当前tab
    };
  }

  componentDidMount() {
    this.reqData();
  }
  // 添加key
  addKey(data) {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    const arr = JSON.parse(JSON.stringify(data));
    for (const [index, item] of arr.entries()) {
      item.key = index;
    }
    return arr;
  }

  // 获取数据
  reqData() {
    const {
      shopId, shopName, productTitle, spuId, currentTime
    } = this.state;
    const params = {};
    if (shopId) {
      params.shopId = shopId;
    }
    if (shopName) {
      params.shopName = shopName;
    }
    if (productTitle) {
      params.productTitle = productTitle;
    }
    if (spuId) {
      params.spuId = spuId;
    }
    if (currentTime) {
      params.startTime = this.$moment(currentTime).valueOf();
    }
    this.setState({
      loading: false,
    }, async () => {
      const res = await FetchGet({
        url: '/tms/activity-server/market/activity/shop/all',
        params,
      });
      if (res && res.isSuccess) {
        const result = res.data;
        if (result) {
          this.setState({
            loading: false,
            list: this.addKey(result.marketShopRecommendDTOS),
            navList: this.addKey(result.activityMarketTimeList),
            currentTime: currentTime || result.systemTime,
          });
        } else {
          this.setState({
            loading: false,
            list: [],
            navList: [],
            currentTime: '',
          });
        }
      } else {
        this.setState({
          loading: false,
          list: [],
          navList: [],
          currentTime: '',
        });
      }
    });
  }
  // 搜索内容
  searchIptChange(type, val) {
    if (type === 'shopId' || type === 'spuId') {
      this.setState({
        [type]: val.replace(/[^\d+]/, '')
      });
    } else {
      this.setState({
        [type]: val.trim(),
      });
    }
  }
  // 多选框
  rowSelectionChange(selectKey, selectedRows) {
    const arr = [];
    if (selectedRows && selectedRows.length) {
      selectedRows.forEach((item) => {
        arr.push(item.id);
      });
    }
    this.setState({
      selectedRowKeys: selectKey,
      selectIds: arr,
    });
  }

  // 图片预览
  imgViewClick(src) {
    this.setState({
      viewImgs: [src],
      viewImg: true,
    });
  }

  // 模版下载
  modalDownload() {
    window.open('/tms/activity-server/download/activityPage');
  }

  // 删除二次确认
  batchDel(item) {
    secondConfirm('确定要删除吗？', '', () => {
      if (item) {
        this.delActivityGoods([+item.id]);
      } else {
        this.delActivityGoods();
      }
    });
  }

  // 批量删除（目前仅支持 单个）
  async delActivityGoods(arr) {
    const { selectIds } = this.state;
    const delArr = arr || selectIds;
    const res = await FetchDelete({
      url: '/tms/activity-server/market/activity/banner/delete',
      data: { id: delArr[0] },
    });
    if (res && res.isSuccess) {
      message.success(res.msg || '删除成功！', 3);
      this.setState({
        selectIds: [],
        selectedRowKeys: [],
      });
      this.reqData();
    }
  }

  // 批量设置
  dealWithSpecialExcel(e) {
    const self = this;
    const file = e.target.files[0];
    // console.log(e.target.value, 'value');
    const reader = new FileReader();
    reader.onload = function (e) { // eslint-disable-line
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const tempSheetsObj = workbook.Sheets[workbook.SheetNames[0]];
      const tmpArr = XLSX.utils.sheet_to_json(tempSheetsObj);
      // console.log(tmpArr, 'tmpArr');
      const tempFileDataArr = [];
      for (let j = 0; j < tmpArr.length; j++) {
        if (!tmpArr[j]) {
          continue; // eslint-disable-line
        }
        const item = tmpArr[j];
        // 避免出现 id 后有空格导致接口报错的情况
        item['SPUID'] = item['SPUID'].toString().replace(/^\s+|\s+$/, '');// eslint-disable-line
        item['SKUID'] = item['SKUID'].toString().replace(/^\s+|\s+$/, '');// eslint-disable-line

        const tmp = {
          startTime: self.$moment(item['开始时间']).valueOf(),
          endTime: self.$moment(item['结束时间']).valueOf(),
          shopId: item['店铺ID'],
          spuId: +item['SPUID'], // eslint-disable-line
          key: j,
        };
        // 表格格式校验
        if (!tmp.spuId || !tmp.endTime || !tmp.startTime || !tmp.shopId) {
          notification.error({
            message: `excel中第${j}行数据格式有误`,
            description: '数据不正确',
            duration: 10,
          });
          return false;
        }
        if (tmp.startTime >= tmp.endTime) {
          notification.error({
            message: `excel中第${j}行活动时间有误`,
            description: '时间不正确',
            duration: 5,
          });
          return false;
        }
        tempFileDataArr.push(tmp);
      }
      if (!tempFileDataArr.length) {
        message.info('表格为空', 3);
        return false;
      }
      // console.log(tempFileDataArr, 'tempFileDataArr');
      self.setState({
        fileData: tempFileDataArr,
        fileDataModalVisible: true,
      });
    };
    reader.readAsBinaryString(file);
    // 重置表单，避免二次上传无法触发onchange事件
    e.target.value = '';
  }

  // 表格数据确认弹窗关闭
  fileDataModalHide() {
    this.setState({
      fileDataModalVisible: false,
      btnLoading: false,
      fileData: []
    });
  }

  // 表格数据确认上传
  fileDataSubmit() {
    const { fileData } = this.state;
    for (const item of fileData) {
      delete item.key;
    }
    this.setState({ btnLoading: true }, async () => {
      const res = await FetchPost({
        url: '/tms/activity-server/market/activity/shop/add',
        data: fileData,
      });
      if (res && res.isSuccess) {
        message.success(res.msg || '上传成功！', 3);
        this.setState({
          btnLoading: false,
          fileDataModalVisible: false,
          fileData: [],
        }, () => {
          this.reqData();
        });
      }
    });
  }

  // 点击时间段
  timeClick(startTime, index) {
    this.setState({
      currentTime: startTime,
      selectedRowKeys: [],
      selectIds: [],
      cur: index,
    }, () => {
      // 用这个时间段发起请求
      this.reqData();
    });
  }

  render() {
    const {
      shopId, shopName, productTitle, spuId, selectedRowKeys, loading,
      btnLoading, viewImg, viewImgs, list, navList, fileDataModalVisible, fileData, cur
    } = this.state;
    return (
      <div className="app">
        <Title title="店铺管理" />
        <Spin spinning={loading}>
          <div className="rush-to-buy-wrap">
            <div className="goods-search-area">
              <div className="search-row">
                <div className="search-item">
                  <div className="item-tit">SPUID</div>
                  <Input
                    className="item-ipt"
                    value={spuId}
                    placeholder="请输入spuId"
                    allowClear
                    onChange={e => this.searchIptChange('spuId', e.target.value)}
                    onPressEnter={() => this.reqData()}
                  />
                </div>

                <div className="search-item">
                  <div className="item-tit">商品标题</div>
                  <Input
                    className="item-ipt"
                    value={productTitle}
                    placeholder="请输入商品标题"
                    allowClear
                    onChange={e => this.searchIptChange('productTitle', e.target.value)}
                    onPressEnter={() => this.reqData()}
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
                    onPressEnter={() => this.reqData()}
                  />
                </div>

              </div>

              <div className="search-row">
                <div className="search-item">
                  <div className="item-tit">店铺ID</div>
                  <Input
                    className="item-ipt"
                    value={shopId}
                    placeholder="请输入店铺ID"
                    allowClear
                    onChange={e => this.searchIptChange('shopId', e.target.value)}
                    onPressEnter={() => this.reqData()}
                  />
                </div>
              </div>

              <div className="search-row">
                <div className="search-item">
                  <div className="item-tit"></div>
                  <Button type="primary" className="item-btn" onClick={() => this.reqData()}>搜索</Button>
                </div>
              </div>

            </div>

            <div className="tab-wrap">
              <div className="tab-head">
                <div className="head-left">
                  {
                    navList && navList.map((item, index) => {
                      return (
                        <div className={['time-item', +item.status === 1 ? 'active' : '', cur === index ? 'cur' : ''].join(' ')} onClick={() => this.timeClick(item.startTime, index)} key={item.startTime}>
                          <div className="week-time">
                            <span>{item.week}</span>
                            <span>/</span>
                            <span>{`${this.$moment(item.startTime).months() + 1}月${this.$moment(item.startTime).date()}日`}</span>
                          </div>
                          <div className="status">
                            <div className="btn">{+item.status === 1 ? '进行中' : '即将开始'}</div>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>

                <div className="head-right">
                  {
                    selectedRowKeys && selectedRowKeys.length
                    ? (
                      <Button className="item-btn" onClick={() => this.batchDel()}>批量删除</Button>
                    ) : ''
                  }
                  <Button className="item-btn sec" onClick={() => this.modalDownload()}>模版下载</Button>
                  <Button className="item-btn xlsx">
                    <span>批量上传</span>
                    <input type="file" className="file-ipt" onChange={(e) => this.dealWithSpecialExcel(e)} />
                  </Button>
                </div>

              </div>
              <div className="tab-content">
                <Table
                  // 接口暂不支持批量删除
                  // rowSelection={{
                  //   selectedRowKeys,
                  //   onChange: this.rowSelectionChange.bind(this)
                  // }}
                  pagination={false}
                  dataSource={list}
                  bordered
                  columns={[
                    {
                      title: '店铺ID',
                      dataIndex: 'shopId',
                      key: 'shopId',
                      width: 86,
                    },
                    {
                      title: '店铺名称',
                      dataIndex: 'shopName',
                      key: 'shopName',
                      width: 146,
                    },
                    {
                      title: 'SPUID',
                      dataIndex: 'productList',
                      key: 'productList',
                      width: 86,
                      render: (t) => {
                        return (
                          t.map((item, index) => {
                            return (
                              <div className="tb-row" style={{ borderTopWidth: (index === 0) ? '0px' : '0.5px' }}>
                                <span>{item.spuId}</span>
                              </div>
                            );
                          })
                        );
                      }
                    },
                    {
                      title: '主图',
                      dataIndex: 'productList',
                      key: 'productList',
                      width: 80,
                      render: (t) => {
                        return (
                          t.map((item, index) => {
                            return (
                              <div className="tb-row" style={{ borderTopWidth: (index === 0) ? '0px' : '0.5px' }}>
                                <img
                                  src={item.mainImage}
                                  className="main-img"
                                  alt=" "
                                  onClick={() => this.imgViewClick(item.mainImage)}
                                />
                              </div>
                            );
                          })
                        );
                      }
                    },
                    {
                      title: '商品标题',
                      dataIndex: 'productList',
                      key: 'productList',
                      width: 200,
                      render: (t) => {
                        return (
                          t.map((item, index) => {
                            return (
                              <div className="tb-row" style={{ borderTopWidth: (index === 0) ? '0px' : '0.5px' }}>
                                <span>{item.productTitle}</span>
                              </div>
                            );
                          })
                        );
                      }
                    },
                    {
                      title: '售价',
                      dataIndex: 'productList',
                      key: 'productList',
                      width: 76,
                      render: (t) => {
                        return (
                          t.map((item, index) => {
                            return (
                              <div className="tb-row" style={{ borderTopWidth: (index === 0) ? '0px' : '0.5px' }}>
                                <span className="price-pre">¥ </span>
                                <span>{item.price}</span>
                              </div>
                            );
                          })
                        );
                      }
                    },
                    {
                      title: '佣金',
                      dataIndex: 'productList',
                      key: 'productList',
                      width: 76,
                      render: (t) => {
                        return (
                          t.map((item, index) => {
                            return (
                              <div className="tb-row" style={{ borderTopWidth: (index === 0) ? '0px' : '0.5px' }}>
                                <span className="price-pre">¥ </span>
                                <span>{item.commission}</span>
                              </div>
                            );
                          })
                        );
                      }
                    },
                    {
                      title: '库存',
                      dataIndex: 'productList',
                      key: 'productList',
                      width: 76,
                      render: (t) => {
                        return (
                          t.map((item, index) => {
                            return (
                              <div className="tb-row" style={{ borderTopWidth: (index === 0) ? '0px' : '0.5px' }}>
                                <span>{item.stock}</span>
                              </div>
                            );
                          })
                        );
                      }
                    },
                    {
                      title: '操作',
                      dataIndex: 'key',
                      key: 'key',
                      width: 86,
                      render: (t, r) => {
                        return <span className="blue" onClick={() => this.batchDel(r)}>删除</span>;
                      }
                    },
                  ]}
                />
              </div>

              <div className="count">
                本时间段共计
                <span className="high">{list ? list.length : 0}</span>
                款商品
              </div>
            </div>

          </div>

          <Modal
            title="表格商品确认"
            maskClosable={false}
            visible={fileDataModalVisible}
            width={1000}
            onCancel={() => this.fileDataModalHide()}
            footer={
              null
            }
          >
            <div className="data-wrap">
              <Table
                pagination={false}
                dataSource={fileData}
                bordered
                columns={[
                  {
                    title: 'SPUID',
                    dataIndex: 'spuId',
                    key: 'spuId',
                    width: 86,
                  },
                  {
                    title: 'SKUID',
                    dataIndex: 'skuId',
                    key: 'skuId',
                    width: 86,
                  },
                  {
                    title: '开始时间',
                    dataIndex: 'startTime',
                    key: 'startTime',
                    width: 150,
                    render: (t) => {
                      return (<div>{this.$moment(t).format('YYYY-MM-DD HH:mm:ss')}</div>);
                    },
                  },
                  {
                    title: '结束时间',
                    dataIndex: 'endTime',
                    key: 'endTime',
                    width: 150,
                    render: (t) => {
                      return (<div>{this.$moment(t).format('YYYY-MM-DD HH:mm:ss')}</div>);
                    },
                  },
                  {
                    title: '店铺ID',
                    dataIndex: 'shopId',
                    key: 'shopId',
                    width: 86,
                  },
                  {
                    title: '佣金',
                    dataIndex: 'commission',
                    key: 'commission',
                    width: 86,
                  },
                  {
                    title: '售价',
                    dataIndex: 'salePrice',
                    key: 'salePrice',
                    width: 86,
                  },
                ]}
              />
              <div className="confirm-btns">
                <Button onClick={() => this.fileDataModalHide()}>取消上传</Button>
                <Button type="primary" className="btn-right" loading={btnLoading} onClick={() => this.fileDataSubmit()}>确认上传</Button>
              </div>
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

export default ShopManager;
