
import React from 'react';
import moment from 'moment';
import { Spin, Input, Table, message, DatePicker, Button } from 'antd';
import { Title } from '$components/index';
import { FetchGet } from '../../server/request';
import { secondConfirm } from '$utils/func';

import './index.less';

const RangePicker = DatePicker.RangePicker;

class NewsCenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      page: 1,
      pageSize: 20,
      newsId: '', // 新闻id
      newsKeywords: '', // 新闻名称
      newsTitle: '', // 新闻标题
      startTime: '', // 发布时间
      endTime: '', // 发布时间
      newsList: [
      ],
    };
  }

  componentDidMount() {
    this.reqData(1);
  }

  // 添加key
  addKey(data) {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    const arr = JSON.parse(JSON.stringify(data));
    for (const [index, item] of arr.entries()) {
      console.log(item, 'item');
      item.key = index;
    }
    return arr;
  }

  reqData(p) { // 请求列表
    const {
      page, pageSize, newsId, newsTitle, newsKeywords, startTime, endTime 
    } = this.state;
    this.setState({
      loading: false,
    }, async () => {
      const params = {
        page: p || page,
        pageSize,
      };
      if (newsId) {
        params.newsId = newsId;
      }
      if (newsTitle) {
        params.newsTitle = newsTitle;
      }
      // if (newsKeywords) {
      //   params.newsKeywords = newsKeywords;
      // }
      if (startTime) {
        params.startTime = moment(startTime).valueOf();
      }
      if (endTime) {
        params.endTime = moment(endTime).valueOf();
      }
      console.log(params, 'params');
      const result = await FetchGet({
        url: '/tms/sc-server/v1/api/getNewsList',
        params,
      });
      if (result && result.isSuccess) {
        this.setState({
          loading: false,
          newsList: this.addKey(result.data),
        });
      }
    });
  }

  searchIptChange(type, val) {
    this.setState({
      [type]: val
    });
  }

  rangePickChange(arr) {
    this.setState({
      startTime: arr[0],
      endTime: arr[1],
    });
  }

  viewNewsDetail(r) { // 查看详情
    console.log(r, 'r');
    this.props.history.push({
      pathname: '/newsCenterDetail',
      state: {
        newsId: r.id,
        type: 1
      },
    });
  }

  editNews(r) { // 编辑新闻
    this.props.history.push({
      pathname: '/newsCenterDetail',
      state: {
        newsId: r.id,
        type: 2
      },
    });
  }

  addNews() { // 添加新闻
    this.props.history.push({
      pathname: '/newsCenterDetail',
      state: {
        newsId: 0,
        type: 3
      },
    })
  }

  delNews(r) { // 删除新闻
    const newsId = r.id;
    secondConfirm('确认删除此新闻？', '删除后将不再官网展示！', async () => {
      const result = await FetchGet({
        url: '/tms/sc-server/v1/api/deleteById',
        params: {
          newsId,
        },
      });
      if (result && result.isSuccess) {
        message.success(result.msg || '删除成功！');
        this.reqData(1);
      }
    });
  }

  render() {
    const { loading, newsId, newsKeywords, newsTitle, newsList, startTime, endTime } = this.state;
    return (
      <div className="app">
        <Title title="新闻中心" />
        <Spin spinning={loading}>
          <div className="news-wrap">
            <div className="news-search-area">
              <div className="search-row">
                <div className="search-item">
                  <div className="item-tit">新闻ID</div>
                  <Input
                    className="item-ipt"
                    value={newsId}
                    placeholder="请输入新闻ID"
                    allowClear
                    onChange={e => this.searchIptChange('newsId', e.target.value)}
                    onPressEnter={() => this.reqData(1)}
                  />
                </div>

                <div className="search-item">
                  <div className="item-tit">新闻标题</div>
                  <Input
                    className="item-ipt"
                    value={newsTitle}
                    placeholder="请输入商品标题"
                    allowClear
                    onChange={e => this.searchIptChange('newsTitle', e.target.value)}
                    onPressEnter={() => this.reqData(1)}
                  />
                </div>

                {/* <div className="search-item">
                  <div className="item-tit">新闻关键字</div>
                  <Input
                    className="item-ipt"
                    value={newsKeywords}
                    placeholder="请输入店铺名称"
                    allowClear
                    onChange={e => this.searchIptChange('newsKeywords', e.target.value)}
                    onPressEnter={() => this.reqData(1)}
                  />
                </div> */}
              </div>

              <div className="search-row">
                <div className="search-item">
                  <div className="item-tit">新闻时间</div>
                  <RangePicker
                    allowClear
                    className="date-picker"
                    format="YYYY/MM/DD HH:mm:ss"
                    showTime={{
                      defaultValue: [this.$moment('00:00:00', 'HH:mm:ss'), this.$moment('00:00:00', 'HH:mm:ss')],
                    }}
                    value={[startTime
                    ? this.$moment(startTime) : null,
                    endTime ? this.$moment(endTime) : null]}
                    onChange={(m, dateString) => this.rangePickChange(dateString)}
                  />
                </div>

                <div className="search-item">
                  <div className="item-tit"></div>
                  <Button type="primary" className="item-btn" onClick={() => this.reqData(1)}>搜索</Button>
                </div>
              </div>
            </div>

            <div className="staff-btns">
              <Button className="add-staff" onClick={() => this.addNews()}>新增新闻</Button>
            </div>

            <Table
              pagination={false}
              dataSource={newsList}
              bordered
              columns={[
                {
                  title: '新闻ID',
                  dataIndex: 'id',
                  key: 'id',
                  width: 80,
                },
                {
                  title: '标题',
                  dataIndex: 'title',
                  key: 'title',
                  width: 200,
                },
                {
                  title: '新闻时间',
                  dataIndex: 'publishTime',
                  key: 'publishTime',
                  width: 150,
                  render: (t) => {
                    return <div>{this.$moment(t).format('YYYY.MM.DD HH:mm:ss')}</div>
                  }
                },
                {
                  title: '来源',
                  dataIndex: 'source',
                  key: 'source',
                  width: 100,
                },
                {
                  title: '操作人',
                  dataIndex: 'userId',
                  key: 'userId',
                  width: 100,
                  render: (t, r) => {
                    return <p>{`[${t}]${r.userNick}`}</p>;
                  },
                },
                {
                  title: '修改时间',
                  dataIndex: 'modifiedTime',
                  key: 'modifiedTime',
                  width: 150,
                  render: (t) => {
                    return <div>{this.$moment(t).format('YYYY.MM.DD HH:mm:ss')}</div>
                  }
                },
                {
                  title: '操作',
                  dataIndex: 'key',
                  key: 'key',
                  width: 150,
                  render: (t, r) => {
                    return (
                      <div className="flex">
                        <span className="blue" onClick={() => this.viewNewsDetail(r)}>查看</span>
                        <span className="blue" style={{ marginLeft: '5px' }} onClick={() => this.editNews(r)}>修改</span>
                        <span className="blue" style={{ marginLeft: '5px' }} onClick={() => this.delNews(r)}>删除</span>
                      </div>
                    );
                  }
                },
              ]}
            />
          </div>
        </Spin>
      </div>
    );
  }
}

export default NewsCenter;
