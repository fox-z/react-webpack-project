import React from 'react';
import { Icon } from 'antd';
import './index.less';

class ImgViewModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: this.props.index || 0,
      imgArrs: this.props.imgArrs || [],
      show: this.props.show || false,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { show } = nextProps;
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    this.setState({
      show: nextProps.show,
      imgArrs: nextProps.imgArrs,
      currentIndex: nextProps.index
    });
  }

  // 关闭遮罩
  closeViewModal(e) {
    this.props.onClose();
    e.stopPropagation();
  }
  // 上一张图片
  preView() {
    const { currentIndex, imgArrs } = this.state;
    let preIndex = currentIndex - 1;
    if (preIndex === -1) {
      preIndex = imgArrs.length - 1;
    }
    console.log(preIndex, 'preIndex');
    this.setState({
      currentIndex: preIndex,
    });
  }
  // 下一张图片
  nextView() {
    const { currentIndex, imgArrs } = this.state;
    let nextIndex = currentIndex + 1;
    if (nextIndex === imgArrs.length) {
      nextIndex = 0;
    }
    console.log(nextIndex, 'nextIndex');
    this.setState({
      currentIndex: nextIndex,
    });
  }
  render() {
    const {
      currentIndex, imgArrs, show
    } = this.state;
    return (
      <div ref="imgViewModal">
        {
          show
          ? (
            <div className="img-view-modal">
              <div className="img-view-mask" onClick={e => this.closeViewModal(e)}></div>
              <div className="img-view-main">
                <div className="img-view-content">
                  <div className="img-view-close" onClick={e => this.closeViewModal(e)}>
                    <Icon type="close-circle" style={{ fontSize: '24px', color: '#979797' }} />
                  </div>
                  <div className="img-view-wrap">
                    <div className="view-left" onClick={() => this.preView()}></div>
                    <img
                      src={imgArrs[currentIndex]}
                      alt="商品图片"
                      className="img"
                    />
                    <div className="view-right" onClick={() => this.nextView()}></div>
                  </div>
                </div>
                <div className="img-view-pagination">
                  <span className="pagination-txt">{ currentIndex + 1 }</span>
                  <span> / </span>
                  <span>{ imgArrs.length }</span>
                </div>
              </div>
            </div>
          ) : ''
        }
      </div>
    );
  }
}

export default ImgViewModal;
