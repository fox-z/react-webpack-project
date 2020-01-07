import React from 'react';
import { Modal, Pagination } from 'antd';
import { getConsoleEnvHost } from '$utils/func';
import './index.less';


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    console.log(getConsoleEnvHost());
  }

  render() {
    return (
      <div className="app">
        首页开发中。。。
        {/* <OwnBreadCrumb dataSource={[{ name: '管理中心', path: '#/' }, { name: '部门管理', path: '#/department' }]} />
        <Title title="账户管理" /> */}
        <Modal
          title="测试"
          mask={false}
          maskClosable={false}
          visible={false}
          width={900}
          footer={
            <div>
              <Pagination
                size="small"
                total={50}
                showSizeChanger
                showQuickJumper
                pageSizeOptions={['10', '20', '40', '60']}
              />
            </div>
          }
        >
        </Modal>
      </div>
    );
  }
}

export default Home;
