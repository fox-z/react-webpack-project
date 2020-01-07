### 页面默认模版

> 新建页面的时候直接复制过去

```
import React from 'react';
import { Button, Modal, Pagination } from 'antd';
import { OwnBreadCrumb, Title } from '$components/index';
import './index.less';


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="app">
        <OwnBreadCrumb dataSource={[{ name: '管理中心', path: '#/' }, { name: '部门管理', path: '#/department' }]} />
        <Title title="账户管理" />
        <Modal
          title="测试"
          maskClosable={false}
          visible={false}
          width={900}
          footer={
            null
          }
        >
        </Modal>
      </div>
    );
  }
}

export default Home;

```

> 默认的二次确认弹窗，api过多就不做成公共方法了,样式已经处理

```
    const modal = Modal.confirm({
      title: (
        <div className="common-modal-confirm-title">
          <Icon type="exclamation-circle" theme="filled" />
          <span className="common-modal-confirm-title-text">{title}</span>
        </div>),
      content,
      width: 500,
      centered: true,
      mask: false,
      icon: null,
      onCancel() {
        modal.destroy();
      },
      onOk() {
        console.log(333);
      }
    });
```