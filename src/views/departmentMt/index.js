import React from 'react';
import {
  Button, Modal, Pagination, Tabs, Table, Icon, Select, Input, Tooltip, message,
  InputNumber, Spin,
} from 'antd';
import {
  Title, Tips
} from '$components/index';
import { getUserInfo } from '$config/cookies';
import { FetchGet, FetchPost } from '$server/request';
import { secondConfirm } from '$utils/func';
import { getUserTypeText, getCurrentTimeText } from '$config/enums';
import './index.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class Department extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tabsKey: '1',

      userInfo: getUserInfo(), // 用户信息
      departmentList: [], // 部门列表
      departmentId: '', // 当前的部门Id
      departmentName: '', // 当前的部门Name
      addOwnModal: false,
      ownList: [], // 管理员列表

      addPositionModal: false,
      editPositionType: 1, // 1 新增 2 编辑
      positionList: [], // 职位列表
      positionId: '', // 编辑的 职位id
      positionName: '', // 职位名
      roleName: '', // 功能名
      positionPage: 1, // 当前页码
      positionPageSize: 10, // 当前的页数量
      positionTotal: 0, // 总数据
      newPositionName: '',
      newPositionDesc: '',
      newRoleList: [], // 新增/编辑 的功能列表

      addStaffModal: false,
      staffList: [], // 员工列表
      cateList: [], // 所有的类目列表
      supplierList: [], // 所有的供应商列表

      extraRoleList: [], // 所有的附加功能列表
      staffPage: 1,
      staffPageSize: 10,
      staffTotal: 0,
      staffUserId: '', // 搜索框 userid
      staffExtraRole: '', // 搜索框 附加功能
      staffNickName: '', // 搜索框 昵称
      staffSupplierId: '', // 搜索框 供应商
      staffPositionName: '', // 搜索框 职位
      staffEditType: 1, // 编辑类型
      staffModalNickName: '', // 弹窗 昵称
      staffModalPositionId: '', // 弹窗 职位
      staffModalSupplierIds: [], // 弹窗 供应商ids
      staffModalSupplierIdStart: '', // 弹窗 供应商id开始
      staffModalSupplierIdEnd: '', // 弹窗 供应商id结束
      staffModalPcCateIds: [], // 弹窗 类目ids
      staffModalExtraRole: [], // 弹窗 附加功能
      staffModalTel: '', // 弹窗 用户手机
      staffModalUserId: '', // 弹窗 用户手机
      staffModalUserName: '', // 弹窗 用户手机
      staffModalUserType: '', // 弹窗 用户手机

      funcList: [], // 功能列表
      funcPage: 1,
      funcPageSize: 10,
      funcRoleName: '',
      funcTotal: 0, // 列表数据总数
    };
  }
  componentWillMount() {
    window.addEventListener('userInfo', (res) => {
      console.log(res, '接受到的数据');
    });
  }
  componentDidMount() {
    // 先拿到部门id
    const { tabsKey, userInfo } = this.state;
    if (userInfo) {
      console.log(userInfo, 'userInfo——');
      if (userInfo.userType === 101) {
        // 系统管理员
        this.getDepartmentList(() => {
          this.getTabPaneData(tabsKey);
        });
      } else if (userInfo.userType === 102) {
        // 部门管理员
        this.setState({
          departmentId: userInfo.departmentId,
          departmentName: userInfo.departmentName,
        }, () => {
          this.getTabPaneData(tabsKey);
        });
      }
    }
  }
  // 添加key
  addKey(data) {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    const arr = JSON.parse(JSON.stringify(data));
    for (const [index, item] of arr.entries()) {
      item.key = index;
    }
    return arr;
  }
  // 获取部门列表
  getDepartmentList(cb) {
    FetchGet({
      url: '/tms/access-server/v1/get/departmentPage',
    }).then(res => {
      console.log(res);
      if (res.isSuccess) {
        this.setState({
          departmentList: res.data,
          departmentId: res.data[0].departmentId, // 默认给第一个部门id
          departmentName: res.data[0].departmentName,
        }, () => {
          cb && cb(); // eslint-disable-line
        });
      }
    });
  }
  // 部门切换
  departmentItemClick(item) {
    const { tabsKey, departmentId } = this.state;
    console.log(item.departmentId, '部门id');
    if (item.departmentId === departmentId) {
      return;
    }
    this.setState({
      departmentId: item.departmentId,
      departmentName: item.departmentName,
      loading: true,
      funcPage: 1,
      funcPageSize: 10,
      funcRoleName: '',
      staffUserId: '',
      staffExtraRole: '',
      staffNickName: '',
      staffSupplierId: '',
      staffPositionName: '',
      staffPage: 1,
      staffPageSize: 10,
      positionName: '',
      roleName: '',
      positionPage: 1,
      positionPageSize: 10,
    }, () => {
      this.getTabPaneData(tabsKey);
    });
  }
  // 获取管理员列表
  getOwnList() {
    const { departmentId } = this.state;
    FetchGet({
      url: '/tms/access-server/v1/get/administratorList/departmentId',
      params: {
        departmentId,
      }
    }).then(res => {
      console.log(res);
      if (res.isSuccess) {
        this.setState({
          ownList: this.addKey(res.data),
          loading: false,
        });
      }
    }).catch(() => {
      this.setState({
        ownList: [],
        loading: false,
      });
    });
  }
  // 获取类目列表
  getCateList() {
    FetchGet({
      url: '/tms/goods-server/v1/get/cateList',
      params: {}
    }).then(res => {
      console.log(res, '获取类目列表');
      if (res.isSuccess) {
        this.setState({
          cateList: this.addKey(res.data),
        });
      }
    }).catch(() => {
      this.setState({
        cateList: [],
      });
    });
  }
  // 获取供应商列表
  getSupplierList() {
    FetchGet({
      url: '/tms/goods-server/v1/get/supplierList',
      params: {}
    }).then(res => {
      if (res.isSuccess) {
        this.setState({
          supplierList: this.addKey(res.data),
        });
      }
    }).catch(() => {
      this.setState({
        supplierList: [],
      });
    });
  }

  tabsChange(key) {
    console.log(key, 'table');
    this.setState({
      tabsKey: key,
      loading: true,
    }, () => {
      this.getTabPaneData(key);
    });
  }
  // tab切换需要做的数据请求
  getTabPaneData(tabsKey) {
    if (tabsKey === '1') {
      this.getOwnList();
      this.getStaffList(true);
    } else if (tabsKey === '2') {
      this.setState({
        roleName: '',
        staffExtraRole: '',
        staffPositionName: '',
      }, () => {
        this.getPositionList();
        this.getfuncList(true);
      });
    } else if (tabsKey === '3') {
      this.setState({
        staffUserId: '',
        staffExtraRole: '',
        staffNickName: '',
        staffSupplierId: '',
        staffPositionName: '',
        staffPage: 1,
        staffPageSize: 10,
      }, () => {
        this.getStaffList();
        this.getPositionList(true);
        this.getCateList();
        this.getSupplierList();
      });
    } else if (tabsKey === '4') {
      this.setState({
        funcPage: 1,
        funcPageSize: 10,
        funcRoleName: '',
        staffExtraRole: '',
        staffPositionName: '',
      }, () => {
        this.getfuncList();
      });
    }
  }
  /**
   * 管理员相关
   */
  // 新增管理员
  addOwn() {
    // 获取到所有的内部用户列表
    this.setState({
      addOwnModal: true,
    });
  }
  // 取消弹窗
  cancelOwn() {
    this.setState({
      addOwnModal: false,
      addOwnId: '',
    });
  }
  // 删除管理员
  deleteOwn(key) {
    console.log(key, '要删除的key');
    const { ownList, departmentId } = this.state;
    secondConfirm('确定要删除该管理员吗？', '删除后系统将自动收回该员工的管理员权限。', () => {
      const userId = ownList.find(item => item.key === key).userId;
      FetchPost({
        url: '/tms/access-server/v1/delete/administrator',
        data: {
          departmentId,
          userId,
        }
      }).then(res => {
        if (res.isSuccess) {
          this.getOwnList();
        }
      });
    });
  }
  addOwnIdChange(v) {
    console.log(v, '添加的管理员');
    this.setState({
      addOwnId: v,
    });
  }
  // 提交新增的管理员
  submitOwn() {
    const { addOwnId, departmentId } = this.state;
    FetchPost({
      url: '/tms/access-server/v1/add/administrator',
      data: {
        userId: addOwnId,
        departmentId,
      },
    }).then(res => {
      // 重新拉取数据
      if (res.isSuccess) {
        this.cancelOwn();
        this.getOwnList();
      }
    });
  }

  /**
   * 职位相关
   */
  // 获取职位列表
  getPositionList(unNeedPage) {
    const {
      positionName, roleName, positionPage, positionPageSize, departmentId
    } = this.state;
    const params = {
      departmentId,
      positionName,
      roleName,
    };
    if (!unNeedPage) {
      params.page = positionPage || 1;
      params.pageSize = positionPageSize;
    }
    FetchGet({
      url: '/tms/access-server/v1/get/positionPage',
      params,
    }).then(res => {
      console.log(res);
      if (res.isSuccess) {
        this.setState({
          positionList: this.addKey(res.data.backstagePositionDTOList),
          positionTotal: res.data.count,
          positionPage: res.data.page || 1,
          loading: false,
        });
      }
    }).catch(err => {
      console.log(err.toString());
      this.setState({
        positionList: [],
        positionTotal: 0,
        positionPage: 1,
        loading: false,
      });
    });
  }
  // 获取搜索条件
  positionIptChange(type, val) {
    console.log(type, val);
    this.setState({
      [type]: val.trim(),
    });
  }
  // 分页
  positionPaginationChange(type, val) {
    console.log(type, val, '分页内容');
    if (type === 'positionPageSize') {
      this.setState({
        positionPageSize: +val,
        positionPage: 1,
      }, () => {
        this.getPositionList();
      });
    } else {
      this.setState({
        [type]: +val
      }, () => {
        this.getPositionList();
      });
    }
  }
  // 新增职位
  addPosition() {
    this.setState({
      addPositionModal: true,
      editPositionType: 1,
      newPositionName: '',
      newPositionDesc: '',
    }, () => {
      this.positionAddRole();
    });
  }
  // 取消弹窗
  canclePosition() {
    this.setState({
      addPositionModal: false,
      newRoleList: [],
      newPositionDesc: '',
      newPositionName: '',
      positionId: '', //
    });
  }
  // 选择功能
  selectRoleChange(key, v) {
    const { newRoleList, funcList } = this.state;
    const newRoleItem = newRoleList.find(item => item.key === key);
    const oldRoleItem = funcList.find(item => item.roleId === v);
    if (newRoleItem) {
      newRoleItem.roleId = v;
      newRoleItem.roleDesc = oldRoleItem.roleDesc;
    }
    console.log(newRoleList, 'newRoleList');
    this.setState({
      newRoleList,
    });
  }
  // 新增职位功能
  positionAddRole() {
    const { newRoleList } = this.state;
    if (newRoleList.length >= 1) {
      if (!newRoleList[0].roleId) {
        return;
      }
      newRoleList.forEach(item => {
        item.key = +item.key + 1;
      });
    }
    newRoleList.unshift({
      key: 0,
      roleId: '',
      roleDesc: '',
    });
    console.log(newRoleList, 'newRoleList');
    this.setState({
      newRoleList,
    });
  }
  // 编辑职位初始化
  positionEditRole(data) {
    if (!(data || data.length)) {
      data = [{
        key: 0,
        roleId: '',
        roleDesc: '',
      }];
    }
    console.log(data, 'roleList');
    return data;
  }
  // 移除职位某一个功能
  roleListRemove(key) {
    const { newRoleList } = this.state;
    newRoleList.splice(+key, 1);
    // 给key重新排序
    newRoleList.forEach((item, index) => {
      item.key = index;
    });
    this.setState({
      newRoleList,
    });
  }
  // 查看职位的员工列表
  viewPositionNameStaffList(r) {
    this.setState({
      staffPositionName: r.positionName,
      tabsKey: '3',
    }, () => {
      this.getStaffList();
    });
  }
  // 编辑 职位功能
  editPosition(r) {
    console.log(r, 'r');
    FetchGet({
      url: '/tms/access-server/v1/get/positionQuery/id',
      params: {
        positionId: r.positionId
      }
    }).then(res => {
      if (res.isSuccess) {
        this.setState({
          editPositionType: 2, // 编辑
          addPositionModal: true,
          newPositionDesc: res.data.desc,
          newPositionName: res.data.positionName,
          newRoleList: this.positionEditRole(res.data.backstageRoleDTOList),
          positionId: r.positionId, // 编辑的 职位id
        });
      }
    });
  }
  // 删除 职位
  deletePosition(positionId) {
    secondConfirm('确定要删除该职位吗？', '删除后系统将自动收回本职位员工的职位默认角色', () => {
      FetchPost({
        url: '/tms/access-server/v1/get/positionDelete',
        data: {
          positionId,
        }
      }).then(res => {
        console.log(res, '删除positionId');
        if (res.isSuccess) {
          message.success(res.msg || '操作成功');
          // 重新拉取数据
          this.setState({
            positionPage: 1,
          }, () => {
            this.getPositionList();
          });
        }
      });
    });
  }
  // 提交 新增的职位功能
  submitPosition() {
    const {
      newPositionName, newPositionDesc, newRoleList,
      editPositionType, positionId, departmentId
    } = this.state;
    let roleIdList = [];
    newRoleList.forEach(item => {
      if (item.roleId) {
        roleIdList.push(item.roleId);
      }
    });
    roleIdList = [...new Set(roleIdList)];
    const data = {
      departmentId,
      positionName: newPositionName,
      positionDesc: newPositionDesc,
      roleIdList,
    };
    let url = '';
    if (editPositionType === 1) {
      url = '/tms/access-server/v1/get/positionAdd';
    } else {
      data.positionId = positionId;
      url = '/tms/access-server/v1/get/positionUpdate';
    }
    console.log(data, 'params');
    FetchPost({
      url,
      data,
    }).then(res => {
      console.log(res, 'res');
      if (res.isSuccess) {
        this.getPositionList();
        this.canclePosition();
      }
    }).catch(() => {
      this.canclePosition();
    });
  }


  /**
   * 员工相关
   */
  // 搜索框内容获取
  staffIptChange(type, val) {
    if (type === 'staffSupplierId') {
      this.setState({
        [type]: val
      }, () => {
        this.getStaffList();
      });
    } else if (type === 'staffUserId') {
      this.setState({
        [type]: val.replace(/[^\d]$/, '')
      });
    } else {
      this.setState({
        [type]: val.trim()
      });
    }
  }
  // 获取 所有的附加功能列表（指排除本职位的功能）
  getExtraRoleList() {
    const { departmentId, staffModalPositionId } = this.state;
    FetchGet({
      url: '/tms/access-server/v1/roleAttachQuery/departmentId',
      params: {
        departmentId,
        positionId: staffModalPositionId,
      }
    }).then(res => {
      if (res.isSuccess) {
        this.setState({
          extraRoleList: res.data
        });
      }
    }).catch(() => {
      this.setState({
        extraRoleList: []
      });
    });
  }
  // 员工列表
  getStaffList(unNeedPage) {
    const {
      staffUserId, staffExtraRole, staffNickName, staffSupplierId,
      staffPositionName, staffPage, staffPageSize, departmentId
    } = this.state;
    const params = {
      extraRole: staffExtraRole,
      nickName: staffNickName,
      supplierId: staffSupplierId,
      positionName: staffPositionName,
      departmentId,
    };
    if (staffUserId) {
      params.userId = +staffUserId;
    }
    if (!unNeedPage) {
      params.page = staffPage || 1;
      params.pageSize = staffPageSize;
    }
    FetchGet({
      url: '/tms/access-server/v1/get/BackstageStaffPage',
      params,
    }).then(res => {
      console.log(res, 'getStaffList');
      if (res.isSuccess) {
        this.setState({
          staffList: this.addKey(res.data.backstageStaffDTOS),
          staffTotal: res.data.count,
          staffPage: res.data.page || 1,
          loading: false,
        });
      }
    }).catch(() => {
      this.setState({
        staffList: [],
        staffTotal: 0,
        staffPage: 1,
        loading: false,
      });
    });
  }
  // 新增员工
  addStaff() {
    this.getPositionList();
    this.setState({
      addStaffModal: true,
      staffEditType: 1,
    });
  }
  // 编辑员工
  editStaff(userId) {
    FetchGet({
      url: '/tms/access-server/v1/get/BackstageStaffQuery/id',
      params: {
        userId,
      }
    }).then(res => {
      this.setState({
        addStaffModal: true,
        staffEditType: 2,
        staffModalNickName: res.data.nickName, // 弹窗 昵称
        staffModalPositionId: res.data.positionId, // 弹窗 职位
        staffModalSupplierIds: res.data.supplierList, // 弹窗 供应商ids
        staffModalSupplierIdStart: '', // 弹窗 供应商id开始
        staffModalSupplierIdEnd: '', // 弹窗 供应商id结束
        staffModalPcCateIds: res.data.cateList, // 弹窗 类目ids
        staffModalExtraRole: res.data.extraRoleIdList, // 弹窗 附加功能
        staffModalTel: res.data.tel, // 弹窗 用户手机
        staffModalUserId: res.data.userId, // 弹窗 用户手机
        staffModalUserName: res.data.userName, // 弹窗 用户手机
        staffModalUserType: res.data.userType, // 弹窗 用户手机
      }, () => {
        this.getExtraRoleList();
      });
    });
  }
  // 取消弹窗
  cancelStaff() {
    this.setState({
      addStaffModal: false,
      staffEditType: 1, // 编辑类型
      staffModalNickName: '', // 弹窗 昵称
      staffModalPositionId: '', // 弹窗 职位
      staffModalSupplierIds: [], // 弹窗 供应商ids
      staffModalSupplierIdStart: '', // 弹窗 供应商id开始
      staffModalSupplierIdEnd: '', // 弹窗 供应商id结束
      staffModalPcCateIds: [], // 弹窗 类目ids
      staffModalExtraRole: [], // 弹窗 附加功能
      staffModalTel: '', // 弹窗 用户手机
      staffModalUserId: '', // 弹窗 用户手机
      staffModalUserName: '', // 弹窗 用户手机
      staffModalUserType: '', // 弹窗 用户手机
    });
  }
  // 删除员工
  deleteStaff(obj) {
    secondConfirm('确定要删除该员工吗？', '删除后系统将自动收回该员工的全部权限', () => {
      FetchPost({
        url: '/tms/access-server/v1/get/BackstageStaffDelete',
        data: {
          userId: obj.userId,
          departmentId: obj.departmentId,
          positionId: obj.positionId,
        }
      }).then(res => {
        if (res.isSuccess) {
          message.success(res.msg || '操作成功');
          this.setState({
            staffPage: 1,
          }, () => {
            this.getStaffList();
          });
        }
      });
    });
  }
  // 保存员工信息
  staffSubmit() {
    const {
      staffEditType, staffModalNickName, staffModalPositionId, staffModalSupplierIds,
      staffModalSupplierIdStart, staffModalSupplierIdEnd, staffModalPcCateIds, departmentId,
      staffModalExtraRole, staffModalUserId
    } = this.state;
    if (!staffModalNickName) {
      message.info('请填写正确的昵称');
      return;
    }
    if (!staffModalPositionId) {
      message.info('请选择职位');
      return;
    }
    if (!staffModalSupplierIds.length && !staffModalSupplierIdStart && !staffModalSupplierIdEnd) {
      message.info('请绑定供应商信息');
      return;
    }
    if (staffModalSupplierIdStart && staffModalSupplierIdEnd && staffModalSupplierIdStart >= staffModalSupplierIdEnd) {
      message.info('供应商ID区间有误');
      return;
    }
    if (!staffModalPcCateIds.length) {
      message.info('请绑定类目关系');
      return;
    }
    const data = {
      pcCateId: [...new Set(staffModalPcCateIds)],
      departmentId,
      supplierIdStart: staffModalSupplierIdStart,
      supplierIdEnd: staffModalSupplierIdEnd,
      nickName: staffModalNickName,
      positionId: staffModalPositionId,
      supplierId: [...new Set(staffModalSupplierIds)],
      extraRoleId: [...new Set(staffModalExtraRole)],
    };
    console.log(data, '保存的员工信息');
    let url = '';
    if (staffEditType === 1) {
      url = '/tms/access-server/v1/get/BackstageStaffAdd';
    } else {
      data.userId = staffModalUserId;
      url = '/tms/access-server/v1/get/BackstageStaffUpdate';
    }
    FetchPost({
      url,
      data,
    }).then(res => {
      if (res.isSuccess) {
        this.getStaffList();
        this.cancelStaff();
      }
    }).catch(() => {
      this.cancelStaff();
    });
  }
  // 新增输入框值设置
  staffModalChange(type, val) {
    if (type === 'staffModalPositionId') {
      this.setState({
        staffModalPositionId: val
      }, () => {
        this.getExtraRoleList();
      });
    } else {
      this.setState({
        [type]: val
      });
    }
  }
  // page/pageSize
  staffPaginationChange(type, val) {
    console.log(type, val, '分页内容');
    if (type === 'staffPageSize') {
      this.setState({
        staffPage: 1,
        staffPageSize: +val,
      }, () => {
        this.getStaffList();
      });
    } else {
      this.setState({
        staffPage: +val,
      }, () => {
        this.getStaffList();
      });
    }
  }
  // 导出员工列表
  exportStaffList() {
    const {
      staffUserId, staffExtraRole, staffNickName, staffSupplierId,
      staffPositionName, departmentId
    } = this.state;
    let url = '/tms/access-server/download/backstageRolePage?';
    if (departmentId) {
      url += `departmentId=${departmentId}`;
    }
    if (staffUserId) {
      url += `userId=${staffUserId}`;
    }
    if (staffExtraRole) {
      url += `extraRole=${staffExtraRole}`;
    }
    if (staffNickName) {
      url += `nickName=${staffNickName}`;
    }
    if (staffSupplierId) {
      url += `supplierId=${staffSupplierId}`;
    }
    if (staffPositionName) {
      url += `positionName=${staffPositionName}`;
    }
    window.open(url);
  }

  /**
   * 功能列表
   */
  // 获取功能列表
  getfuncList(unNeedPage) {
    const {
      funcPage, funcPageSize, funcRoleName, departmentId
    } = this.state;
    const params = {
      departmentId,
      roleName: funcRoleName,
    };
    if (!unNeedPage) {
      params.page = funcPage || 1;
      params.pageSize = funcPageSize;
    }
    FetchGet({
      url: '/tms/access-server/v1/roleQuery/departmentId',
      params,
    }).then(res => {
      console.log(res, 'res');
      this.setState({
        funcTotal: res.data.count,
        funcPage: res.data.page || 1,
        funcList: this.addKey(res.data.backstageRolePageDTOArrayList),
        loading: false,
      });
    }).catch(() => {
      this.setState({
        funcTotal: 0,
        funcPage: 1,
        funcList: [],
        loading: false,
      });
    });
  }
  // 分页功能
  funcPaginationChange(type, val) {
    if (type === 'funcPageSize') {
      this.setState({
        funcPageSize: +val,
        funcPage: 1,
      }, () => {
        this.getfuncList();
      });
    } else {
      this.setState({
        [type]: +val
      }, () => {
        this.getfuncList();
      });
    }
  }
  // ipt搜索
  funcIptChange(v) {
    this.setState({
      funcRoleName: v,
    });
  }
  // 根据功能名查看职位列表
  viewPositionList(r) {
    console.log(r.roleName, 'rolename');
    this.setState({
      tabsKey: '2',
      roleName: r.roleName,
    }, () => {
      this.getPositionList();
    });
  }
   // 根据附加功能名查看员工列表
   viewStaffList(r) {
    console.log(r.roleName, 'rolename');
    this.setState({
      tabsKey: '3',
      staffExtraRole: r.roleName, // 附加功能
    }, () => {
      this.getStaffList();
    });
  }
  render() {
    const {
      tabsKey, addOwnModal, addPositionModal, addStaffModal, departmentList, departmentId, departmentName,
      ownList, addOwnId, positionList, positionTotal, positionName, roleName, loading, userInfo,
      newRoleList, newPositionDesc, newPositionName, editPositionType, supplierList,
      staffUserId, staffExtraRole, staffNickName, staffSupplierId, staffPositionName, staffTotal, staffEditType,
      staffModalNickName, staffModalPositionId, staffModalSupplierIds, staffModalSupplierIdStart,
      staffModalSupplierIdEnd, staffModalPcCateIds, staffModalExtraRole, staffModalTel, staffModalUserId,
      staffModalUserName, staffModalUserType, staffList, extraRoleList,
      funcTotal, funcList, funcRoleName, cateList
    } = this.state;
    const ownListColumns = [{
      title: '管理员',
      dataIndex: 'userName',
      key: 'userName',
      width: 200,
    }, {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 200,
    }, {
      title: '手机号',
      dataIndex: 'tel',
      key: 'tel',
      width: 370,
    }];
    if (userInfo && userInfo.userType === 101) {
      ownListColumns.push(
        {
          title: '操作',
          dataIndex: 'key',
          key: 'key',
          width: 138,
          render: (key) => {
            return (
              <span className="blue" onClick={() => this.deleteOwn(key)}>删除</span>
            );
          }
        }
      );
    }
    return (
      <div className="app">
        <Title title="部门管理">
          <div className="say-hello">
            （达人店管理后台
            <span className="txt">
              {
                userInfo && userInfo.userType === 101
                ? '系统管理员'
                : userInfo && userInfo.userType === 102
                ? `${departmentName}管理员` : ''
              }
            </span>
            ，
            {getCurrentTimeText(userInfo && userInfo.serverTime)}
            好～）
          </div>
        </Title>
        <Spin spinning={loading}>
          <div className="department-wrap">
            {
              userInfo && userInfo.userType === 101
              ? (
                <div className="department-left" id="department">
                  <div className="department-list">
                    <div className="department-tit">部门列表</div>
                    {
                      departmentList.map(item => {
                        return (
                          <div className={`department-item ${departmentId === item.departmentId ? 'active' : ''}`}
                            key={item.departmentId}
                            onClick={() => this.departmentItemClick(item)}
                          >
                            {item.departmentName}
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              ) : ''
            }
            <div className="department-right">
              <Tabs
                activeKey={tabsKey}
                animated={{ inkBar: true, tabPane: false }}
                onChange={key => this.tabsChange(key)}
              >
                <TabPane tab="管理员" key="1" forceRender>
                  <div className="own-wrap">
                    {
                      userInfo && userInfo.userType === 101
                      ? (
                        <div className="own-btns">
                          <Button onClick={() => this.addOwn()}>新增管理员</Button>
                        </div>
                      ) : ''
                    }
                    <div className="table-wrap">
                      <Table
                        bordered
                        pagination={false}
                        dataSource={ownList}
                        columns={ownListColumns}
                      />
                    </div>
                  </div>
                </TabPane>
                <TabPane tab="职位列表" key="2" forceRender>
                  <div className="position-wrap">
                    <div className="search-area">
                      <div className="item-row">
                        <div className="search-item">
                          <span className="search-tit">职位名</span>
                          <Input placeholder="请输入职位名"
                            allowClear
                            className="search-ipt"
                            value={positionName}
                            onChange={e => this.positionIptChange('positionName', e.target.value)}
                            onPressEnter={() => this.getPositionList()}
                          />
                        </div>
                        <div className="search-item">
                          <span className="search-tit">默认功能</span>
                          <Input placeholder="请输入默认功能"
                            allowClear
                            className="search-ipt"
                            value={roleName}
                            onChange={e => this.positionIptChange('roleName', e.target.value)}
                            onPressEnter={() => this.getPositionList()}
                          />
                        </div>
                      </div>

                      <div className="item-row">
                        <div className="search-item">
                          <span className="search-tit"></span>
                          <Button type="primary" onClick={() => this.getPositionList()}>搜索</Button>
                        </div>
                      </div>

                    </div>
                    <div className="action-btn">
                      <Button onClick={() => this.addPosition()}>新增职位</Button>
                    </div>
                    <div className="table-area">
                      <Table
                        bordered
                        pagination={false}
                        dataSource={positionList}
                        columns={
                          [{
                            title: '职位名',
                            dataIndex: 'positionName',
                            key: 'positionName',
                            width: 140,
                            render: (t, r) => {
                              return (
                                <div className="position-name-wrap">
                                  <p className="name">{t}</p>
                                  <p className="desc">
                                    (
                                    {r.desc}
                                    )
                                  </p>
                                </div>
                              );
                            }
                          }, {
                            title: '默认功能',
                            dataIndex: 'backstageRoleDTOList',
                            key: 'backstageRoleDTOList',
                            width: 500,
                            render: (t) => {
                              return (
                                <div className="default-role-wrap">
                                  {
                                    t && t.map((item) => {
                                      return <span key={item.roleId} className="default-role-item">{item.defaultRole}</span>;
                                    })
                                  }
                                </div>
                              );
                            }
                          }, {
                            title: '员工列表',
                            dataIndex: 'positionId',
                            key: 'positionId',
                            width: 80,
                            render: (c, r) => {
                              return (
                                <span className="blue" onClick={() => this.viewPositionNameStaffList(r)}>查看</span>
                              );
                            }
                          }, {
                            title: '操作',
                            dataIndex: 'key',
                            key: 'key',
                            width: 80,
                            render: (key, r) => {
                              return (
                                <span className="blue" onClick={() => this.editPosition(r)}>编辑</span>
                                // <div className="flex">
                                //   <span className="blue" onClick={() => this.editPosition(r)}>编辑</span>
                                //   <span className="blue" onClick={() => this.deletePosition(r.positionId)}>删除</span>
                                // </div>
                              );
                            }
                          }]}
                      />
                      <div className="pagination-wrap">
                        <Pagination
                          total={positionTotal}
                          showSizeChanger
                          showQuickJumper
                          onChange={p => this.positionPaginationChange('positionPage', p)}
                          onShowSizeChange={(c, s) => this.positionPaginationChange('positionPageSize', s)}
                          pageSizeOptions={['10', '20', '40', '60']}
                        />
                      </div>
                    </div>
                  </div>
                </TabPane>
                <TabPane tab="员工列表" key="3" forceRender>
                  <div className="staff-wrap">
                    <div className="search-area">
                      <div className="item-row">
                        <div className="search-item">
                          <div className="tit">用户ID</div>
                          <Input placeholder="请输入用户ID"
                            allowClear
                            className="ipt"
                            value={staffUserId}
                            onChange={e => this.staffIptChange('staffUserId', e.target.value)}
                            onPressEnter={() => this.getStaffList()}
                          />
                        </div>
                        <div className="search-item">
                          <div className="tit">职位名</div>
                          <Input placeholder="请输入职位名"
                            allowClear
                            className="ipt"
                            value={staffPositionName}
                            onChange={e => this.staffIptChange('staffPositionName', e.target.value)}
                            onPressEnter={() => this.getStaffList()}
                          />
                        </div>
                      </div>
                      <div className="item-row">
                        <div className="search-item">
                          <div className="tit">昵称</div>
                          <Input placeholder="请输入用户昵称"
                            allowClear
                            className="ipt"
                            value={staffNickName}
                            onChange={e => this.staffIptChange('staffNickName', e.target.value)}
                            onPressEnter={() => this.getStaffList()}
                          />
                        </div>
                        <div className="search-item">
                          <div className="tit">附加功能</div>
                          <Input placeholder="请输入附加功能"
                            allowClear
                            className="ipt"
                            value={staffExtraRole}
                            onChange={e => this.staffIptChange('staffExtraRole', e.target.value)}
                            onPressEnter={() => this.getStaffList()}
                          />
                        </div>
                      </div>
                      <div className="item-row">
                        <div className="search-item">
                          <div className="tit">供应商权限</div>
                          <Select className="ipt"
                            placeholder="请选择供应商ID"
                            showArrow
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            onChange={v => this.staffIptChange('staffSupplierId', v)}
                            value={staffSupplierId || undefined}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                          >
                            {
                              supplierList
                              && supplierList.map(item => {
                                return (
                                  <Option key={item.supplierId}
                                    value={item.supplierId}
                                    title={item.supplierName}
                                  >
                                    {`[${item.supplierId}]${item.supplierName}`}
                                  </Option>
                                );
                              })
                            }
                          </Select>
                        </div>
                      </div>
                      <div className="item-row">
                        <div className="search-item">
                          <div className="tit"></div>
                          <Button type="primary"
                            className="search-btn"
                            onClick={() => this.getStaffList()}
                          >
                            搜索
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="staff-btns">
                      <Button className="add-staff" onClick={() => this.addStaff()}>新增员工</Button>
                      <Button icon="download" className="add-staff" onClick={() => this.exportStaffList()}>下载</Button>
                    </div>

                    <div className="staff-table-wrap">
                      <Table
                        bordered
                        pagination={false}
                        dataSource={staffList}
                        columns={
                          [{
                            title: '用户ID',
                            dataIndex: 'userId',
                            key: 'userId',
                            width: 70,
                          }, {
                            title: '用户名',
                            dataIndex: 'userName',
                            key: 'userName',
                            width: 90,
                          }, {
                            title: '昵称',
                            dataIndex: 'nickName',
                            key: 'nickName',
                            width: 70,
                          }, {
                            title: '类别',
                            dataIndex: 'userType',
                            key: 'userType',
                            width: 90,
                            render: (c) => {
                              return (
                                <div>{ getUserTypeText(c) }</div>
                              );
                            }
                          }, {
                            title: '职位',
                            dataIndex: 'positionName',
                            key: 'positionName',
                            width: 120,
                          }, {
                            title: '附加功能',
                            dataIndex: 'backstageRoleDTOList',
                            key: 'backstageRoleDTOList',
                            // width: 290,
                            render: (t) => {
                              const dom = (
                                <div>
                                  {
                                    t && t.map(item => {
                                      return <p key={`${item.roleId}${item.defaultRole}`} title={item.defaultRole}>{item.defaultRole}</p>;
                                    })
                                  }
                                </div>
                              );
                              return dom;
                            }
                          }, {
                            title: '操作',
                            dataIndex: 'key',
                            key: 'key',
                            width: 85,
                            render: (c, r) => {
                              return (
                                <div className="flex">
                                  <span className="blue" onClick={() => this.editStaff(r.userId)}>编辑</span>
                                  <span className="blue" onClick={() => this.deleteStaff(r)}>删除</span>
                                </div>
                              );
                            }
                          }]}
                      />
                      <div className="pagination-wrap">
                        <Pagination
                          total={staffTotal}
                          showSizeChanger
                          showQuickJumper
                          onChange={p => this.staffPaginationChange('staffPage', p)}
                          onShowSizeChange={(c, s) => this.staffPaginationChange('staffPageSize', s)}
                          pageSizeOptions={['10', '20', '40', '60']}
                        />
                      </div>
                    </div>
                  </div>
                </TabPane>
                <TabPane tab="功能列表" key="4" forceRender>
                  <div className="functions-wrap">
                    <div className="search-area">
                      <span>功能</span>
                      <Input className="ipt"
                        allowClear
                        placeholder="请输入功能名称"
                        value={funcRoleName}
                        onChange={e => this.funcIptChange(e.target.value)}
                        onPressEnter={() => this.getfuncList()}
                      />
                      <Button type="primary" className="btn" onClick={() => this.getfuncList()}>搜索</Button>
                    </div>
                    <div className="func-table-wrap">
                      <Table
                        bordered
                        pagination={false}
                        dataSource={funcList}
                        columns={[
                          {
                            title: '功能',
                            dataIndex: 'roleName',
                            key: 'roleName',
                            width: 168,
                          },
                          {
                            title: '功能说明',
                            dataIndex: 'roleDesc',
                            key: 'roleDesc',
                            width: 342,
                          },
                          {
                            title: '职位列表',
                            dataIndex: 'key',
                            key: 'key',
                            width: 146,
                            render: (c, r) => {
                              return (
                                <span className="blue" onClick={() => this.viewPositionList(r)}>查看</span>
                              );
                            }
                          },
                          {
                            title: '附加员工',
                            dataIndex: 'roleId',
                            key: 'roleId',
                            width: 150,
                            render: (c, r) => {
                              return (
                                <span className="blue" onClick={() => this.viewStaffList(r)}>查看</span>
                              );
                            }
                          },
                        ]}
                      />
                      <div className="pagination-wrap">
                        <Pagination
                          total={funcTotal}
                          showSizeChanger
                          showQuickJumper
                          onChange={p => this.funcPaginationChange('funcPage', p)}
                          onShowSizeChange={(c, s) => this.funcPaginationChange('funcPageSize', s)}
                          pageSizeOptions={['10', '20', '40', '60']}
                        />
                      </div>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </Spin>


        <Modal
          title="新增管理员"
          maskClosable={false}
          visible={addOwnModal}
          centered
          width={400}
          footer={null}
          onCancel={() => this.cancelOwn()}
        >
          <div className="add-own-wrap">
            <div className="add-own-select">
              <span className="tit">管理员昵称</span>
              <Select className="select"
                value={addOwnId || undefined}
                allowClear
                placeholder="请选择人员"
                onChange={v => this.addOwnIdChange(v)}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {
                  staffList.map(item => {
                    return (
                      <Option
                        key={item.userId}
                        value={item.userId}
                        disabled={item.userId === (userInfo && userInfo.userId)}
                      >
                        {item.userName}
                      </Option>);
                  })
                }
              </Select>
            </div>
            <div className="add-own-btns">
              <Button className="left" onClick={() => this.cancelOwn()}>取消</Button>
              <Button type="primary" disabled={!addOwnId} onClick={() => this.submitOwn()}>确定</Button>
            </div>
          </div>
        </Modal>

        <Modal
          title={editPositionType === 1 ? '新增职位' : '编辑职位'}
          maskClosable={false}
          visible={addPositionModal}
          centered
          width={840}
          footer={null}
          onCancel={() => this.canclePosition()}
        >
          <div className="add-position-wrap">
            <div className="add-position-tips">
              {
                editPositionType === 2 ? <Tips content="该职位下的员工默认拥有以下全部功能。" /> : ''
              }
            </div>

            <div className="position-name">
              <div className="name-item">
                <span className="txt">职位名</span>
                <Input className="ipt"
                  allowClear
                  placeholder="请输入职位名"
                  maxLength={10}
                  value={newPositionName}
                  onChange={e => this.positionIptChange('newPositionName', e.target.value)}
                />
              </div>
              <div className="name-item margin">
                <span className="txt">职位说明</span>
                <Input
                  className="ipt"
                  allowClear
                  placeholder="职位说明最多十个字"
                  maxLength={10}
                  value={newPositionDesc}
                  onChange={e => this.positionIptChange('newPositionDesc', e.target.value)}
                />
              </div>
              <div className="add-function-wrap">
                {
                  ((newRoleList && newRoleList[newRoleList.length - 1] && newRoleList[newRoleList.length - 1].roleId)
                  || (newRoleList && !newRoleList.length))
                  ? <Button className="add-function" onClick={() => this.positionAddRole()}>新增功能</Button> : ''
                }
              </div>
            </div>

            <div className="position-table">
              <Table
                bordered
                pagination={false}
                dataSource={newRoleList}
                columns={[
                  {
                    title: '默认功能',
                    dataIndex: 'roleId',
                    key: 'roleId',
                    render: (t, r) => {
                      return (
                        <Select
                          placeholder="请选择功能名"
                          showArrow
                          style={{ width: '100%' }}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={t || undefined}
                          onChange={v => this.selectRoleChange(r.key, v)}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                          {
                            funcList.map(item => {
                              return (
                                <Option
                                  key={item.roleId}
                                  value={item.roleId}
                                  disabled={newRoleList.find(ytem => ytem.roleId === item.roleId)}
                                >
                                  {item.roleName}
                                </Option>
                              );
                            })
                          }
                        </Select>
                      );
                    }
                  },
                  {
                    title: '功能说明',
                    dataIndex: 'roleDesc',
                    key: 'roleDesc',
                    width: 200,
                  },
                  {
                    title: '操作',
                    dataIndex: 'key',
                    key: 'key',
                    width: 100,
                    render: (k) => {
                      return <span className="blue" onClick={() => this.roleListRemove(k)}>移除</span>;
                    }
                  },
                ]}
              />
            </div>
            <div className="position-btns">
              <Button onClick={() => this.canclePosition()}>取消</Button>
              <Button type="primary"
                className="btn-right"
                disabled={!(newRoleList[newRoleList.length - 1]
                  && newRoleList[newRoleList.length - 1].roleId
                  && newPositionName
                  && newPositionDesc
                )}
                onClick={() => this.submitPosition()}
              >
                确定
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          title={staffEditType === 1 ? '新增员工' : '员工编辑'}
          maskClosable={false}
          visible={addStaffModal}
          centered
          width={460}
          footer={null}
          onCancel={() => this.cancelStaff()}
        >
          <div className="add-statff-wrap">
            <div className="add-staff-item">
              <div className="txt">部门</div>
              <div className="cont-txt">{departmentName}</div>
            </div>

            <div className="add-staff-item">
              <div className="txt">昵称</div>
              <Input className="ipt"
                placeholder="请输入昵称"
                value={staffModalNickName}
                disabled={staffEditType === 2}
                maxLength={10}
                onChange={e => this.staffModalChange('staffModalNickName', e.target.value)}
              />
            </div>

            {
              staffEditType === 2 ? (
                <div>
                  <div className="add-staff-item">
                    <div className="txt">用户ID</div>
                    <div className="cont-txt">{staffModalUserId}</div>
                  </div>
                  <div className="add-staff-item">
                    <div className="txt">用户名</div>
                    <div className="cont-txt">{staffModalUserName}</div>
                  </div>
                  <div className="add-staff-item">
                    <div className="txt">手机号码</div>
                    <div className="cont-txt">{staffModalTel}</div>
                  </div>
                  <div className="add-staff-item">
                    <div className="txt">类别</div>
                    <div className="cont-txt">{staffModalUserType}</div>
                  </div>
                </div>
              ) : ''
            }

            <div className="add-staff-item">
              <div className="txt">职位</div>
              <Select className="ipt"
                placeholder="请选择职位"
                showArrow
                showSearch
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={v => this.staffModalChange('staffModalPositionId', v)}
                value={staffModalPositionId || undefined}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {
                  positionList
                  && positionList.map(item => {
                    return <Option key={item.positionId} value={item.positionId}>{item.positionName}</Option>;
                  })
                }
              </Select>
            </div>
            {
              // 供应商不允许添加附加功能
              userInfo && userInfo.userType !== 104
              ? (
                <div className="add-staff-item">
                  <div className="txt">附加功能</div>
                  <Select className="ipt"
                    placeholder="请选择附加功能"
                    showArrow
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onChange={v => this.staffModalChange('staffModalExtraRole', v)}
                    value={staffModalExtraRole || undefined}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    mode="multiple"
                  >
                    {
                      extraRoleList
                      && extraRoleList.map(item => {
                        return <Option key={item.roleId} value={item.roleId}>{item.roleName}</Option>;
                      })
                    }
                  </Select>
                </div>
              ) : ''
            }

            <div className="add-staff-item">
              <div className="txt">供应商权限</div>
              <Select className="ipt"
                placeholder="请选择供应商"
                showArrow
                showSearch
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={v => this.staffModalChange('staffModalSupplierIds', v)}
                value={staffModalSupplierIds || undefined}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                mode="multiple"
              >
                {
                  supplierList
                  && supplierList.map(item => {
                    return (
                      <Option key={item.supplierId}
                        value={item.supplierId}
                        title={item.supplierName}
                      >
                        {`[${item.supplierId}]${item.supplierName}`}
                      </Option>
                    );
                  })
                }
              </Select>
            </div>
            <div className="add-staff-item">
              <div className="txt"></div>
              <div className="supplier-area">
                <InputNumber className="area-ipt"
                  placeholder="100"
                  min="1"
                  value={staffModalSupplierIdStart}
                  onChange={v => this.staffModalChange('staffModalSupplierIdStart', v)}
                />
                <span> - </span>
                <InputNumber className="area-ipt"
                  placeholder="200"
                  min="1"
                  value={staffModalSupplierIdEnd}
                  onChange={v => this.staffModalChange('staffModalSupplierIdEnd', v)}
                />
                <span>(区间)</span>
                <Tooltip title="供应商编号区间。如：100-200，包含首尾">
                  <Icon type="question-circle" theme="filled" className="area-icon" />
                </Tooltip>
              </div>
            </div>

            <div className="add-staff-item">
              <div className="txt">类目权限</div>
              <Select className="ipt"
                placeholder="请选择类目"
                showArrow
                showSearch
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={v => this.staffModalChange('staffModalPcCateIds', v)}
                value={staffModalPcCateIds || undefined}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                mode="multiple"
              >
                {
                  cateList
                  && cateList.map(item => {
                    return <Option key={item.id} value={item.id}>{item.name}</Option>;
                  })
                }
              </Select>
            </div>

            <div className="add-staff-btns">
              <Button onClick={() => this.cancelStaff()}>取消</Button>
              <Button type="primary" className="right" onClick={() => this.staffSubmit()}>确定</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Department;
