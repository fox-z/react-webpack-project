const getUserTypeText = type => {
  let txt = '';
  switch (type) {
    case 101:
      txt = '系统管理员';
      break;
    case 102:
      txt = '部门管理员';
      break;
    case 103:
      txt = '普通员工';
      break;
    case 104:
      txt = '供应商';
      break;
    default:
      txt = '普通员工';
      break;
  }
  return txt;
};

const getAccessTypeText = type => {
  let txt = '';
  if (type === 1) {
    txt = '菜单';
  } else if (type === 2) {
    txt = '页面';
  } else if (type === 3) {
    txt = '接口';
  }
  return txt;
};

const getCurrentTimeText = time => {
  // 凌晨0：00－6：00，早晨 6：00-8:00；上午 8：00-12：00，中午12：00-14：00,下午14：00-18：00，晚上18：00-21：00；深夜：21：00-24：00
  const hour = time ? new Date(time).getHours() : new Date().getHours();
  let txt = '';
  if (hour >= 0 && hour < 6) {
    txt = '凌晨';
  } else if (hour >= 6 && hour < 8) {
    txt = '早晨';
  } else if (hour >= 8 && hour < 12) {
    txt = '上午';
  } else if (hour >= 12 && hour < 14) {
    txt = '中午';
  } else if (hour >= 14 && hour < 18) {
    txt = '下午';
  } else if (hour >= 18 && hour < 21) {
    txt = '晚上';
  } else if (hour >= 21 && hour < 24) {
    txt = '深夜';
  }
  return txt;
};

// 获取订单状态id对应的订单状态text
const getOrderTypeText = type => {
  let txt = '';
  switch (type) {
    case 20:
      txt = '交易成功';
      break;
    case -2:
      txt = '交易取消';
      break;
    case 21:
      txt = '待支付';
      break;
    case 22:
      txt = '待发货';
      break;
    case 23:
      txt = '待收货';
      break;
    case 24:
      txt = '售后中';
      break;
    case 25:
      txt = '退货关闭';
      break;
    case 26:
      txt = '退货成功';
      break;
    default:
      txt = '';
      break;
  }
  return txt;
};

// 获取订单支付方式id对应的text
const getOrderPaidTypeText = type => {
  let txt = '';
  switch (type) {
    case 1:
      txt = 'pc阿里支付';
      break;
    case 2:
      txt = 'wap阿里支付';
      break;
    case 3:
      txt = '货到付款';
      break;
    case 4:
      txt = '假支付';
      break;
    case 5:
      txt = 'app阿里支付';
      break;
    case 9:
      txt = '微信支付';
      break;
    case 10:
      txt = 'wap微信支付';
      break;
    case 11:
      txt = 'app微信支付';
      break;
    case 12:
      txt = '余额支付';
      break;
    case 13:
      txt = 'wap余额支付';
      break;
    case 14:
      txt = 'APP余额支付';
      break;
    case 15:
      txt = 'APP美丽宝支付';
      break;
    case 16:
      txt = 'pc美丽宝支付';
      break;
    case 17:
      txt = 'wap美丽宝支付';
      break;
    case 18:
      txt = '米么分期';
      break;
    case 19:
      txt = '线下支付';
      break;
    case 20:
      txt = '可提现佣金支付';
      break;
    case 22:
      txt = '免支付';
      break;
    case 99:
      txt = '未选择';
      break;
    default:
      txt = '未选择';
      break;
  }
  return txt;
};

// 获取订单状态id对应的订单状态text
const getShopLvPositionText = type => {
  let txt = '';
  switch (type) {
    case -1:
      txt = '公益店';
      break;
    case 0:
      txt = '达人店长';
      break;
    case 1:
      txt = '客户代表';
      break;
    case 2:
      txt = '营销顾问';
      break;
    case 3:
      txt = '市场经理';
      break;
    default:
      txt = '';
      break;
  }
  return txt;
};

export {
  getUserTypeText,
  getAccessTypeText,
  getCurrentTimeText,
  getOrderTypeText,
  getShopLvPositionText,
  getOrderPaidTypeText
};
