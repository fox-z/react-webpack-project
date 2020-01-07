import React, { Component } from 'react';
import './index.less';

export default class Problem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  // 展开/收起问题弹窗
  toggleProblem() {
    const { open } = this.state;
    this.setState({
      open: !open,
    });
  }

  render() {
    const { open } = this.state;
    return (
      open ? (
        <div className="dms-problem-wrap">
          <div className="dms-problem-cont">
            <div className="problem-tit">猜你想问</div>
            <ul className="problem-list">
              <li className="problem-item">商品发布流程?</li>
              <li className="problem-item">商品发布流程?</li>
              <li className="problem-item">商品发布流程?</li>
            </ul>
            <div className="problem-bottom" onClick={() => this.toggleProblem()}>
              <span className="problem-close">收起</span>
              <span className="circle-arrow"></span>
            </div>
          </div>
        </div>)
        : (
          <div className="dms-problem-close" onClick={() => this.toggleProblem()}>
            <p className="problem-close">猜</p>
            <p className="problem-close mt">你</p>
            <p className="problem-close mt">想</p>
            <p className="problem-close mt">问</p>
            <span className="circle-arrow"></span>
          </div>)
    );
	}
}
