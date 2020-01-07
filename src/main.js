import React from 'react';
import ReactDOM from 'react-dom';
// import {Provider} from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { BackTop } from 'antd';
import moment from 'moment'; // eslint-disable-line
import 'moment/locale/zh-cn';
import App from './app';


React.Component.prototype.$moment = moment;

const rootElement = document.getElementById('app');

ReactDOM.render(
  <div className="app">
    <BackTop />
    <HashRouter>
      <App />
    </HashRouter>
  </div>,
  rootElement
);
