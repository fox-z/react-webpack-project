import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import routesArr from '$config/nav';
import {
  Header
} from '$components/index';
import { getUserInfo } from '$config/cookies';
import './index.less';
import { FetchGet } from '../../server/request';

class Nav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      routers: [],
		};
  }

	async componentDidMount() {
    // 处理导航的
    // 根据接口获取菜单权限
    // 设置路由
    const userInfo = getUserInfo();
    if (userInfo && +userInfo.userType === 101) {
      // 系统管理员左侧导航不做检验 接口在java端也不做校验
      routesArr.forEach(item => {
        item.hide = false;
        const childrens = item.children;
        if (childrens) {
          childrens.forEach(child => {
            child.hide = false; // 展示页面入口
          });
        }
      });
      this.setState({
        routers: routesArr
      });
      return;
    }
    const navData = await FetchGet({
      url: '/tms/access-server/v1/common/get/permissionsQuery/type',
      params: {
        userId: userInfo.userId,
        // type: 2, // 1 菜单 2 页面 3 接口 不传为 菜单和页面
      }
    });
    // 过滤掉用户没有权限的菜单
    if (navData && navData.isSuccess && navData.data && navData.data.length) {
      let OneMenu = []; // 一级菜单
      let SecMenu = []; // 页面
      navData.data.forEach(item => {
        if (+item.permissionType === 1) {
          OneMenu.push(item);
        } else if (+item.permissionType === 2) {
          SecMenu.push(item);
        }
      });
      routesArr.forEach(item => {
        if (item.value !== 'home') {
          item.hide = true;
        }
        OneMenu.forEach(OneItem => {
          if (OneItem.permissionsValue === item.value) {
            item.hide = false; // 展示一级菜单
          }
        });

        const childrens = item.children;
        if (childrens) {
          childrens.forEach(child => {
            child.hide = true; // 重置一次
            SecMenu.forEach(SecItem => {
              if (SecItem.permissionsValue === child.value) {
                child.hide = false; // 展示页面入口
              }
            });
          });
        }
      });
      console.log(SecMenu, '过滤之后的二级菜单权限');
      console.log(routesArr, '过滤之后的菜单权限');
      this.setState({
        routers: routesArr,
      }, () => {
        OneMenu = '';
        SecMenu = '';
      });
    } else {
      this.setState({
        routers: [],
      });
    }

    // 设置页面最低高度为整个屏幕的高度，避免少数页面不足一屏，样式错误
    // const nav = document.getElementById('dmsNav');
    // window.onload = () => {
    //   const bodyH = document.body.clientHeight;
    //   console.log(bodyH, 'bodyH');
    //   nav.style.minHeight = `${document.body.clientHeight - 60}px`;
    // };
  }

  navItemClick(obj) {
    if (obj.value === 'home') {
      const { history } = this.props;
      console.log(history, 'history');
      history.push('/');
      return;
    }
    if (!obj || !obj.children || !obj.children.length) {
      return;
    }
    const { routers } = this.state;
    if (routers && routers.length) {
      routers.forEach(item => {
        if (item.value === obj.value) {
          item.open = !item.open;
        }
      });
      this.setState({
        routers,
      });
    }
  }
  render() {
    const { routers } = this.state;
    const { children } = this.props;
    return (
      <div className="main-content-wrap relative">
        <Header />
        {/* <SideNav /> */}
        {/* 版心内容 */}
        <div className="dms-left-nav">
          {/* 左侧导航 */}
          <div className="dms-nav-wrap" id="dmsNav">
            {
              routers && routers.map(item => {
                return !item.hide && (
                  <div key={`${item.value}${item.name}`}>
                    <div className="nav-item-wrap">
                      <div className="nav-item"
                        onClick={() => this.navItemClick(item)}
                      >
                        <img className="nav-item-icon" src={item.icon} alt="icon" />
                        <div className="nav-item-tit">{item.name}</div>
                        {
                          item.children && item.children.length ? (
                            <div className={`nav-item-circle ${item.open ? 'open' : ''}`}></div>
                          ) : ''
                        }
                      </div>
                      {
                        item.open && item.children && item.children.length ? (
                          <div className="nav-childrens">
                            {
                              item.children.map((ytem) => {
                                return !ytem.hide && (
                                  <NavLink className="nav-child-item"
                                    to={ytem.path}
                                    activeClassName="dms-nav-selected"
                                    exact={false}
                                    key={`${ytem.path}${ytem.name}`}
                                  >
                                    {ytem.name}
                                  </NavLink>);
                              })
                            }
                          </div>)
                        : ''
                      }
                    </div>
                    <div className="dms-divider"></div>
                  </div>
                );
              })
            }
          </div>
          {/* 内容区域 */}
          <div className="dms-cont-wrap">
            { children }
          </div>
        </div>
      </div>
    );
	}
}

export default withRouter(Nav);
