import React, { Component } from 'react';
import notfoungImg from '$images/404.png';
import './index.less';

class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="not-found-wrap">
        <div className="not-found">
          <img src={notfoungImg} alt="404图片" className="img-plc"></img>
          <p className="not-found-text">诶呀，网页404报错文案占位，具体文案待</p>
          <p className="not-found-text">联系电话：18612345678</p>
        </div>
      </div>
    );
  }
}
export default NotFound;
