import React, { Component } from 'react';
import env from '$config/env';
import { NavLink, Link, withRouter } from 'react-router-dom';
import Cookies, { getUserInfo } from '$config/cookies';
import { Badge } from 'antd';
import './index.less';

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
      transition: '',
      logoClass: env,
      userInfo: getUserInfo(), // 个人信息
		};
  }

  circleClick() {
    const { transition } = this.state;
    this.setState({
      transition: transition ? '' : 'transition',
    });
  }
  // 退出登录
  loginOut() {
    // 清除cookie里的token信息
    Cookies.set('tmsUserInfo', '');
    Cookies.set('token', '');
    Cookies.set('umbrella_token', '');
    this.setState({
      userInfo: {}
    });
    this.props.history.replace({
      pathname: '/login'
    });
  }

  render() {
    const { transition, logoClass, userInfo } = this.state;
    return (
      <header>
        <div className="dms-main-content">
          <div className="main-content-wrap">
            <div className="dms-left-part">
              <div className={`dms-logo ${logoClass}`}></div>
            </div>
            <div className="dms-right-part">
              {/* <div className="dms-link-wrap">
                <NavLink className="dms-link"
                  to="/"
                  activeClassName="dms-top-nav-selected"
                  exact
                  strict={false}
                >
                  首页
                </NavLink>
                <NavLink className="dms-link"
                  to="/404"
                  activeClassName="dms-top-nav-selected"
                  exact={false}
                  strict
                >
                  导航二
                </NavLink>
                <NavLink className="dms-link dms-link-badge"
                  to="/msg"
                  activeClassName="dms-top-nav-selected"
                  exact={false}
                  strict
                >
                  <Badge count="433">
                    消息通知
                  </Badge>
                </NavLink>
                <NavLink className="dms-link"
                  to="/com"
                  activeClassName="dms-top-nav-selected"
                  exact={false}
                  strict
                >
                  规则中心
                </NavLink>
              </div> */}
              <div className="dms-personal-wrap"
                onClick={() => this.circleClick()}
              >
                {
                  userInfo && userInfo.image
                  ? <img src={userInfo.image} alt="个人头像" className="personal-img"></img>
                  : <div className="personal-img"></div>
                }
                <div className="nick-name">{userInfo && userInfo.nick ? userInfo.nick : '匿名'}</div>
                <div className={`circle-arrow ${transition}`}></div>
                {
                  transition ? (
                    <div className="drop-down">
                      <Link className="drop-down-item" to="userInfo">账户管理</Link>
                      <div className="drop-down-item" onClick={() => this.loginOut()}>退出登录</div>
                    </div>)
                    : ''
                }
              </div>
            </div>
          </div>
        </div>
      </header>
    );
	}
}

export default withRouter(Header);
