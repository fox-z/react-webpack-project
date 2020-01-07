import React from 'react';
import {
 Button, Modal, Radio, Input, Spin, message
} from 'antd';
import { Title, ImgView } from '$components/index';
import './detail.less';
import { FetchGet, FetchPost } from '../../server/request';
import { getUserInfo } from '$config/cookies';
import { getShopLvPositionText } from '$config/enums';

const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;

class MarketGoodsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userInfo: getUserInfo(), // 用户信息

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

      viewImg: false, // 开关
      viewImgs: [
        // 'http://git-cdn.oss-cn-hangzhou.aliyuncs.com/shop/product/20190321/OG8AZLDNVYHL4MJMOYEG1553136638803.jpg',
        // 'http://cdn1.showjoy.com/shop/product/20180620/7ULM4G9W75ITI4SZ4I251529476591896.jpg',
        // 'http://cdn1.showjoy.com/shop/product/20180620/KCIDY16QGHY6KLUOGQRF1529486629330.jpg'
      ], // 查看图片数组
      viewIndex: 0, // 查看图片索引

      detail: {}, // 详情对象
      imgAndDescs: [
        // {
        //   imageUrl: 'http://git-cdn.oss-cn-hangzhou.aliyuncs.com/shop/product/20190321/OG8AZLDNVYHL4MJMOYEG1553136638803.jpg', // 图片
        //   desc: '我是图文描述', // 描述
        // },
        // {
        //   imageUrl: 'http://cdn1.showjoy.com/shop/product/20180620/7ULM4G9W75ITI4SZ4I251529476591896.jpg', // 图片
        //   desc: '我是图文描述', // 描述
        // },
        // {
        //   imageUrl: 'http://cdn1.showjoy.com/shop/product/20180620/KCIDY16QGHY6KLUOGQRF1529486629330.jpg', // 图片
        //   desc: '我是图文描述', // 描述
        // },
      ], // 图文详情
      skuId: '',
    };
  }

  componentDidMount() {
    const search = this.props.location.search.match(/\d+/g)[0];
    // const detail = JSON.parse(decodeURI(search));
    console.log(search, 'search');
    this.setState({
      skuId: search ? +search : 0,
    }, () => {
      if (!this.state.skuId) {
        message.error('缺少skuId');
        return;
      }
      this.reqData();
    });
    // try {
    //   const search = this.props.location.search.substr(1);
    //   const detail = JSON.parse(decodeURI(search));
    //   console.log(detail, 'search');
    //   if (Object.keys(detail).length) {
    //     // 对象有值
    //     this.setState({
    //       detail,
    //     }, () => {
    //     this.reqData();
    //     });
    //     window.sessionStorage.setItem('marketGoodsDetail', JSON.stringify(detail));
    //   } else {
    //     // 无值
    //     let sessionDetail = window.sessionStorage.getItem('marketGoodsDetail');
    //     console.log('从内存里拿到的值', detail);
    //     if (sessionDetail) {
    //       sessionDetail = JSON.parse(sessionDetail);
    //       this.setState({
    //         detail: sessionDetail,
    //       }, () => {
    //         this.reqData();
    //       });
    //     }
    //   }
    // } catch (err) {
    //   // d
    // }
  }

  reqData() {
    const { skuId } = this.state;
    if (skuId) {
      this.setState({
        loading: true,
      }, () => {
        FetchGet({
          url: '/tms/goods-server/v1/market/goods/detail',
          // url: '/hai/v1/market/goods/detail',
          params: {
            skuId,
          }
        }).then(res => {
          if (res.isSuccess) {
            this.setState({
              loading: false,
              imgAndDescs: res.data && res.data.backstageGoodsImage,
              detail: res.data && res.data.backstageGoodsListDTO,
              viewImgs: this.getAllImgs(res.data.backstageGoodsImage)
            });
          }
        }).catch(() => {
          this.setState({
            loading: false,
            detail: {},
            imgAndDescs: [],
            viewImgs: []
          });
        });
      });
    }
  }
  // 获取到所有的图片
  getAllImgs(data) {
    if (!data || !Array.isArray(data)) return [];
    const arr = [];
    for (const item of data) {
      if (item.imageUrl) {
        arr.push(item.imageUrl);
      }
    }
    return arr;
  }
  // 图片点击
  imgViewClick(r) {
    const {
      viewImgs
    } = this.state;
    const index = viewImgs.indexOf(r);
    this.setState({
      viewImg: true,
      viewIndex: index,
    });
  }
  // 返回
  goBack() {
    window.close();
    // this.props.history.goBack();
  }
  // 停售
  singleLowerShelf() {
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
    });
  }

  // 停售理由弹窗确认
  reasonConfirm() {
    const {
      detail, lowerShelfResource, userInfo, radioId
    } = this.state;
    this.setState({
      btnLoading: true,
    }, () => {
      FetchPost({
        url: '/tms/goods-server/v1/market/goods/lowerShelf',
        data: {
          skuIdList: [+detail.skuId],
          lowerShelfResource,
          lowerType: radioId,
          userId: userInfo.userId
        }
      }).then(res => {
        if (res.isSuccess) {
          message.success(res.data || '操作成功！');
          this.reasonCancle();
          window.close();
        }
      });
    });
  }

  // 推荐
  recommend(type) {
    const {
      detail
    } = this.state;
    this.setState({
      btnLoading: true,
    }, () => {
      const url = type === 'confirm'
      ? '/tms/goods-server/v1/market/goods/recommend'
      : '/tms/goods-server/v1/market/goods/cancelRecommend';
      FetchPost({
        url,
        data: {
          spuId: detail.spuId,
        }
      }).then(res => {
        if (res.isSuccess) {
          message.success('操作成功！');
          this.reasonCancle();
          window.close();
        } else {
          message.error(res.data || '操作失败！');
        }
      });
    });
  }
  render() {
    const {
      radioId, lowerShelfResource, lowerShelfModle, radioGroups, btnLoading,
      loading, viewImg, viewImgs, viewIndex, detail, imgAndDescs,
    } = this.state;
    console.log(detail, 'detail');
    return (
      <div className="app">
        {/* <OwnBreadCrumb dataSource={detail.from === 1 ? [
            { name: '集市管理', path: '#/' },
            { name: '商品管理', path: '#/marketGoods' },
            { name: '商品详情', path: '#/marketGoodsDetail' }
          ] : [
            { name: '集市管理', path: '#/' },
            { name: '推荐管理', path: '#/marketGoodsRecommend' },
            { name: '商品详情', path: '#/marketGoodsDetail' }
          ]}
        /> */}
        <Title title="商品详情" />
        <Spin spinning={loading}>
          <div className="market-goods-detail">

            <div className="shop-info-wrap">
              <div className="common-title">店铺信息</div>
              <div className="shop-info">
                <div className="info-item">
                  <span className="tit">店铺名称</span>
                  <span className="txt">{detail.shopName}</span>
                </div>
                <div className="info-item">
                  <span className="tit">店铺ID</span>
                  <span className="txt">{detail.shopId}</span>
                </div>
                <div className="info-item">
                  <span className="tit">店铺职级</span>
                  <span className="txt">{getShopLvPositionText(detail.shopLvPosition)}</span>
                </div>
              </div>
            </div>

            <div className="goods-info-wrap">
              <div className="common-title">
                <span className="tit">商品信息</span>
                <div className="btns">
                  {
                    detail.status === 1 ? (
                      !detail.recommend
                      ? (
                        <Button className="self-btn recommend" onClick={() => this.recommend('confirm')}>推荐</Button>
                      ) : (
                        <Button className="self-btn recommend" onClick={() => this.recommend('cancle')}>取消推荐</Button>
                      )
                    ) : ''
                  }
                  {
                    detail.status === 1
                      ? (
                        <Button className="self-btn stopsales" onClick={() => this.singleLowerShelf()}>停售</Button>
                      ) : ''
                  }
                </div>
              </div>
              <div className="spu-sku">
                <div className="spu-item">
                  <span className="tit">spuId</span>
                  <span className="txt">{detail.spuId}</span>
                </div>
                <div className="sku-item">
                  <span className="tit">skuId</span>
                  <span className="txt">{detail.skuId}</span>
                </div>
              </div>

              <div className="goods-cate">
                <span className="tit">类目</span>
                <span className="txt">{detail.goodsCate}</span>
              </div>
              <div className="goods-title">
                <span className="tit">商品标题</span>
                <span className="txt">{detail.goodsTitle}</span>
              </div>
              <div className="goods-info">
                <div className="info-item">
                  <span className="tit">售价</span>
                  <span className="txt">
                    ¥&nbsp;
                    {detail.price}
                  </span>
                </div>
                <div className="info-item">
                  <span className="tit">佣金</span>
                  <span className="txt">
                    ¥&nbsp;
                    {detail.commission}
                  </span>
                </div>
                <div className="info-item">
                  <span className="tit">数量</span>
                  <span className="txt">{detail.goodsCount}</span>
                </div>
                <div className="info-item">
                  <span className="tit">运费</span>
                  <span className="txt">
                    {
                      parseFloat(detail.expressFee) === 0
                       ? (
                        '包邮'
                       ) : `¥ ${detail.expressFee}`
                    }
                  </span>
                </div>
              </div>
              {
                detail.status === 2
                  ? (
                    <div className="goods-title">
                      <span className="tit">停售理由</span>
                      <span className="txt">{detail.lowerShelfResource}</span>
                    </div>
                  ) : ''
              }
              <div className="img-text-wrap">
                <span className="tit">商品描述</span>
                <div className="img-text">
                  {
                    imgAndDescs.map((item, index) => {
                      return (
                        <div className="img-text-item" key={index}>
                          {
                            item.desc
                            ? (
                              <p className="desc">
                                { item.desc }
                              </p>
                            ) : ''
                          }
                          {
                            item.imageUrl
                            ? (
                              <img alt="商品图片"
                                className="img"
                                onClick={() => this.imgViewClick(item.imageUrl)}
                                src={item.imageUrl}
                              />
                            )
                            : ''
                          }
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </div>

            <div className="btns-wrap">
              {/* <Button
                className="back-btn"
                type="ghost"
                onClick={() => this.goBack()}
              >
                关闭
              </Button> */}
              {/* {
                status === 1
                  ? (
                    <Button
                      type="primary"
                      className="lower-sales-btn"
                      onClick={() => this.singleLowerShelf()}
                    >
                      停售
                    </Button>
                  ) : ''
              } */}

            </div>

          </div>
        </Spin>

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
          index={viewIndex}
          imgArrs={viewImgs}
        />
      </div>
    );
  }
}

export default MarketGoodsDetail;
