import React, { PureComponent } from 'react';
import { Breadcrumb } from 'antd';
import './index.less';

export default class OwnBreadCrumb extends PureComponent {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     dataSource: [
  //       {
  //         name: '首页',
  //         path: '/',
  //       },
  //       {
  //         name: '商品成本管理',
  //         path: '/cost',
  //       }
  //     ],
  //   };
  // }
  render() {
    const { dataSource } = this.props;
    return (
      <div className="ant-breadcrumb-wrap">
        <Breadcrumb separator=">">
          {
            dataSource && dataSource.map(item => {
              return <Breadcrumb.Item href={item.path} key={item.name}>{item.name}</Breadcrumb.Item>;
            })
          }
        </Breadcrumb>
      </div>
    );
  }
}
