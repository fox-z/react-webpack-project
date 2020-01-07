import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import {
  Nav
} from '$components/index';
import ac from '$components/async-load';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import routers from '$router';

// tabs组件涉及到计算 需先引入，避免高亮样式错乱（暂时的解决方法）
import 'antd/lib/tabs/style';
// 公共样式
import './style/common.less';

/**
 * 默认模版（带左侧导航+顶部导航）
 */
class dashboard extends React.Component {
  render() {
    return (
      <Nav>
        <Switch>
          {
            routers.map(({
              name, path, exact, component
            }) => {
              return <Route key={`${name}${path}`} exact={exact} path={path} component={component} />;
            })
          }
        </Switch>
      </Nav>
    );
  }
}

const App = () => (
  <LocaleProvider locale={zh_CN}>
    <Switch>
      {/* 此处定义不带默认导航的路由 ----- start */}
      <Route key="登录页/login" exact path="/login" component={ac(() => import('$views/login'))} />
      {/* 此处定义不带默认导航的路由 ----- end */}
      <Route component={dashboard} />
    </Switch>

  </LocaleProvider>
);

export default App;
