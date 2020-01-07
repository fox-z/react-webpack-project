import React from 'react';
import {
  Button, Modal, Pagination, Tabs, Input, Table, Select, Checkbox, message,
  Spin
} from 'antd';
import {
  Title, Tips
} from '$components/index';
import { FetchPost, FetchGet } from '$server/request';
import { secondConfirm } from '$utils/func';
import { getAccessTypeText } from '$config/enums';
import './index.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
class Functional extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tabsKey: '1',
      departmentList: [], // 部门列表
      permissionsList: [], // 权限列表

      addFunctionalModal: false,
      roleList: [], // 功能列表
      roleEditType: 1, // 编辑 功能 类型（1新增 2编辑 3复制）
      rolePage: 1, //
      rolePageSize: 10,
      roleTotal: 0, // 总数
      roleName: '', // 搜索框 功能名
      roleDesc: '', // 搜索框 功能说明
      roleMark: '', // 搜索框 备注
      department: '', // 搜索框 部门名
      permissionsName: '', // 搜索框 权限名
      roleId: '', // 编辑的功能id
      roleNameModal: '', // 弹窗 功能名
      roleDescModal: '', // 弹窗 功能描述
      roleMarkModal: '', // 弹窗 备注
      departmentIdsModal: [], // 弹窗 部门
      accessIdsModal: [], // 弹窗 子权限集合

      addPowerModal: false,
      accessEditType: 1, // accessEditType
      accessList: [], // 权限列表
      accessTotal: 0, // 列表总数
      accessPage: 1, //
      accessPageSize: 10,
      permissionId: '', // 编辑的权限id
      accessName: '', // 权限名
      accessValue: '', // 权限值
      accessType: '', // 权限类型
      accessTypeList: [ // 权限类型
        {
          key: 0,
          type: 1,
          value: '菜单',
        },
        {
          key: 1,
          type: 2,
          value: '页面',
        },
        {
          key: 2,
          type: 3,
          value: '接口',
        },
      ], // 权限类型集合
      accessName1Modal: '',
      accessName2Modal: '',
      accessName3Modal: '',
      accessTypeModal: '',
      accessValueModal: '',
    };
  }

  componentDidMount() {
    this.getDepartmentList();
    this.getRoleList();
    this.getAccessList(true);
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
// 初始化数据获取
  // 获取部门列表
  changeDepartment(data) {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    const arr = [];
    for (const [index, item] of data.entries()) {
      arr.push({
        label: item.departmentName,
        value: item.departmentId,
        key: index,
      });
    }
    return arr;
  }
  getDepartmentList() {
    FetchGet({
      url: '/tms/access-server/v1/get/departmentPage',
    }).then(res => {
      console.log(res, '部门列表');
      if (res.isSuccess) {
        this.setState({
          departmentList: this.changeDepartment(res.data),
        });
      }
    });
  }
  // 获取权限列表
  getPermissionsList() {
    FetchGet({
      url: '/tms/access-server/v1/get/departmentPage',
    }).then(res => {
      if (res.isSuccess) {
        this.setState({
          departmentList: this.changeDepartment(res.data),
        });
      }
    }).catch(() => {
      this.setState({
        departmentList: []
      });
    });
  }
  // tab切换
  tabsChange(key) {
    console.log(key, 'tabKey');
    this.setState({
      tabsKey: key,
      loading: true,
    }, () => {
      if (key === '1') {
        this.getRoleList();
        this.getAccessList(true);
      } else {
        this.getAccessList();
      }
    });
  }

  /**
   * 功能列表
   */
  // 获取功能列表
  getRoleList() {
    const {
      roleName, roleDesc, roleMark, department, permissionsName, rolePage, rolePageSize,
    } = this.state;
    const params = {
      roleName,
      roleDesc,
      remark: roleMark,
      department,
      permissionsName,
      page: +rolePage || 1,
      pageSize: +rolePageSize
    };
    console.log(params, 'params');
    FetchGet({
      url: '/tms/access-server/v1/rolePage',
      params,
    }).then(res => {
      if (res.isSuccess) {
        this.setState({
          roleList: this.addKey(res.data.backstageRolePageDTOArrayList),
          rolePage: res.data.page,
          roleTotal: res.data.count,
          loading: false,
        });
      }
    }).catch(err => {
      console.log(err);
      this.setState({
        roleList: [],
        rolePage: 1,
        roleTotal: 0,
        loading: false,
      });
    });
  }
  // 分页
  rolePaginationChange(type, val) {
    console.log(type, val, '分页内容');
    if (type === 'rolePageSize') {
      this.setState({
        rolePage: 1,
        rolePageSize: +val
      }, () => {
        this.getRoleList();
      });
    } else {
      this.setState({
        [type]: +val
      }, () => {
        this.getRoleList();
      });
    }
  }
  // 新增功能列表
  addRole() {
    this.setState({
      addFunctionalModal: true,
      roleEditType: 1,
    });
  }
  // 取消功能弹窗
  cancleRoleModal() {
    this.setState({
      addFunctionalModal: false,
      roleId: '',
      roleEditType: 1,
      roleNameModal: '',
      roleDescModal: '',
      roleMarkModal: '',
      departmentIdsModal: [],
      accessIdsModal: []
    });
  }
  // 编辑功能
  editRole(r) {
    FetchGet({
      url: '/tms/access-server/v1/roleQuery/id',
      params: {
        roleId: r.roleId,
      }
    }).then(res => {
      if (res.isSuccess) {
        this.setState({
          addFunctionalModal: true,
          roleEditType: 2,
          roleId: res.data.roleId,
          roleNameModal: res.data.roleName,
          roleDescModal: res.data.roleDesc,
          roleMarkModal: res.data.remark,
          departmentIdsModal: res.data.departmentIdList,
          accessIdsModal: res.data.permissionsIdList
        });
      }
    });
  }
  // 复制功能
  copyRole(r) {
    FetchGet({
      url: '/tms/access-server/v1/roleQuery/id',
      params: {
        roleId: r.roleId,
      }
    }).then(res => {
      this.setState({
        addFunctionalModal: true,
        roleEditType: 3,
        roleNameModal: '',
        roleDescModal: '',
        roleMarkModal: '',
        departmentIdsModal: res.data.departmentIdList,
        accessIdsModal: res.data.permissionsIdList
      });
    });
  }
  // 删除功能
  deleteRole(r) {
    secondConfirm('确定要删除该功能吗？', '删除后系统将自动收回该功能下的全部权限', () => {
      FetchPost({
        url: '/tms/access-server/v1/roleDelete',
        data: {
          roleId: r.roleId,
        }
      }).then(res => {
        console.log(res, 'res');
        if (res.isSuccess) {
          this.setState({
            rolePage: 1,
          }, () => {
            this.getRoleList();
          });
        }
        this.cancleRoleModal();
      });
    });
  }
  // 搜索数据保存
  roleIptChange(type, val) {
    if (type === 'department') {
      this.setState({
        [type]: val,
      }, () => {
        this.getRoleList();
      });
    } else {
      this.setState({
        [type]: val,
      });
    }
  }
  // 弹窗数据保存
  roleModalChange(type, val) {
    this.setState({
      [type]: val,
    });
  }
  // 保存功能
  saveRoleModal() {
    const {
      roleNameModal, roleDescModal, roleMarkModal, departmentIdsModal, accessIdsModal,
      roleEditType, roleId
    } = this.state;
    if (!roleNameModal || !roleDescModal || !roleMarkModal || !departmentIdsModal.length || !accessIdsModal.length) {
      message.info('功能所有信息都为必填');
      return;
    }
    const params = {
      roleName: roleNameModal,
      roleDesc: roleDescModal,
      remark: roleMarkModal,
      departmentId: [...new Set(departmentIdsModal)],
      permissionsList: [...new Set(accessIdsModal)]
    };
    let url = '';
    if (roleEditType === 2) {
      url = '/tms/access-server/v1/roleUpdate';
      params.roleId = roleId;
    } else {
      url = '/tms/access-server/v1/roleAdd';
    }
    console.log(params, 'params');
    FetchPost({
      url,
      data: params,
    }).then(res => {
      if (res.isSuccess) {
        this.getRoleList();
        this.cancleRoleModal();
      }
    }).catch(() => {
      this.cancleRoleModal();
    });
  }

  /**
   * 权限列表
   */
  // 获取权限列表
  getAccessList(unNeedPage) {
    const {
      accessName, accessValue, accessType, accessPage, accessPageSize
    } = this.state;
    const params = {
      permissionsName: accessName,
      permissionsValue: accessValue,
      permissionsType: accessType ? +accessType : '',
    };
    if (!unNeedPage) {
      params.page = +accessPage || 1;
      params.pageSize = +accessPageSize;
    }
    console.log(params, 'params');
    FetchGet({
      url: '/tms/access-server/v1/get/permissionsPage',
      params,
    }).then(res => {
      console.log(res, 'res');
      if (res.isSuccess) {
        this.setState({
          accessList: this.addKey(res.data.backstagePermissionsInfoDTOList),
          accessPage: res.data.page || 1,
          accessTotal: res.data.count,
          permissionsList: res.data.backstagePermissionsInfoDTOList,
          loading: false,
        });
      }
    }).catch(err => {
      console.log(err.toString());
      this.setState({
        accessList: [],
        accessPage: 1,
        accessTotal: 0,
        loading: false,
      });
    });
  }
  // 分页
  accessPaginationChange(type, val) {
    console.log(type, val, '分页内容');
    if (type === 'accessPageSize') {
      this.setState({
        accessPage: 1,
        accessPageSize: +val
      }, () => {
        this.getAccessList();
      });
    } else {
      this.setState({
        [type]: +val
      }, () => {
        this.getAccessList();
      });
    }
  }
  // 搜索框内容保存
  accessIptChange(type, val) {
    if (type === 'accessType') {
      this.setState({
        [type]: val,
      }, () => {
        this.getAccessList();
      });
    } else {
      this.setState({
        [type]: val.trim(),
      });
    }
  }
  // 添加权限
  addAccess() {
    this.setState({
      addPowerModal: true,
      accessEditType: 1,
    });
  }
  // 编辑权限
  editAccess(r) {
    console.log(r, 'r');
    const accessNameArr = r.permissionsName.split('-');
    this.setState({
      addPowerModal: true,
      accessEditType: 2,
      accessName1Modal: accessNameArr[0],
      accessName2Modal: accessNameArr[1],
      accessName3Modal: accessNameArr[2],
      accessTypeModal: r.permissionType,
      accessValueModal: r.permissionsValue,
      permissionId: r.permissionsId,
    });
  }
  // 复制权限
  copyAccess(r) {
    const accessNameArr = r.permissionsName.split('-');
    this.setState({
      addPowerModal: true,
      accessEditType: 3,
      accessName1Modal: accessNameArr[0],
      accessName2Modal: accessNameArr[1],
      accessName3Modal: accessNameArr[2],
      accessTypeModal: r.permissionType,
      accessValueModal: '', // 权限值设为空
      permissionId: r.permissionsId,
    });
  }
  // 弹窗取消
  cancleAccessModal() {
    this.setState({
      addPowerModal: false,
      permissionId: '',
      accessName1Modal: '',
      accessName2Modal: '',
      accessName3Modal: '',
      accessTypeModal: '',
      accessValueModal: '',
    });
  }
  // 弹窗内容保存
  accessModalChange(type, val) {
    this.setState({
      [type]: val,
    });
  }
  // 删除权限
  deleteAccess(r) {
    secondConfirm('确定要删除该权限吗？', '删除后将影响绑定有该权限的功能的正常使用', () => {
      FetchPost({
        url: '/tms/access-server/v1/get/permissionsDelete',
        data: {
          permissionId: r.permissionsId,
        }
      }).then(res => {
        console.log(res, 'res');
        if (res.isSuccess) {
          message.success(res.msg || '操作成功');
          this.setState({
            accessPage: 1,
          }, () => {
            this.getAccessList();
          });
        }
      });
    });
  }
  // 保存权限
  saveAccess() {
    const {
      accessName1Modal, accessName2Modal, accessName3Modal, accessTypeModal, accessValueModal,
      accessEditType, permissionId
    } = this.state;
    if (!accessTypeModal || !accessName1Modal || !accessValueModal) {
      message.info('请按照规范填写完整的名称', 3);
      return;
    }
    if (accessTypeModal >= 2 && !accessName2Modal) {
      message.info('请按照规范填写完整的名称', 3);
      return; // eslint-disable-line
    }
    if (accessTypeModal >= 3 && !accessName3Modal) {
      message.info('请按照规范填写完整的名称', 3);
      return; // eslint-disable-line
    }
    const params = {
      permissionType: accessTypeModal,
      permissionName: accessName1Modal,
      permissionValue: accessValueModal,
    };
    if (accessTypeModal >= 2) {
      params.permissionName += `-${accessName2Modal}`;
    }
    if (accessTypeModal >= 3) {
      params.permissionName += `-${accessName3Modal}`;
    }
    let url = '';
    if (accessEditType === 2) {
      params.permissionId = permissionId;
      url = '/tms/access-server/v1/get/permissionsUpdate';
    } else {
      url = '/tms/access-server/v1/get/permissionsAdd';
    }
    console.log(params, 'params');
    FetchPost({
      url,
      data: params
    }).then(res => {
      console.log(res, 'res');
      if (res.isSuccess) {
        message.success(res.msg || '操作成功');
        this.getAccessList();
        this.cancleAccessModal();
      }
    }).catch(() => {
      this.cancleAccessModal();
    });
  }

  render() {
    const {
      tabsKey, departmentList, addFunctionalModal, addPowerModal, loading,
      roleList, roleEditType, roleName, roleDesc, roleMark, department, permissionsName,
      roleNameModal, roleDescModal, roleMarkModal, departmentIdsModal, accessIdsModal, roleTotal,
      accessList, accessName, accessValue, accessType, accessTotal, accessTypeList, permissionsList,
      accessName1Modal, accessName2Modal, accessName3Modal, accessTypeModal, accessValueModal
    } = this.state;
    return (
      <div className="app">
        <Title title="功能权限" />
        <Spin spinning={loading}>
          <div className="functional-wrap">
            <Tabs
              activeKey={tabsKey}
              animated={{ inkBar: true, tabPane: false }}
              onChange={key => this.tabsChange(key)}
            >
              <TabPane tab="功能列表" key="1">
                <div className="functional-list">
                  <div className="search-area">
                    <div className="item-row">
                      <div className="search-item">
                        <div className="tit">功能名</div>
                        <Input placeholder="请输入功能名"
                          className="ipt"
                          value={roleName}
                          allowClear
                          onChange={e => this.roleIptChange('roleName', e.target.value)}
                          onPressEnter={() => this.getRoleList()}
                        />
                      </div>
                      <div className="search-item">
                        <div className="tit">功能说明</div>
                        <Input placeholder="请输入功能说明"
                          className="ipt"
                          allowClear
                          value={roleDesc}
                          onChange={e => this.roleIptChange('roleDesc', e.target.value)}
                          onPressEnter={() => this.getRoleList()}
                        />
                      </div>
                      <div className="search-item">
                        <div className="tit">备注</div>
                        <Input placeholder="请输入备注"
                          className="ipt"
                          allowClear
                          value={roleMark}
                          onChange={e => this.roleIptChange('roleMark', e.target.value)}
                          onPressEnter={() => this.getRoleList()}
                        />
                      </div>
                    </div>
                    <div className="item-row">
                      <div className="search-item">
                        <div className="tit">部门</div>
                        <Select className="ipt"
                          placeholder="请选择部门"
                          showArrow
                          showSearch
                          allowClear
                          optionFilterProp="children"
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          onChange={v => this.roleIptChange('department', v)}
                          value={department || undefined}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                          {
                            departmentList.map(item => {
                              return <Option key={item.key} value={item.label}>{item.label}</Option>;
                            })
                          }
                        </Select>
                      </div>
                      <div className="search-item">
                        <div className="tit">权限名</div>
                        <Input placeholder="请输入权限名"
                          className="ipt"
                          allowClear
                          value={permissionsName}
                          onChange={e => this.roleIptChange('permissionsName', e.target.value)}
                          onPressEnter={() => this.getRoleList()}
                        />
                        {/* <Select className="ipt"
                          placeholder="请选择权限"
                          showArrow
                          showSearch
                          allowClear
                          optionFilterProp="children"
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          onChange={v => this.roleIptChange('accessId', v)}
                          value={accessId || undefined}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                          <Option value="1">交互设计师</Option>
                          <Option value="2">前端工程师</Option>
                        </Select> */}
                      </div>
                      <div className="search-item">
                        {/* 占位 */}
                      </div>
                    </div>
                    <div className="item-row">
                      <div className="search-item">
                        <div className="tit"></div>
                        <Button type="primary" className="search-btn" onClick={() => this.getRoleList()}>搜索</Button>
                      </div>
                    </div>
                  </div>

                  <div className="functional-btns">
                    <Button className="head-btn" onClick={() => this.addRole()}>新增功能</Button>
                  </div>

                  <div className="functional-table">
                    <Table
                      bordered
                      pagination={false}
                      dataSource={roleList}
                      columns={
                        [{
                          title: '功能名',
                          dataIndex: 'roleName',
                          key: 'roleName',
                          width: 150,
                        }, {
                          title: '功能说明',
                          dataIndex: 'roleDesc',
                          key: 'roleDesc',
                          width: 330,
                        }, {
                          title: '备注',
                          dataIndex: 'remark',
                          key: 'remark',
                          width: 220,
                        }, {
                          title: '部门',
                          dataIndex: 'backstageDepartmentBaseDTOList',
                          key: 'backstageDepartmentBaseDTOList',
                          width: 140,
                          render: (c) => {
                            return (
                              c && c.map(item => {
                                return (
                                  <span key={item.departmentId} className="department-name">{item.departmentName}</span>
                                );
                              })
                            );
                          }
                        }, {
                          title: '操作',
                          dataIndex: 'key',
                          key: 'key',
                          width: 175,
                          render: (c, r) => {
                            return (
                              <div className="flex">
                                <span className="blue" onClick={() => this.editRole(r)}>编辑</span>
                                <span className="blue" onClick={() => this.copyRole(r)}>复制</span>
                                <span className="blue" onClick={() => this.deleteRole(r)}>删除</span>
                              </div>
                            );
                          }
                        }]}
                    />
                    <div className="pagination-wrap">
                      <Pagination
                        total={roleTotal}
                        showSizeChanger
                        showQuickJumper
                        onChange={p => this.rolePaginationChange('rolePage', p)}
                        onShowSizeChange={(c, s) => this.rolePaginationChange('rolePageSize', s)}
                        pageSizeOptions={['10', '20', '40', '60']}
                      />
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tab="权限列表" key="2">
                <div className="power-list">
                  <div className="search-area">
                    <div className="area-left">
                      <div className="item-row">
                        <div className="search-item">
                          <div className="tit">权限名</div>
                          <Input placeholder="请输入权限名"
                            className="ipt"
                            allowClear
                            value={accessName}
                            onChange={e => this.accessIptChange('accessName', e.target.value)}
                            onPressEnter={() => this.getAccessList()}
                          />
                        </div>
                        <div className="search-item">
                          <div className="tit">权限值</div>
                          <Input placeholder="请输入权限值"
                            className="ipt"
                            allowClear
                            value={accessValue}
                            onChange={e => this.accessIptChange('accessValue', e.target.value)}
                            onPressEnter={() => this.getAccessList()}
                          />
                        </div>
                      </div>

                      <div className="item-row">
                        <div className="search-item">
                          <div className="tit"></div>
                          <Button type="primary" className="search-btn" onClick={() => this.getAccessList()}>搜索</Button>
                        </div>
                      </div>
                    </div>
                    <div className="area-right">
                      <div className="item-row">
                        <div className="search-item">
                          <div className="tit">权限类型</div>
                          <Select className="ipt"
                            placeholder="请选择权限类型"
                            showArrow
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            onChange={v => this.accessIptChange('accessType', v)}
                            value={accessType || undefined}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                          >
                            {
                              accessTypeList.map(item => {
                                return <Option key={item.key} value={item.type}>{item.value}</Option>;
                              })
                            }
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="functional-btns">
                    <Button className="head-btn" onClick={() => this.addAccess()}>新增权限</Button>
                  </div>

                  <div className="functional-table">
                    <Table
                      bordered
                      pagination={false}
                      dataSource={accessList}
                      columns={
                        [{
                          title: '权限ID',
                          dataIndex: 'permissionsId',
                          key: 'permissionsId',
                          width: 120,
                        }, {
                          title: '权限名',
                          dataIndex: 'permissionsName',
                          key: 'permissionsName',
                          width: 310,
                        }, {
                          title: '权限值',
                          dataIndex: 'permissionsValue',
                          key: 'permissionsValue',
                          width: 340,
                        }, {
                          title: '权限类型',
                          dataIndex: 'permissionType',
                          key: 'permissionType',
                          width: 118,
                          render: (t) => {
                            return (
                              <div>{getAccessTypeText(t)}</div>
                            );
                          }
                        }, {
                          title: '操作',
                          dataIndex: 'key',
                          key: 'key',
                          width: 128,
                          render: (c, r) => {
                            return (
                              <div className="flex">
                                <span className="blue" onClick={() => this.editAccess(r)}>编辑</span>
                                <span className="blue" onClick={() => this.copyAccess(r)}>复制</span>
                                <span className="blue" onClick={() => this.deleteAccess(r)}>删除</span>
                              </div>
                            );
                          }
                        }]}
                    />
                    <div className="pagination-wrap">
                      <Pagination
                        total={accessTotal}
                        showSizeChanger
                        showQuickJumper
                        onChange={p => this.accessPaginationChange('accessPage', p)}
                        onShowSizeChange={(c, s) => this.accessPaginationChange('accessPageSize', s)}
                        pageSizeOptions={['10', '20', '40', '60']}
                      />
                    </div>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Spin>

        <Modal
          title={roleEditType === 1 ? '新增功能' : roleEditType === 2 ? '编辑功能' : '复制功能'}
          maskClosable={false}
          visible={addFunctionalModal}
          width={460}
          onCancel={() => this.cancleRoleModal()}
          footer={null}
        >
          <div className="functional-tips">
            {
              roleEditType === 3 ? (
                <Tips content="复制功能前请重新编辑功能名称、功能说明、备注" />
              )
              : ''
            }
          </div>
          <div className="add-functional-modal">
            <div className="functional-item">
              <div className="tit">功能名称</div>
              <Input className="ipt"
                allowClear
                placeholder="请输入功能名称(max: 20)"
                maxLength={20}
                value={roleNameModal}
                onChange={e => this.roleModalChange('roleNameModal', e.target.value)}
              />
            </div>
            <div className="functional-item">
              <div className="tit">功能说明</div>
              <Input.TextArea className="ipt area"
                allowClear
                maxLength={50}
                placeholder="描述该功能的作用"
                value={roleDescModal}
                onChange={e => this.roleModalChange('roleDescModal', e.target.value)}
                autosize
              />
            </div>
            <div className="functional-item">
              <div className="tit">绑定权限</div>
              <Select className="ipt"
                placeholder="请选择权限"
                showArrow
                showSearch
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={v => this.roleModalChange('accessIdsModal', v)}
                value={accessIdsModal || undefined}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                mode="multiple"
              >
                {
                  permissionsList.map(item => {
                    return (<Option key={item.permissionsId} value={item.permissionsId}>{item.permissionsName}</Option>);
                  })
                }
              </Select>
            </div>
            <div className="functional-item">
              <div className="tit">分配部门</div>
              <div className="ipt">
                <Checkbox.Group options={departmentList}
                  value={departmentIdsModal}
                  onChange={(v) => this.roleModalChange('departmentIdsModal', v)}
                />
              </div>
            </div>
            <div className="functional-item">
              <div className="tit">备注</div>
              <Input.TextArea className="ipt area"
                allowClear
                maxLength={50}
                placeholder="填写项目名称、需求链接、功能维护人"
                value={roleMarkModal}
                onChange={e => this.roleModalChange('roleMarkModal', e.target.value)}
                autosize
              />
            </div>
            <div className="bts">
              <Button onClick={() => this.cancleRoleModal()}>取消</Button>
              <Button className="right"
                type="primary"
                onClick={() => this.saveRoleModal()}
              >
                保存
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          title="新增权限"
          maskClosable={false}
          visible={addPowerModal}
          onCancel={() => this.cancleAccessModal()}
          width={460}
          footer={null}
        >
          <div className="add-power-modal">
            <div className="add-power-item">
              <span className="tit">权限类型</span>
              <Select className="ipt"
                placeholder="请选择权限类型"
                showArrow
                showSearch
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={v => this.accessModalChange('accessTypeModal', v)}
                value={accessTypeModal || undefined}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {
                  accessTypeList.map(item => {
                    return <Option key={item.key} value={item.type}>{item.value}</Option>;
                  })
                }
              </Select>
            </div>

            <div className="add-power-item">
              <span className="tit">权限名</span>
              <div className="ipt-box">
                <Input className="ipt-item-1"
                  allowClear
                  placeholder="一级菜单名称"
                  value={accessName1Modal}
                  maxLength={6}
                  onChange={e => this.accessModalChange('accessName1Modal', e.target.value)}
                />
                {
                  accessTypeModal >= 2 ? (
                    <Input className="ipt-item-2"
                      allowClear
                      placeholder="二级菜单名称"
                      maxLength={6}
                      value={accessName2Modal}
                      onChange={e => this.accessModalChange('accessName2Modal', e.target.value)}
                    />
                  )
                  : ''
                }
                {
                  accessTypeModal >= 3 ? (
                    <Input className="ipt-item-3"
                      allowClear
                      placeholder="接口名称"
                      maxLength={20}
                      value={accessName3Modal}
                      onChange={e => this.accessModalChange('accessName3Modal', e.target.value)}
                    />
                  )
                  : ''
                }
              </div>
            </div>

            <div className="add-power-item">
              <span className="tit">权限值</span>
              <Input className="ipt"
                allowClear
                maxLength={50}
                placeholder="权限值（仅支持大,小写字母以及“/，-，_”）"
                value={accessValueModal}
                onChange={e => this.accessModalChange('accessValueModal', e.target.value)}
              />
            </div>

            <div className="btns">
              <Button onClick={() => this.cancleAccessModal()}>取消</Button>
              <Button className="right"
                type="primary"
                onClick={() => this.saveAccess()}
                disabled={!(accessName1Modal && accessTypeModal && accessValueModal)}
              >
                保存
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Functional;
