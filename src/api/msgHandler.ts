import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import { debounce } from 'es-toolkit';
// import router from '@renderer/src/router';
// import { getToken } from '@renderer/src/api/index.js';
// 根据mode，返回成功信息
const successHandler = (errMsg: string, mode: string = 'null') => {
    const msg = errMsg || '操作成功';

    if (mode === 'msg') {
        console.log('消息个数', document.getElementsByClassName('el-message').length);

        // if (document.getElementsByClassName('el-message').length <= 1) {
        ElMessage({
            type: 'success',
            message: msg,
            grouping: true,
            repeatNum: 1
        });
        // }
    }
    if (mode === 'msgbox') {
        ElMessageBox.alert(msg, '提示', {
            confirmButtonText: '确定', // 确定按钮的文本内容
            type: 'success', // 图标类型，可选值为 success/error/info/warning/question
            showClose: false // 是否显示右上角关闭按钮
        });
    }
    if (mode === 'hidden') {
    }
};
// if (document.getElementsByClassName('el-message').length <= 1) {
//     console.log('requesrErr' + error) // for debug
//     Message({
//         message: error.error || error.msg || i18n.t('user.getDataError'),
//         type: 'error',
//         duration: 3 * 1000
//     })
// }
// 根据mode，返回错误信息
const errorHandler = (errMsg: string, mode: string = 'msg') => {
    console.log('错误信息', errMsg, mode);

    const msg = errMsg || '操作失败，可能网络不好';

    if (mode === 'msg') {
        ElMessage({
            type: 'error',
            message: msg,
            grouping: true,
            repeatNum: 1
        });
    }
    if (mode === 'msgbox') {
        ElMessageBox.alert(msg, '提示', {
            confirmButtonText: '确定', // 确定按钮的文本内容
            type: 'error', // 图标类型，可选值为 success/error/info/warning/question
            showClose: false // 是否显示右上角关闭按钮
        });
    }
    if (mode === 'hidden') {
    }
};
// 根据错误代码，获取对应文字
const errorMsgHandler = (errStatus: number): string => {
    if (errStatus == 500) return '操作失败';
    if (errStatus == 400) return '没有权限';
    if (errStatus == 404) return '接口错误';
    return '操作失败';
};

// 判断是否显示loading
let loading: any;
//当前正在请求的数量
let needLoadingRequestCount = 0;
//显示loading
const showLoading = (target: string = 'body', retry: number) => {
    // 后面这个判断很重要，因为关闭时加了抖动，此时loading对象可能还存在，
    // 但needLoadingRequestCount已经变成0.避免这种情况下会重新创建个loading
    if (needLoadingRequestCount === 0 && !loading) {
        loading = ElLoading.service({
            lock: true,
            text: retry == 0 ? '加载中，请稍后' : '第' + retry + '次重新加载中，请稍后',
            background: 'rgba(255, 255, 255, 0.5)',
            target: target || 'body'
        });
        console.log('加兹安示例', needLoadingRequestCount, target, loading);
    }
    needLoadingRequestCount++;
    // console.log('加兹安示例', needLoadingRequestCount, target);
};
//隐藏loading
const hideLoading = () => {
    needLoadingRequestCount--;
    needLoadingRequestCount = Math.max(needLoadingRequestCount, 0); //做个保护
    if (needLoadingRequestCount === 0) {
        //关闭loading
        toHideLoading();
    }
    // console.log('加兹安示例2', needLoadingRequestCount);
};
//防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
var toHideLoading = debounce(() => {
    // ElLoading.service({}).close();
    if (loading) {
        loading.close();
        loading = null;
        console.log('结束loading');
    }
}, 300);

export { successHandler, errorHandler, errorMsgHandler, showLoading, hideLoading };
