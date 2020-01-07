import React from 'react';
import {
  Upload,
  Icon,
  message,
  Spin
} from 'antd';
import './index.less';

const Dragger = Upload.Dragger;
const Glo_postRequest = function Glo_postRequest() {};

export default class ImgUploadList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      maxLength: this.props.maxLength || 0,
      uploadIndex: 0,
      isChange: false,
      actionUrl: this.props.actionUrl,
      styleType: this.props.styleType || 'horizon', // vertical horizon[default]
      imgArrs: [],
      isExtra: this.props.isExtra,
    };
    this.getBase64Image = this.getBase64Image.bind(this);
  }

  componentWillReceiveProps(next) {
    // console.log(next);
    const tempState = Object.assign({}, this.state);
    tempState.imgArrs = [];
    // next.actionUrl && (tempState.actionUrl = next.actionUrl);
    // next.styleType && (tempState.styleType = next.styleType);
    // next.maxLength && (tempState.maxLength = next.maxLength);
    if (next.imgArrs && next.imgArrs.length) {
      next.imgArrs.forEach((item, index) => {
        tempState.imgArrs.push({
          uid: index,
          status: 'done',
          isHover: false,
          url: item,
        });
      });
    }
    this.setState(tempState);
  }

  setHover(index, bool) {
    if (this.props.disabled) {
      return;
    }
    const tempState = Object.assign({}, this.state);
    tempState.imgArrs[index].isHover = bool;
    this.setState(tempState);
  }

  getBase64Image(image) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const dataURL = canvas.toDataURL('image/jpeg');
    return dataURL;
  }

  beforeUpload(info, list, index) {
    const tempState = Object.assign({}, this.state);
    console.log(this.state.imgArrs.length + list.length, tempState.maxLength, tempState.isChange);
    this.state.uploadIndex += 1;
    const formData = new FormData();
    if (this.state.uploadIndex === list.length) {
      if (tempState.maxLength !== 0 && (this.state.imgArrs.length + list.length) > tempState.maxLength && tempState.isChange === false) {
        message.error(`最多可上传${tempState.maxLength}张图片，请重新选择！`);
        tempState.uploadIndex = 0;
        this.setState(tempState);
      } else {
        list.forEach((item, key) => {
          formData.append(`files${key}`, item);
        });
        this.setState({
          loading: true,
        }, () => {
          Glo_postRequest({
            context: this,
            url: tempState.actionUrl,
            data: formData,
            response: (err, res) => {
              const result = JSON.parse(res.text);
              if (result.code === 1) {
                if (index !== undefined) {
                  // change img
                  tempState.imgArrs[index] = {
                    uid: list[0].uid,
                    url: result.data[0].path,
                    status: 'done',
                    isHover: false,
                  };
                } else {
                  // upload imgs
                  list.forEach((item, listIndex) => {
                    tempState.imgArrs.push({
                      uid: item.uid,
                      url: result.data[listIndex].path,
                      status: 'done',
                      isHover: false,
                    });
                  });
                }
              } else {
                message.error(result.message);
              }
              tempState.loading = false;
              tempState.isChange = false;
              tempState.uploadIndex = 0;
              this.setState(tempState, () => {
                const tempImg = [];
                tempState.imgArrs.forEach((item) => {
                  tempImg.push(item.url);
                });
                this.props.upload(tempImg);
              });
            },
          });
        });
      }
    }
  }

  deleteItem(e, index) {
    e.preventDefault();
    e.stopPropagation();
    const tempState = Object.assign({}, this.state);
    this.setState({
      loading: true,
    }, () => {
      tempState.imgArrs.splice(index, 1);
      tempState.loading = false;
      this.setState(tempState, () => {
        const tempImg = [];
        tempState.imgArrs.forEach(item => {
          tempImg.push(item.url);
        });
        this.props.upload(tempImg);
      });
    });
  }

  movePosition(e, index, item, type) {
    e.preventDefault();
    e.stopPropagation();
    item.isHover = false;
    const tempState = Object.assign({}, this.state);
    switch (type) {
      case 'up':
        if (index === 0) {
          message.info('已是第一个');
          return;
        }
        tempState.imgArrs.splice(index, 1);
        tempState.imgArrs.splice(index - 1, 0, item);
        break;
      case 'down':
        if (index === tempState.imgArrs.length - 1) {
          message.info('已是最后一个');
          return;
        }
        tempState.imgArrs.splice(index, 1);
        tempState.imgArrs.splice(index + 1, 0, item);
        break;
      case 'toup':
        if (index === 0) {
          message.info('已是第一个');
          return;
        }
        tempState.imgArrs.splice(index, 1);
        tempState.imgArrs.unshift(item);
        break;
      case 'todown':
        if (index === tempState.imgArrs.length - 1) {
          message.info('已是最后一个');
          return;
        }
        tempState.imgArrs.splice(index, 1);
        tempState.imgArrs.push(item);
        break;
      default:
        break;
    }
    this.setState(tempState, () => {
      const tempImg = [];
      tempState.imgArrs.forEach(ytem => {
        tempImg.push(ytem.url);
      });
      this.props.upload(tempImg);
    });
  }

  downloadImage(e, index) {
    e.preventDefault();
    e.stopPropagation();
    const tempState = Object.assign({}, this.state);
    const url = tempState.imgArrs[index].url;
    const image = new Image();
    image.setAttribute('crossOrigin', 'Anonymous');
    console.log(image);
    image.onload = () => {
      const base = this.getBase64Image(image);
      this.refs.picDownload.href = base;
      this.refs.picDownload.setAttribute('download', url);
      this.refs.picDownload.click();
    };
    image.src = url;
  }

  render() {
    return (
      <Spin spinning={this.state.loading}>
        <div className={`component-img-upload-list ${this.state.styleType}`}>
          {
            this.state.imgArrs.map((item, index) => {
              return (
                <Dragger
                  disabled={this.props.disabled}
                  showUploadList={false}
                  accept="image/*"
                  beforeUpload={(info, list) => this.beforeUpload(info, list, index)}
                  customRequest={() => {}}
                >
                  <div className="preview-box item"
                    onMouseEnter={() => this.setHover(index, true)}
                    onMouseLeave={() => this.setHover(index, false)}
                  >
                    {
                    !item.isHover ? null : (
                      <div className="mask" onClick={() => this.setState({ isChange: true })}>
                        <div className="opt-area"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        >
                          <Icon className="toup-btn"
                            type="verticle-left"
                            onClick={(e) => this.movePosition(e, index, item, 'toup')}
                          />
                          <Icon className="up-btn"
                            type="up"
                            onClick={(e) => this.movePosition(e, index, item, 'up')}
                          />
                          <Icon className="down-btn"
                            type="down"
                            onClick={(e) => this.movePosition(e, index, item, 'down')}
                          />
                          <Icon className="todown-btn"
                            type="verticle-left"
                            onClick={(e) => this.movePosition(e, index, item, 'todown')}
                          />
                          <Icon className="delete-btn"
                            type="delete"
                            onClick={(e) => this.deleteItem(e, index)}
                          />
                        </div>
                        {
                          this.state.isExtra ? (
                            <div className="opt-area extra">
                              <a
                                download
                                target="_blank"
                                onClick={(e) => this.downloadImage(e, index)}
                                href={item.url}
                              >
                                <Icon className="download-btn" type="download"></Icon>
                              </a>
                              <a onClick={(e) => { e.stopPropagation(); }} href={item.url} target="_blank">
                                <Icon className="link-btn" type="link"></Icon>
                              </a>
                              <a ref="picDownload" style={{ display: 'none' }}></a>
                            </div>) : null
                        }
                      </div>)
                      }
                    <img className="preview-img" src={item.url} alt="" />
                  </div>
                </Dragger>
              );
            })
          }
          {
            this.state.maxLength ? (
              <Dragger
                disabled={this.props.disabled}
                showUploadList={false}
                accept="image/*"
                multiple
                beforeUpload={(info, list) => this.beforeUpload(info, list)}
                customRequest={() => {}}
              >
                <div className="dragger-content item">
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击上传图片</p>
                  <p className="ant-upload-hint">支持拖拽上传</p>
                </div>
              </Dragger>) : (
                this.state.imgArrs.length >= this.state.maxLength ? null : (
                  <Dragger
                    disabled={this.props.disabled}
                    showUploadList={false}
                    accept="image/*"
                    multiple
                    beforeUpload={(info, list) => this.beforeUpload(info, list)}
                    customRequest={() => {}}
                  >
                    <div className="dragger-content item">
                      <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                      </p>
                      <p className="ant-upload-text">点击上传图片</p>
                      <p className="ant-upload-hint">支持拖拽上传</p>
                    </div>
                  </Dragger>)
            )
          }
        </div>
      </Spin>
    );
  }
}
