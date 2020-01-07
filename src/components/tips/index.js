import React from 'react';
import { Icon } from 'antd';
import './index.less';

class Tips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
  }

  closeClick() {
    this.setState({
      show: false,
    });
  }

  render() {
    const { content, align } = this.props;
    const { show } = this.state;
    return (
      <div className="dms-tips" style={{ textAlign: align || 'center' }}>
        { show ? (
          <div className="tips-wrap">
            <Icon type="info-circle" theme="filled" className="info-icon" />
            <span className="txt" title={content}>
              { content }
            </span>
            <Icon type="close" className="close-icon" onClick={() => this.closeClick()} />
          </div>) : ''
        }
      </div>
    );
  }
}

export default Tips;
