/**
 * 正则部分
 * ！！！只增不改
 */
export const TEL_REG = /^1[2345789]\d{9}$|^(\d{3,4}-?)?\d{7,8}(-\d{1,4})?$/; // 手机和座机
export const MOBILE_REG = /^1[23456789]\d{9}$/; // 11位手机号码
export const PASSWORD_REG = /^[0-9a-zA-Z]{6,30}$/; // 密码匹配
export const WORLD_REG = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/; // 中英文最少一位
export const EMAIL_REG = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,4}$/; // 邮箱检测
export const WORLD_TEN_REG = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1 , 10}$/; // 限制长度为 n 的中英文
export const WORLD_HTML_REG = /<(S*?)[^>]*>.*?|<.*? \/>/g; // textarea框检测html标签
export const POSITIVE_INT_REG = /^\d+$/; // 正整数最少一位
export const INT_SIX_REG = /^\d{4,6}$/; // 正整数4-6位
export const FLOAT_REG = /^\d+(\.\d+)?$/; // 整数或者小数
export const USRT_REG = /^\d{17}[\d|x]$|^\d{15}$/; // 身份证号
export const CAPTCHA_REG = /^[a-zA-Z0-9]{6}$/; // 数字字母6位
export const NUM_LET_REG = /^[a-zA-Z0-9]+$/; // 数字字母
export const PIN_REG = /^\d{6}$/; // 6位数字支付密码及验证码
