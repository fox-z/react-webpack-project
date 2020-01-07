import React from 'react';
import XLSX from 'xlsx';
import {
 Button, Table, Input, Modal, message, Spin,
 notification
} from 'antd';
import { Title, ImgView } from '$components/index';
import './index.less';
import { FetchPost, FetchGet } from '../../server/request';
import { secondConfirm } from '../../utils/func';
import TopArrow from '../../images/to_top_arrow.png';
import BottomArrow from '../../images/to_bottom_arrow.png';

class RushtoBuy extends React.Component {
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

      list: [
        // {
        //   spuId: 333,
        //   skuId: 33334,
        //   id: 32,
        //   commission: 33.444,
        //   salePrice: 343222,
        //   productTitle: 'dfdsf范德萨发的啥饭的说法',
        //   spuMainImage: '../../images/2.png',
        //   shopId: 34444,
        //   key: 0,
        //   num: 333,
        //   shopName: '一禅的点',
        //   place: 3,
        // },
        // {
        //   spuId: 555,
        //   skuId: 6666,
        //   id: 54,
        //   commission: 33.444,
        //   salePrice: 343222,
        //   productTitle: 'dfdsf范德萨发的啥饭的说法',
        //   spuMainImage: '../../images/4.png',
        //   shopId: 6666,
        //   key: 1,
        //   num: 33222,
        //   shopName: '一禅的点',
        //   place: 5,
        // },
      ], // table
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

  // 获取列表数据
  reqData(startTime) {
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
      loading: true,
    }, async () => {
      const res = await FetchGet({
        url: '/tms/activity-server/market/activity/get',
        // url: '/hai/market/activity/get',
        params,
      });
      if (res && res.isSuccess) {
        const result = res.data;
        if (result) {
          this.setState({
            loading: false,
            list: this.addKey(result.actMarketPageDTOList),
            navList: this.addKey(result.activityMarketTimeList),
            currentTime: currentTime ? currentTime : result.currentTime,
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
  // 输入框内容保存
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

  // 图片点击
  imgViewClick(src) {
    this.setState({
      viewImgs: [src],
      viewImg: true,
    });
  }

  // 人工排序
  async order(type, sortIndex, record) {
    const self = this;
    const tableData = self.state.list;
    const key = record.key;
    let actionId = record.id;
    let actionSortIndex = sortIndex;
    let sibilingId = '';
    let sibilingSortIndex = '';
    if (type === 1) {
      // 向上移动
      if (key === 0) {
        message.info('已经是第一个了，无法移动');
        return;
      }
      sibilingId = tableData[key - 1].id;
      sibilingSortIndex = tableData[key - 1].place;
    } else if (type === -1) {
      // 向下移动
      if (key === tableData.length - 1) {
        message.info('已经是最后一个了，无法移动');
        return;
      }
      sibilingId = tableData[key + 1].id;
      sibilingSortIndex = tableData[key + 1].place;
    }
    console.log(JSON.stringify([
      {
        id: actionId,
        place: sibilingSortIndex,
      },
      {
        id: sibilingId,
        place: actionSortIndex,
      },
    ]), 'params');
    const res = await FetchPost({
      url: '/tms/activity-server/market/activity/place',
      // url: '/hai/market/activity/place',
      data: [
        {
          id: actionId,
          place: sibilingSortIndex,
        },
        {
          id: sibilingId,
          place: actionSortIndex,
        },
      ],
    });
    if (res && res.isSuccess === 1) {
      message.success(res.msg || '操作成功！', 3);
      self.reqData();
    }
  }
  // 模版下载
  modalDownload() {
    window.open('/tms/activity-server/download/activityPage');
    // window.open('/hai/tms/download/activityPage');
  }

  // 删除二次确认
  batchDel(item) {
    secondConfirm('商品正在参与活动，是否确认删除？', '', () => {
      if (item) {
        this.delActivityGoods([+item.id]);
      } else {
        this.delActivityGoods();
      }
    });
  }

  // 批量删除活动商品
  async delActivityGoods(arr) {
    const { selectIds } = this.state;
    const res = await FetchPost({
      url: '/tms/activity-server/market/activity/delete',
      // url: '/hai/market/activity/delete',
      data: arr ? arr : selectIds,
    });
    if (res && res.isSuccess) {
      message.success(res.msg || '删除成功！', 3);
      this.setState({
        selectIds: [],
        selectedRowKeys: [],
      })
      this.reqData();
    }
  }

  // 批量设置特卖
  dealWithSpecialExcel(e) {
    const self = this;
    const file = e.target.files[0];
    console.log(e.target.value, 'value');
    const reader = new FileReader();
    reader.onload = function (e) { // eslint-disable-line
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const tempSheetsObj = workbook.Sheets[workbook.SheetNames[0]];
      const tmpArr = XLSX.utils.sheet_to_json(tempSheetsObj);
      console.log(tmpArr, 'tmpArr');
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
          spuId: +item['SPUID'], // eslint-disable-line
          skuId: +item['SKUID'], // eslint-disable-line
          salePrice: item['售价'],
          startTime: self.$moment(item['开始时间']).valueOf(),
          endTime: self.$moment(item['结束时间']).valueOf(),
          commission: item['佣金'],
          shopId: item['店铺Id'],
          key: j,
        };
        // 表格格式校验
        if (!tmp.spuId || !tmp.skuId || tmp.salePrice === undefined
          || !tmp.endTime || !tmp.startTime || !tmp.shopId
          || tmp.commission === undefined) {
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
      console.log(tempFileDataArr, 'tempFileDataArr');
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
  };

  // 表格数据确认上传
  fileDataSubmit() {
    const { fileData } = this.state;
    for (let item of fileData) {
      delete item.key;
    }
    this.setState({ btnLoading: true }, async () => {
      const res = await FetchPost({
        url: '/tms/activity-server/market/activity/add',
        // url: '/hai/market/activity/add',
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
      shopId, shopName, productTitle, spuId, selectedRowKeys, loading, currentTime,
      btnLoading, viewImg, viewImgs, list, navList, fileDataModalVisible, fileData, cur
    } = this.state;
    return (
      <div className="app">
        <Title title="抢购管理" />
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
                            <span>{item.week}</span><span>/</span><span>{`${this.$moment(item.startTime).months() + 1}月${this.$moment(item.startTime).date()}日`}</span>
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
                    selectedRowKeys && selectedRowKeys.length ?
                    (
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
                  rowSelection={{
                    selectedRowKeys,
                    onChange: this.rowSelectionChange.bind(this)
                  }}
                  pagination={false}
                  dataSource={list}
                  bordered
                  columns={[
                    {
                      title: 'SPUID',
                      dataIndex: 'spuId',
                      key: 'spuId',
                      width: 86,
                    },
                    {
                      title: '主图',
                      dataIndex: 'spuMainImage',
                      key: 'spuMainImage',
                      width: 80,
                      render: (t) => {
                        return (
                          <img
                            src={t}
                            className="main-img"
                            alt=" "
                            onClick={() => this.imgViewClick(t)}
                          />
                        );
                      }
                    },
                    {
                      title: '商品标题',
                      dataIndex: 'productTitle',
                      key: 'productTitle',
                      width: 200,
                      render: (t, r) => {
                        return (
                          <div className="font-12 line-two">
                            <span>{t}</span>
                            <p>{this.$moment(r.startTime).format('YYYY-MM-DD HH:mm:ss')}</p>
                            <p>{this.$moment(r.endTime).format('YYYY-MM-DD HH:mm:ss')}</p>
                          </div>
                        );
                      }
                    },
                    {
                      title: '售价',
                      dataIndex: 'salePrice',
                      key: 'salePrice',
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
                      title: '库存',
                      dataIndex: 'num',
                      key: 'num',
                      width: 76,
                      render: (t) => {
                        return (
                          <div className="font-12">{t}</div>
                        );
                      }
                    },
                    {
                      title: '店铺名称',
                      dataIndex: 'shopName',
                      key: 'shopName',
                      width: 146,
                    },
                    {
                      title: '店铺Id',
                      dataIndex: 'shopId',
                      key: 'shopId',
                      width: 86,
                    },
                    {
                      title: '排序',
                      dataIndex: 'place',
                      key: 'place',
                      width: 76,
                      render: (t, r) => {
                        return (
                          <div className="flex">
                            <img src={TopArrow} alt=" " onClick={() => this.order(1, t, r)} className="arrow" />
                            <img src={BottomArrow} alt=" " onClick={() => this.order(-1, t, r)} className="arrow" />
                          </div>
                        );
                      },
                    },
                    {
                      title: '操作',
                      dataIndex: 'key',
                      key: 'key',
                      width: 86,
                      render: (t, r) => {
                        return (
                          <span className="blue" onClick={() => this.batchDel(r)}>删除</span>
                        );
                      }
                    },
                  ]}
                />
              </div>

              <div className="count">
                本时间段共计 <span className="high">{list ? list.length : 0}</span> 款商品
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
                      return (<div>{this.$moment(t).format('YYYY-MM-DD HH:mm:ss')}</div>)
                    },
                  },
                  {
                    title: '结束时间',
                    dataIndex: 'endTime',
                    key: 'endTime',
                    width: 150,
                    render: (t) => {
                      return (<div>{this.$moment(t).format('YYYY-MM-DD HH:mm:ss')}</div>)
                    },
                  },
                  {
                    title: '店铺Id',
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

export default RushtoBuy;
