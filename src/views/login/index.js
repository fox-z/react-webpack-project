import React, { Component } from 'react';
import { Icon, Button, Tooltip } from 'antd';
import { FetchGet } from '$server/request';
import Cookies from '$config/cookies';
import { createEvent } from '$utils/func';
import md5 from 'md5';
import './index.less';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      passWord: '',
      isError: false,
      msg: '',
      loading: false,
    };
  }
  componentWillMount() {
  }

  componentDidMount() {
  }
  // 获取表单值
  iptChange(type, val) {
    this.setState({
      [type]: val.trim(),
    }, () => {
      this.checkLoginBtn();
    });
  }
  // 判断登录按钮状态
  checkLoginBtn() {
    const { userName, passWord } = this.state;
    this.setState({
      loading: !(userName && passWord)
    });
  }
  // 登录
  loginClick() {
    const self = this;
    const { userName, passWord } = self.state;
    if (!userName || !passWord) {
      this.setState({
        isError: true,
        msg: '用户名或者密码为空',
      });
      return;
    }
    self.setState({
      loading: true,
    }, () => {
      FetchGet({
        url: '/tms/console/login',
        params: {
          userName,
          passWord: md5(passWord),
        }
      }).then(res => {
        if (res.isSuccess) {
          const userInfo = {
            userId: res.data && res.data.userInfo && res.data.userInfo.userId,
            userName: res.data && res.data.userInfo && res.data.userInfo.userName,
            nick: res.data && res.data.userInfo && res.data.userInfo.nick,
            image: res.data && res.data.userInfo && res.data.userInfo.image,
            userType: res.data && res.data.permissionInfo && res.data.permissionInfo.typeId,
            userTypeName: res.data && res.data.permissionInfo && res.data.permissionInfo.type,
            positionId: res.data && res.data.permissionInfo && res.data.permissionInfo.positionId,
            positionName: res.data && res.data.permissionInfo && res.data.permissionInfo.position,
            cateIdList: res.data && res.data.permissionInfo && res.data.permissionInfo.cateIdList,
            supplierIdList: res.data && res.data.permissionInfo && res.data.permissionInfo.supplierIdList,
            departmentId: res.data && res.data.permissionInfo && res.data.permissionInfo.departmentId,
            departmentName: res.data && res.data.permissionInfo && res.data.permissionInfo.department,
            serverTime: res.data && res.data.serverTime,
          };
          // 将个人信息设置到cookie 七天到期
          Cookies.set('tmsUserInfo', JSON.stringify(userInfo), { expires: 604800 });
          const selfEvent = createEvent('userInfo', userInfo);
          window.dispatchEvent(selfEvent); // 发送自定义事件
          const redirectUrl = self.props.location.search.replace('?redirectUrl=', '');
          if (redirectUrl) {
            self.props.history.replace(redirectUrl);
          } else {
            self.props.history.replace('/');
          }
        } else {
          self.setState({
            isError: true,
            msg: res.msg,
          });
        }
        self.setState({
          loading: false,
        });
      }).catch(err => {
        console.log(err);
      });
    });
  }
  // enter输入
  enterDown(e) {
    console.log(e.which, 'whice');
    if (e.which === 13) {
      this.loginClick();
    }
  }
  render() {
    const tips1 = (
      <div className="tool-tip-wrap">
        <p>联系达人店商品部申请入驻  </p>
        <p>共赢社交电商新市场！</p>
        <div className="tool-tip-bot">
          <p>联系电话:0293-128773874</p>
          <p>邮箱:siping@showjoy.com</p>
        </div>
      </div>
    );
    const tips2 = (
      <div className="tool-tip-wrap-two">
        找回密码功能暂时未上线。如有需要 可联系达人店工作人员为您修改密码
      </div>
    );
    const {
      userName, passWord, isError, loading, msg
    } = this.state;
    return (
      <div className="all-content-wrap">
        <div className="login-wrap">
          <div className="logo-area"></div>
          <div className="content-area-wrap">
            <div className="main-content">
              <div className="login-area">
                <div className="login-tit">
                  <span className="tit-text">管理后台</span>
                  <span></span>
                  <Tooltip title={tips1}>
                    <span className="tit-btn">注册成供应商</span>
                  </Tooltip>
                </div>
                <div className="login-tips">
                  {
                    isError ? (
                      <div>
                        <Icon type="exclamation-circle" theme="filled" className="error-icon" />
                        <span>{msg}</span>
                      </div>) : ''
                  }
                </div>
                <div className={`account-wrap ${isError ? 'error' : ''}`}>
                  <span className="accout-icon"></span>
                  <input
                    className="login-ipt"
                    placeholder="请输入账号或昵称"
                    value={userName}
                    onChange={e => this.iptChange('userName', e.target.value)}
                    onKeyDown={e => this.enterDown(e)}
                  />
                  {
                    userName ? <Icon type="close" className="close-icon" onClick={() => this.iptChange('userName', '')} /> : ''
                  }
                </div>
                <div className={`account-wrap password ${isError ? 'error' : ''}`}>
                  <span className="accout-icon lock-icon"></span>
                  <input
                    className="login-ipt"
                    type="password"
                    placeholder="请输入密码"
                    value={passWord}
                    onChange={e => this.iptChange('passWord', e.target.value)}
                    onKeyDown={e => this.enterDown(e)}
                  />
                  {
                    passWord ? <Icon type="close" className="close-icon" onClick={() => this.iptChange('passWord', '')} /> : ''
                  }
                </div>

                <Button type="primary"
                  className="login-btn"
                  onClick={() => this.loginClick()}
                  disabled={loading}
                >
                  登录
                </Button>
                <Tooltip title={tips2} placement="bottom">
                  <span className="forget-password">忘记密码？</span>
                </Tooltip>
              </div>
              <div className="slogan-wrap">
                <span className="slogan-left"></span>
                <span className="slogan-text">帮每一种才华赢得赞赏</span>
                <span className="slogan-right"></span>
              </div>
            </div>

          </div>
          <div className="dms-title">
            <span className="font-bold">达人店</span>
            <span> - 尚妆旗下品牌</span>
          </div>
        </div>
      </div>
    );
  }
}
