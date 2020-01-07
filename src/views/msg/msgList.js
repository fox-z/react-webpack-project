import React from 'react';
import {
  Button, Modal, Pagination, Table
} from 'antd';
import './index.less';


class MsgList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  render() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.isReaded, // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <div className="msg-list-wrap">
        <div className="btns-wrap">
          <Button className="btn">标记为已读</Button>
          <p className="msg-tips">
            <span>共50条消息，其中</span>
            <span className="red">50</span>
            <span>条消息未读</span>
          </p>
        </div>
        <div className="table-wrap">
          <Table
            bordered
            pagination={false}
            rowSelection={rowSelection}
            dataSource={[
              {
                id: 1,
                key: 0,
                msgType: '官方公告',
                msgTitle: '有订单超时发货',
                msgDetail: '发动机是咖啡冷静啊了放假快乐的撒娇了放假fdsfdsfs了的撒娇范德萨啦家乐福的撒娇了大撒放辣椒的沙拉酱了发',
                msgSendTime: '2019-11-20 12:00:00',
                isReaded: false,
              },
              {
                id: 2,
                key: 1,
                msgType: '官方公告',
                msgTitle: '有订单超时发货',
                msgDetail: '发动机是咖啡冷静啊了放假快乐的撒娇了放假了fdafdsa的撒娇范德萨啦家乐福的撒娇了大撒放辣椒的沙拉酱了发',
                msgSendTime: '2019-11-20 12:00:00',
                isReaded: true,
              }
            ]}
            columns={[
              {
                title: '消息主题',
                dataIndex: 'msgTitle',
                key: 'msgTitle',
                className: 'msg-title',
                width: 630,
                render: (c, r) => {
                  return (
                    <div className={`msg-theme ${r.isReaded ? 'readed' : ''}`}>
                      <div className="msg-unread"></div>
                      <div className="msg-row-detail">
                        <span className="msg-row-tit">{c}</span>
                        {r.msgDetail}
                      </div>
                    </div>
                  );
                }
              },
              {
                title: '消息类型',
                dataIndex: 'msgType',
                key: 'msgType',
                width: 134,
                render: (c, r) => {
                  return (
                    <div className={`msg-type ${r.isReaded ? 'readed' : ''}`}>{c}</div>
                  );
                }
              },
              {
                title: '发送时间',
                dataIndex: 'msgSendTime',
                key: 'msgSendTime',
                width: 228,
                render: (c, r) => {
                  return (
                    <div className={`msg-type ${r.isReaded ? 'readed' : ''}`}>{c}</div>
                  );
                }
              },
            ]}
          />
          <div className="pagination-wrap">
            <Pagination
              total={20}
              showSizeChanger
              showQuickJumper
              onChange={p => this.rolePaginationChange('rolePage', p)}
              onShowSizeChange={(c, s) => this.rolePaginationChange('rolePageSize', s)}
              pageSizeOptions={['10', '20', '40', '60']}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MsgList;
