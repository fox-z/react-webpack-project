/**
 * @params
 * @fileName=英文文件名
 * @cnName=中文命名
 */


const fs = require('fs');
const Argv = require('yargs');

// const routers = require('./src/routes.js');
// 拿到输入的文件名
const fileName = Argv.argv.fileName;
const CNName = Argv.argv.cnName;

if (!fileName || !CNName) {
  console.log('请输入文件夹名例如：--fileName=test --cnName=测试页面');
  process.exit();
}

const className = fileName.replace(fileName[0], fileName[0].toUpperCase());

const url = `${__dirname}/src/views/${fileName}`;

const init = [
  {
    url: `${url}/index.js`,
    content: `
import React from 'react';
import { Modal } from 'antd';
import { OwnBreadCrumb, Title } from '$components/index';
import './index.less';

class ${className} extends React.Component {
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

export default ${className};\n`,
  },
  {
    url: `${url}/index.less`,
    content: '',
  },
];

fs.mkdir(url, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`目录${url}创建成功`);
  init.forEach(item => {
    fs.writeFile(item.url, item.content, (error) => {
      if (error) {
        console.log('写入文件失败', err);
      }
      console.log(`${item.url}已创建, ${item.url}已初始化`);
    });
  });
});

console.log('添加路由中...');

fs.readFile(`${__dirname}/src/routes.js`, 'utf8', (err, routers) => {
  if (err) {
    console.log('读取路由文件失败', err);
  }
  const file = routers.replace(/\/\/ \@\@\@\@/g, `{
    name: '${CNName}',
    path: '/${fileName}',
    exact: true,
    component: ac(() => import('$views/${fileName}')),\n  },\n  // @@@@`);

  fs.writeFile(`${__dirname}/src/routes.js`, file, (error) => {
    if (error) {
      console.log('修改路由失败', error);
    }
    console.log('添加路由成功');
  });
});
