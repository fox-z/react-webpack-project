
import React from 'react';
import {
 Spin, DatePicker, Input, Button, message, Upload,
} from 'antd';
import moment from 'moment';
import { Title } from '$components/index';
import './index.less';
import { FetchGet, FetchPost, FetchDelete } from '$server/request';
import { secondConfirm } from '$utils/func';


const { RangePicker } = DatePicker;

class AdConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      previewImgUrl: '',
      // type：类型 style：样式（0普通，1镂空，2全部）
      bottomBtns: [{
        type: 0,
        title: '替换',
        editTitle: '替换',
        style: 0,
      }, {
        type: 1,
        title: '预览',
        editTitle: '预览',
        style: 0,
      }, {
        type: 2,
        title: '向上',
        editTitle: '向上',
        style: 0,
      }, {
        type: 3,
        title: '向下',
        editTitle: '向下',
        style: 0,
      }, {
        type: 4,
        title: '删除',
        editTitle: '删除',
        style: 1,
      }, {
        type: 5,
        title: '编辑',
        editTitle: '保存',
        style: 2,
      }],
      configList: [],
    };
  }
  // 保存数据
  requestSaveConfig(type, index) {
    const self = this;
    const tempState = Object.assign({}, self.state);
    const imageUrl = tempState.configList[index].imageUrl;
    const startTime = tempState.configList[index].startTime;
    const endTime = tempState.configList[index].endTime;
    const link = tempState.configList[index].link;
    const isNew = tempState.configList[index].isNew;
    const id = tempState.configList[index].id;
    const params = {};
    // console.log(tempState.configList);
    if (!startTime) {
      message.warning('请填写 “开始时间”');
      return;
    }
    if (!endTime) {
      message.warning('请填写 “结束时间”');
      return;
    }
    if (!imageUrl) {
      message.warning('请添加 “图片”');
      return;
    }
    if (!link) {
      message.warning('请填写 “跳转链接”');
      return;
    }
    if (id) {
      params.id = id;
    }
    params.startTime = startTime;
    params.endTime = endTime;
    params.imageUrl = imageUrl;
    params.link = link;
    let requestURL = '/tms/activity-server/market/activity/banner/edit';
    if (isNew) {
      requestURL = '/tms/activity-server/market/activity/banner/add';
    }
    FetchPost({
      url: requestURL,
      data: params,
    }).then(res => {
      if (res.isSuccess) {
        message.success('保存成功');
        tempState.configList[index].isEdit = false;
        tempState.loading = false;
        self.setState(tempState, () => {
          self.requestGetConfig();
        });
      } else {
        message.error(`${res.message}, 请重试`);
      }
    });
  }
  // 获取数据
  requestGetConfig() {
    const self = this;
    const tempState = Object.assign({}, self.state);
    FetchGet({
      url: '/tms/activity-server/market/activity/banner/all',
      params: {}
    }).then(res => {
      if (res.isSuccess) {
        res.data.forEach(element => {
          element.isEdit = false;
          element.isNew = false;
        });
        tempState.configList = res.data;
        self.setState(tempState);
      } else {
        message.error(`${res.message}, 请重试`);
      }
    }).catch(() => {
      tempState.configList = [];
      self.setState(tempState);
    });
  }
  // 排序
  requestConfigPosition(id, dir) {
    const self = this;
    FetchPost({
      url: '/tms/activity-server/market/activity/banner/move',
      data: {
        dir,
        id,
      }
    }).then(res => {
      if (res.isSuccess) {
        message.success('保存成功');
        self.requestGetConfig();
      } else {
        message.error(`${res.message}, 请重试`);
      }
    }).catch(() => {});
  }
  // 删除
  requestDeleteConfig(id) {
    const self = this;
    FetchDelete({
      url: '/tms/activity-server/market/activity/banner/delete',
      data: {
        id,
      }
    }).then(res => {
      if (res.isSuccess) {
        message.success('删除成功');
        self.requestGetConfig();
      } else {
        message.error(`${res.message}, 请重试`);
      }
    }).catch(() => {});
  }
  buttonEnable(type, index) {
    const self = this;
    const tempState = Object.assign({}, self.state);
    const isEdit = tempState.configList[index].isEdit;
    let result = false;
    switch (type) {
      case 0: {
        // 替换
        result = isEdit;
        break;
      }
      case 1: {
        // 预览
        result = true;
        break;
      }
      case 2: {
        // 向上
        result = !isEdit && (index > 0);
        break;
      }
      case 3: {
        // 向下
        result = !isEdit && (index > 0) && (index < self.state.configList.length - 1);
        break;
      }
      case 4: {
        // 删除
        result = true;
        break;
      }
      case 5: {
        // 编辑保存
        result = true;
        break;
      }
      default:
        break;
    }
    return result;
  }
  // 操作
  clickButtonHandler(type, index) {
    const self = this;
    const tempState = Object.assign({}, self.state);
    const id = tempState.configList[index].id;
    const enable = this.buttonEnable(type, index);
    const sortIndex = tempState.configList[index].sortIndex;
    if (!enable) {
      // console.log('不可用哦~');
      return;
    }
    switch (type) {
      case 0: {
        // 替换
        break;
      }
      case 1: {
        // 预览
        self.clickPreviewImg(tempState.configList[index].imageUrl);
        break;
      }
      case 2: {
        // 向上
        self.requestConfigPosition(sortIndex, sortIndex - 1);
        break;
      }
      case 3: {
        // 向下
        self.requestConfigPosition(sortIndex, sortIndex + 1);
        break;
      }
      case 4: {
        // 删除
        secondConfirm('确定要删除吗？', '', () => {
          self.requestDeleteConfig(id);
        });
        break;
      }
      case 5: {
        const isEdit = tempState.configList[index].isEdit;
        if (isEdit) {
          // 保存
          self.requestSaveConfig(type, index);
        } else {
          // 编辑
          tempState.configList[index].isEdit = true;
          self.setState(tempState);
        }
        break;
      }
      default:
        break;
    }
  }
  // 预览
  clickPreviewImg(imgUrl) {
    const tempState = Object.assign({}, this.state);
    tempState.previewImgUrl = imgUrl;
    this.setState(tempState);
  }
  // 选择时间
  clickRangePicker(date, dateString, index) {
    const self = this;
    const tempState = Object.assign({}, self.state);
    // console.log(dateString);
    tempState.configList[index].startTime = dateString[0];
    tempState.configList[index].endTime = dateString[1];
    self.setState(tempState);
  }
  // 输入链接
  inputChange(value, index) {
    const self = this;
    const tempState = Object.assign({}, self.state);
    tempState.configList[index].link = value.trim();
    self.setState(tempState);
  }
  // 上传图片
  uploadImgChange(info, index) {
    const self = this;
    const tempState = Object.assign({}, self.state);
    const status = info.file.status;
    if (status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      if (info.file.response.code === 1) {
        tempState.configList[index].imageUrl = info.file.response.data[0].path;
        self.setState(tempState);
      } else {
        message.error(info.file.response.message);
      }
    } else if (status === 'error') {
      message.error(`${info.file.name} 上传失败, 请重试~`);
    }
  }
  // 新增
  clickAddButton() {
    const self = this;
    const tempState = Object.assign({}, self.state);
    const newConfig = {
      startTime: '',
      endTime: '',
      imageUrl: '',
      link: '',
      isEdit: true,
      isNew: true,
    };
    let hasEdit = false;
    if (tempState.configList.length) {
      tempState.configList.forEach((item) => {
        if (item.isEdit) {
          hasEdit = true;
        }
      });
    }
    if (hasEdit) {
      message.info('请保存后，再进行添加~');
      return;
    }
    tempState.configList.push(newConfig);
    self.setState(tempState);
  }
  componentWillMount() {
    const self = this;
    self.requestGetConfig();
  }
  buttonElement(obj, item, index) {
    let element = null;
    const enable = this.buttonEnable(item.type, index);
    if (item.style === 0) {
      // eslint-disable-next-line max-len
      element = <Button key={item.type} className="ad-btn" ghost type="link" style={{ color: enable ? '#f93450' : '#CCCCCC', fontWeight: '400' }} onClick={() => this.clickButtonHandler(item.type, index)}>{obj.isEdit ? item.editTitle : item.title}</Button>;
    } else if (item.style === 1) {
      // eslint-disable-next-line max-len
      element = <Button key={item.type} className="ad-btn" ghost type="danger" style={{ color: enable ? '#f93450' : '#CCCCCC', borderRadius: '14px' }} onClick={() => this.clickButtonHandler(item.type, index)}>{obj.isEdit ? item.editTitle : item.title}</Button>;
    } else if (item.style === 2) {
      // eslint-disable-next-line max-len
      element = <Button key={item.type} className="ad-btn" type="danger" style={{ color: '#ffffff', backgroundColor: '#f93450', borderRadius: '14px' }} onClick={() => this.clickButtonHandler(item.type, index)}>{obj.isEdit ? item.editTitle : item.title}</Button>;
    }
    return element;
  }
  render() {
    const {
      loading, configList, bottomBtns,
    } = this.state;
    return (
      <div className="app">
        <Title title="广告配置" />
        <Spin spinning={loading}>
          <div className="ad-background-wrap">
            <div className="ad-tab">好货抢购Banner</div>
            {
               configList.map((obj, index) => {
                return (
                  <div key={obj.id} className="ad-item-bg" style={{ borderColor: obj.isEdit ? '#f93450' : '#B2B2B2' }}>
                    <div className="ad-item">
                      <div className="img-row">
                        <Upload
                          className="upload-box"
                          action="/api/image/market/upload"
                          listType="text"
                          onChange={e => this.uploadImgChange(e, index)}
                          showUploadList={false}
                          accept="iamge/*"
                          disabled={!obj.isEdit}
                        >
                          <img className="preview-img" src={obj.imageUrl ? obj.imageUrl : '//cdn1.showjoy.com/shop/images/20191028/RITQMWWQPQXPOHI2JIIT1572255338086.png'} alt="" />
                        </Upload>
                      </div>
                      <div className="ad-input-wrap">
                        <div className="ad-picker-box">
                          <div className="ad-picker-title">配置展示时间</div>
                          <RangePicker
                            className="ad-picker"
                            showTime
                            defaultValue={
                              obj.startTime ? [moment(obj.startTime, 'YYYY-MM-DD HH:mm:ss'), moment(obj.endTime, 'YYYY-MM-DD HH:mm:ss')] : []
                            }
                            format="YYYY-MM-DD HH:mm:ss"
                            size="28px"
                            style={{ width: '480px' }}
                            disabled={!obj.isEdit}
                            onChange={(e1, e2) => this.clickRangePicker(e1, e2, index)}
                          />
                        </div>
                        <div className="ad-input-box">
                          <div className="ad-input-title">配置跳转链接</div>
                          <Input
                            className="ad-input"
                            placeholder="请输入跳转链接"
                            size="default"
                            disabled={!obj.isEdit}
                            onChange={(e) => this.inputChange(e.target.value, index)}
                          />
                        </div>
                        <div className="ad-bottom-btns">
                          {
                          bottomBtns.map((item) => {
                              return (item.title !== '替换' ? (
                                  this.buttonElement(obj, item, index)
                                ) : (
                                  <Upload
                                    key={item.type}
                                    className="upload-box"
                                    action="/api/image/market/upload"
                                    listType="text"
                                    onChange={e => this.uploadImgChange(e, index)}
                                    showUploadList={false}
                                    accept="iamge/*"
                                    disabled={!obj.isEdit}
                                  >
                                    {
                                      this.buttonElement(obj, item, index)
                                    }
                                  </Upload>
                                )
                              );
                            })
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            }
            <Button className="ad-add" type="primary" shape="round" size="default" onClick={() => this.clickAddButton()}>添加</Button>
          </div>
        </Spin>
        {
          this.state.previewImgUrl ? (
            <div className="preview-box" onClick={() => this.clickPreviewImg('')}>
              <img className="preview-img" src={this.state.previewImgUrl} width="auto" alt="" />
            </div>
          ) : ''
        }
      </div>
    );
  }
}

export default AdConfig;
