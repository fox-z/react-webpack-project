import React, { Component } from 'react';
import './index.less';

export default class Title extends Component {
  render() {
    const { title, children } = this.props;
    return (
      <div className="title-content-wrap">
        <span className="tit">{title}</span>
        {children}
      </div>
    );
	}
}
