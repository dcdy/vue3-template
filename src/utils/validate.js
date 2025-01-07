// 手机号校验
export function isPhone(value) {
    return /^1[3-9]\d{9}$/.test(value);
}
// 邮箱校验
export function isEmail(value) {
    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value);
}
// 身份证校验
export function isIdCard(value) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
}
// 身份证后6位校验
export function isIdCardLast6(value) {
    return /(^\d{6}$)|(^\d{5}(\d|X|x)$)/.test(value);
}
// 用户名校验
export function isUsername(value) {
    return /^[a-zA-Z0-9_-]{4,16}$/.test(value);
}
// 密码校验
export function isPassword(value) {
    return /^[a-zA-Z0-9_-]{6,18}$/.test(value);
}
// n位校验数字
export function isCode(value, n = 6) {
    // 使用模板字符串构建正则表达式
    const regex = new RegExp(`^[0-9]{${n}}$`);
    return regex.test(value);
}
// 非空校验
export function isNotEmpty(value) {
    return value.trim() !== '';
}
// 金额校验
export function isMoney(value) {
    return /^\d+(\.\d{1,2})?$/.test(value);
}
// 数字校验
export function isNumber(value) {
    return /^[0-9]*$/.test(value);
}
// 中文校验
export function isChinese(value) {
    return /^[\u4e00-\u9fa5]{0,}$/.test(value);
}
// 英文校验
export function isEnglish(value) {
    return /^[a-zA-Z]+$/.test(value);
}
// 银行卡号校验
export function isBankCard(value) {
    return /^([1-9]{1})(\d{15}|\d{18})$/.test(value);
}
// 日期校验
export function isDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
// 时间校验
export function isTime(value) {
    return /^\d{2}:\d{2}:\d{2}$/.test(value);
}
// 日期时间校验
export function isDateTime(value) {
    return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value);
}
// URL校验
export function isUrl(value) {
    return /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/.test(value);
}
// IP校验
export function isIp(value) {
    return /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[00-9]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/.test(
        value
    );
}
// 子网掩码校验
export function isSubnetMask(value) {
    return /^255\.(0|128|192|224|240|248|252|254|255)\.(0|128|192|224|240|248|252|254|255)\.(0|128|192|224|240|248|252|254|255)$/.test(
        value
    );
}
// 车牌号校验
export function isCarNumber(value) {
    return /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/.test(value);
}
// 车架号校验
export function isVin(value) {
    return /^[A-HJ-NPR-Z0-9]{17}$/.test(value);
}
// 发动机号校验
export function isEngineNumber(value) {
    return /^[A-Z0-9]{6,17}$/.test(value);
}
// 颜色校验
export function isColor(value) {
    return /^#[0-9a-fA-F]{6}$/.test(value);
}
// 邮政编码校验
export function isPostalCode(value) {
    return /^[1-9]\d{5}$/.test(value);
}
// QQ号校验
export function isQQ(value) {
    return /^[1-9][0-9]{4,10}$/.test(value);
}
// 微信号校验
export function isWechat(value) {
    return /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/.test(value);
}
