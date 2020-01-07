import React from 'react';
import { Button, Modal, Pagination, Spin } from 'antd'; // eslint-disable-line
import {
  Title
} from '$components/index';
import { FetchGet } from '$server/request';
import './index.less';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userInfo: {}, // 用户基本信息
      permissionInfo: {}, // 权限相关
      allSupplierModal: false, // 所有的供应商弹窗
      page: 1,
      pageSize: 10,
    };
  }

  componentDidMount() {
    this.getUserInfo();
  }
  // 获取用户信息
  getUserInfo() {
    FetchGet({
      url: '/tms/getUserInfo',
    }).then(res => {
      console.log(res, '用户信息');
      if (res.isSuccess) {
        this.setState({
          loading: false,
          userInfo: res.data.userInfo || {},
          permissionInfo: res.data.permissionInfo || {},
        });
      }
    });
  }
  // 供应商分页
  paginationChange(type, val) {
    console.log(type, val, '分页内容');
    if (type === 'pageSize') {
      this.setState({
        page: 1,
        pageSize: +val
      });
    } else {
      this.setState({
        [type]: +val
      });
    }
  }
  // 查看所有供应商
  viewAllSupplierList() {
    this.setState({
      allSupplierModal: true,
    });
  }
  // 取消供应商弹窗
  cancleSupplierModal() {
    this.setState({
      allSupplierModal: false,
    });
  }
  render() {
    const {
      userInfo, permissionInfo, allSupplierModal, page, pageSize,
      loading
    } = this.state;
    return (
      <div className="app">
        <Title title="账户管理" />
        <Spin spinning={loading}>
          <div className="user-info-title first">基本信息</div>
          <div className="user-info-ipt">
            <div className="ipt-item">
              <div className="ipt-item-left">
                <span className="require-star"></span>
                <span>头像</span>
              </div>
              <div className="ipt-item-right">
                <div className="user-avator">
                  <img src={userInfo.image} alt="个人头像" className="personal-img"></img>
                </div>
              </div>
            </div>

            <div className="ipt-item">
              <div className="ipt-item-left">
                <span className="require-star"></span>
                <span>用户ID</span>
              </div>
              <div className="ipt-item-right">
                {userInfo.userId}
              </div>
            </div>

            <div className="ipt-item">
              <div className="ipt-item-left">
                <span className="require-star"></span>
                <span>用户名</span>
              </div>
              <div className="ipt-item-right">
                {userInfo.username}
              </div>
            </div>

            <div className="ipt-item">
              <div className="ipt-item-left">
                <span className="require-star"></span>
                <span>性别</span>
              </div>
              <div className="ipt-item-right">
                {userInfo.sex === 'm' ? '帅哥' : userInfo.sex === 'fm' ? '美女' : '保密'}
              </div>
            </div>

            <div className="ipt-item">
              <div className="ipt-item-left">
                <span className="require-star">*</span>
                <span>昵称</span>
              </div>
              <div className="ipt-item-right">
                {userInfo.nick}
              </div>
            </div>

            <div className="ipt-item">
              <div className="ipt-item-left">
                <span className="require-star">*</span>
                <span>绑定手机</span>
              </div>
              <div className="ipt-item-right">
                {userInfo.tel}
              </div>
            </div>

            <div className="ipt-item">
              <div className="ipt-item-left">
                <span className="require-star"></span>
                <span>绑定微信</span>
              </div>
              <div className="ipt-item-right">
                微信
              </div>
            </div>
          </div>
          <div className="user-info-title">
            <span>职能权限</span>
            <span className="title-desc">（如需修改请联系您的管理员）</span>
          </div>
          <div className="user-info-ipt">
            <div className="ipt-item">
              <div className="ipt-item-left">
                <span className="require-star"></span>
                <span>类型</span>
              </div>
              <div className="ipt-item-right">
                {permissionInfo.type}
              </div>
            </div>

            <div className="ipt-item">
              <div className="ipt-item-left">
                <span className="require-star"></span>
                <span>职位</span>
              </div>
              <div className="ipt-item-right">
                {permissionInfo.position}
              </div>
            </div>

            <div className="ipt-item">
              <div className="ipt-item-left">
                <span className="require-star"></span>
                <span>供应商权限</span>
              </div>
              <div className="ipt-item-right">
                <div className="access-wrap">
                  {
                    permissionInfo.supplierList
                    && permissionInfo.supplierList.map(item => {
                      return <span className="access-item">{item}</span>;
                    })
                  }
                </div>
                {
                  permissionInfo.supplierList
                  && permissionInfo.supplierList.length > 4
                  ? (
                    <Button type="default"
                      className="view-all-supplier"
                      onClick={() => this.viewAllSupplierList()}
                    >
                        查看全部供应商（
                      {permissionInfo.supplierList.length}
                      ）
                    </Button>
                    )
                  : ''
                }
              </div>
            </div>

            <div className="ipt-item">
              <div className="ipt-item-left">
                <span className="require-star"></span>
                <span>类目权限</span>
              </div>
              <div className="ipt-item-right">
                <div className="access-cert-wrap">
                  {
                    permissionInfo.cateList
                    && permissionInfo.cateList.map(item => {
                      return <span className="access-item">{item}</span>;
                    })
                  }
                </div>
              </div>
            </div>

          </div>
          <div className="user-info-title">联系方式</div>
          <div className="user-info-ipt">
            <div className="ipt-item">
              <div className="ipt-item-left">
                <span className="require-star"></span>
                <span>微信号</span>
              </div>
              <div className="ipt-item-right">
              </div>
            </div>

            <div className="ipt-item">
              <div className="ipt-item-left">
                <span className="require-star"></span>
                <span>QQ号</span>
              </div>
              <div className="ipt-item-right">
              </div>
            </div>

            <div className="ipt-item">
              <div className="ipt-item-left">
                <span className="require-star"></span>
                <span>钉钉号</span>
              </div>
              <div className="ipt-item-right">
              </div>
            </div>
          </div>
        </Spin>

        <Modal
          title="全部供应商"
          mask={false}
          maskClosable={false}
          visible={allSupplierModal}
          width={900}
          onCancel={() => this.cancleSupplierModal()}
          footer={null
            // <div>
            //   <Pagination
            //     size="small"
            //     total={permissionInfo.supplierList && permissionInfo.supplierList.length}
            //     showSizeChanger
            //     showQuickJumper
            //     onChange={p => this.paginationChange('page', p)}
            //     onShowSizeChange={(c, s) => this.paginationChange('pageSize', s)}
            //     pageSizeOptions={['10', '20', '40', '60']}
            //   />
            // </div>
          }
        >
          <div className="supplier-modal-content">
            {
              permissionInfo.supplierList
              && permissionInfo.supplierList.map(item => {
                return <div className="supplier-item">{item}</div>;
              })
            }
          </div>
        </Modal>
      </div>
    );
  }
}

export default Home;
