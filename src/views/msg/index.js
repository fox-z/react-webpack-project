import React from 'react';
import { Button, Modal, Pagination, Tabs, Badge } from 'antd'; // eslint-disable-line
import { Title } from '$components/index';
import MsgList from './msgList';
import './index.less';

const TabPane = Tabs.TabPane;

class Msg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabsKey: '1',
    };
  }

  componentDidMount() {
  }

  tabsChange(key) {
    console.log(key, 'table');
    this.setState({
      tabsKey: key,
    });
  }
  render() {
    const {
      tabsKey
    } = this.state;
    return (
      <div className="app">
        <Title title="消息通知" />
        <div className="msg-wrap">
          <Tabs
            defaultActiveKey={tabsKey}
            animated={{ inkBar: true, tabPane: false }}
            onChange={key => this.tabsChange(key)}
          >
            <TabPane
              tab={(
                <div className="msg-badge-wrap">
                  <Badge count="3">
                    代办提醒
                  </Badge>
                </div>
              )}
              key="1"
            >
              <MsgList />
            </TabPane>
            <TabPane
              tab={(
                <div className="msg-badge-wrap">
                  <Badge count="43">
                    进度跟踪
                  </Badge>
                </div>
              )}
              key="2"
            >
              2
            </TabPane>
            <TabPane
              tab={(
                <div className="msg-badge-wrap">
                  <Badge count="433">
                    系统通知
                  </Badge>
                </div>
              )}
              key="3"
            >
              3
            </TabPane>
            <TabPane
              tab={(
                <div className="msg-badge-wrap">
                  <Badge count="0" dot>
                    官方公告
                  </Badge>
                </div>
              )}
              key="4"
            >
              4
            </TabPane>
            <TabPane
              tab={(
                <div className="msg-badge-wrap">
                  <Badge count="433" dot>
                    营销新闻
                  </Badge>
                </div>
              )}
              key="5"
            >
              5
            </TabPane>
            <TabPane
              tab={(
                <div className="msg-badge-wrap">
                  <Badge count="433" dot>
                    全部
                  </Badge>
                </div>
              )}
              key="6"
            >
              6
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default Msg;
