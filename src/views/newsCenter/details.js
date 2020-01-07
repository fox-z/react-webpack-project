
import React from 'react';
import moment from 'moment';
import { Spin, Input, DatePicker, Button, message } from 'antd';
import WangEditor from 'wangeditor';
import { Title } from '$components/index';
import { FetchGet, FetchPost } from '../../server/request';
import { getUrlParam } from '../../utils/func';

import './details.less';

class NewsCenterDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      type: 1,
      newsId: 0,

      newsName: '', // 新闻名称
      newsTitle: '', // 新闻标题
      newsSource: '', // 来源
      content: '', // 新闻内容
      publishTime: '', // 发布时间
    };
  }

  componentDidMount() {
    const self = this;
    let type = 1; // 1 查看 2 编辑 3 新增
    let newsId = 0; // 新闻id
    let state = this.props.location.state;
    console.log(state, 'state');
    if (state && state.type) {
      type = +state.type;
      newsId = +state.newsId;
      window.sessionStorage.setItem('newsState',JSON.stringify(state));
    } else {
      state = JSON.parse(window.sessionStorage.getItem('newsState'));
      type = +state.type;
      newsId = +state.newsId;
    }
    // 需要等editor创建之后才能设置
    console.log(type, newsId, '获取参数');
    let editor = null;
    if (type !== 1) {
      self.setState({
        type,
        newsId: newsId || 0,
      }, () => {
        console.log(self.refs.editor, 'self.refs.editor');
        editor = new WangEditor(self.refs.editor);
        editor.customConfig.zIndex = 1;
        editor.customConfig.uploadImgShowBase64 = true; // 使用 base64 保存图片
        editor.customConfig.onchange = (html) => {
          self.setState({
            content: html
          });
        }
        editor.create();
        if (newsId) {
          self.getDetail(editor);
        }
      });
      // editor.$textElem.attr('contenteditable', type === 1 ? false : true);
    } else {
      self.setState({
        type,
        newsId: newsId || 0,
      }, () => {
        if (newsId) {
          self.getDetail(editor);
        }
      });
    }
  }

  componentWillUnmount() {
    window.sessionStorage.removeItem('newsState');
  }

  searchIptChange(type, val) {
    this.setState({
      [type]: val,
    });
  }

  dateChange(str) {
    console.log(str, 'str');
    this.setState({
      publishTime: str ? moment(str) : moment(),
    });
  }

  goBack() {
    this.props.history.goBack();
  }

  getDetail(editor) {
    const { newsId, type } = this.state;
    this.setState({
      loading: true,
    }, async () => {
      const result = await FetchGet({
        url: '/tms/sc-server/v1/api/getNewsById',
        params: { newsId },
      });
      if (result && result.isSuccess) {
        const res = result.data;
        if (res) {
          this.setState({
            loading: false,
            newsTitle: res.title,
            newsId: res.id,
            newsSource: res.source,
            content: res.content,
            publishTime: res.publishTime,
            modifiedTime: res.modifiedTime
          });
          if (type !== 1 && editor) {
            editor.txt.html(res.content);
          }
        }
      }
    });
  }

  async submit() {
    const { newsTitle, newsId, newsSource, content, publishTime } = this.state;
    if (!newsTitle) {
      message.info('请填写新闻标题');
    }
    if (!newsSource) {
      message.info('请填写新闻来源');
    }
    if (!content) {
      message.info('请填写新闻内容');
    }
    if (!publishTime) {
      publishTime = moment().valueOf();
    }
    const params = {
      title: newsTitle,
      source: newsSource,
      content,
      publishTime: moment(publishTime).valueOf(),
    };
    let url = '';
    if (newsId) {
      // 编辑
      params.id = newsId;
      url = '/tms/sc-server/v1/api/updateNews'
    } else {
      // 新增
      url = '/tms/sc-server/v1/api/addNews'
    }
    console.log(params, 'params');
    const result = await FetchPost({ url, data: JSON.stringify(params) });
    if (result && result.isSuccess) {
      message.success(result.msg || '提交成功!');
      this.props.history.push({
        pathname: 'newsCenter',
      });
    }
  }

  render() {
    const { loading, newsTitle, newsSource, publishTime, type, content } = this.state;
    return (
      <div className="app">
        <Title title="新闻详情" />
        <Spin spinning={loading}>
          <div className="news-details-wrap">
          <div className="news-search-area">
              <div className="search-row">

                <div className="search-item">
                  <div className="item-tit">新闻标题</div>
                  {
                    type === 1 ? (
                      <div className="item-text">{newsTitle}</div>
                    ) : (
                      <Input
                        className="item-ipt"
                        value={newsTitle}
                        placeholder="请输入商品标题"
                        allowClear
                        onChange={e => this.searchIptChange('newsTitle', e.target.value)}
                      />
                    )
                  }
                </div>

                <div className="search-item">
                  <div className="item-tit">新闻来源</div>
                  {
                    type === 1 ? (
                      <div className="item-text">{newsSource}</div>
                    ) : (
                      <Input
                        className="item-ipt"
                        value={newsSource}
                        placeholder="请输入新闻来源"
                        allowClear
                        onChange={e => this.searchIptChange('newsSource', e.target.value)}
                      />
                    )
                  }
                </div>

                <div className="search-item">
                  <div className="item-tit">新闻时间</div>
                  {
                    type === 1 ? (
                      <div className="item-text">{moment(publishTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                    ) : (
                      <DatePicker
                        allowClear
                        showTime
                        value={ publishTime? moment(publishTime) : null}
                        placeholder="请选择时间"
                        onChange={(val, str) => this.dateChange(str)}
                      />
                    )
                  }
                </div>

              </div>
            </div>
            {
              type === 1 ? (
                <div>
                  <div className="html-wrap" dangerouslySetInnerHTML={{ __html: content }}></div>
                  <div className="btns-wrap">
                    <Button type="primary" onClick={() => this.goBack()}>返回</Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div ref="editor" className="editor"></div>
                  <div className="btns-wrap">
                    <Button type="primary" onClick={() => this.submit()}>保存</Button>
                  </div>
                </div>
              )
            }
          </div>
        </Spin>
      </div>
    );
  }
}

export default NewsCenterDetail;
