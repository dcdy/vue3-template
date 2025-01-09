import axios, {
    type AxiosInstance,
    AxiosError,
    type AxiosResponse,
    type AxiosRequestConfig
} from 'axios';
import {
    successHandler,
    errorHandler,
    errorMsgHandler,
    showLoading,
    hideLoading
} from './msgHandler';

import qs from 'qs';

declare module 'axios' {
    export interface AxiosRequestConfig {
        isReturnNativeData?: boolean; // 返回原始数据
        successMode?: string; // 成功提示显示方式
        errorMode?: string; // 错误提示显示方式
        repeatRequest?: boolean; // 允许重复请求
        loading?: boolean | string; // 是否显示加载
        retry?: number; // 总共重试次数
        retryDelay?: number; // 重试间隔时间
        __retryCount?: number; // 当前第几次重试
    }
}

let pendingMap = new Map();

function getRequestKey(config: AxiosRequestConfig) {
    return (config.method || '') + config.url + '?' + qs.stringify(config?.data);
}

// 判断重复请求时取消前一个请求
function setPendingMap(config: AxiosRequestConfig) {
    const controller = new AbortController();
    config.signal = controller.signal;
    const key = getRequestKey(config);
    if (pendingMap.has(key)) {
        pendingMap.get(key).abort();
        pendingMap.delete(key);
    } else {
        pendingMap.set(key, controller);
    }
}
// 基础配置
const service: AxiosInstance = axios.create({
    timeout: 1000 * 10,
    baseURL: import.meta.env.VITE_BASE_URL
    // baseURL: 'http://192.168.3.56:8769',
    // baseURL: '/'
});
service.defaults.loading = 'body';
// 设置请求次数，请求的间隙
service.defaults.retry = 1;
service.defaults.retryDelay = 301;
//请求拦截器
service.interceptors.request.use(
    (config) => {
        //用户身份token
        if (localStorage.getItem('token')) {
            config.headers.token = localStorage.getItem('token');
        }

        const params = config.data?.params || config.params;
        console.log('请求拦截器', config, params);
        // 如果设置不可以重复请求
        if (!config?.repeatRequest && !params?.repeatRequest) {
            setPendingMap(config);
        }
        // 请求显示加载loading
        if (config?.loading && params?.loading !== false) {
            console.log('请求显示加载', config, typeof config?.data);
            showLoading(getRequestParam(config, params, 'loading'), config?.__retryCount || 0);
        }
        return config;
    },
    (error: AxiosError) => {
        console.log('请求时错误', error);

        return Promise.reject();
    }
);
//响应拦截器
service.interceptors.response.use((response: AxiosResponse) => {
    const config = response.config;
    console.log('🚀 ~ service.interceptors.response.use ~ config:', config);
    const key = getRequestKey(config);
    // const params = JSON.parse(config.data)?.params;
    const params = config.data?.params || config.params;
    pendingMap.delete(key);
    console.log('响应请求', response, params);

    // 如果请求返回的状态码为200，说明接口请求成功，可以正常拿到数据
    if (response.status === 200) {
        // 响应时隐藏加载
        if (config?.loading && params?.loading !== false) {
            console.log('响应时隐藏加载', params?.loading || config?.loading);

            hideLoading();
        }
        // 如果需要返回原始数据，直接返回
        if (getRequestParam(config, params, 'isReturnNativeData')) {
            return response.data;
        } else {
            // 如果不需要返回原始数据，则返回result中的数据
            const { code } = response.data;
            const msg = response.data.msg || response.data.error;
            if (code === 200) {
                console.log('请求成功', msg, config, params.successMode);

                successHandler(msg, getRequestParam(config, params, 'successMode') || 'null');
                return response.data;
            } else {
                // errorHandler(msg || errorMsgHandler(code), config.errorMode);
                return Promise.reject(response);
            }
        }
    }
});

// 错误处理
service.interceptors.response.use(undefined, async (e) => {
    let config = e.config;
    console.log('错误处理0', e);
    // const params =
    //     typeof config?.data == 'object' ? config?.data.params : JSON.parse(config?.data)?.params;
    const params = config.data?.params || config.params;

    console.log('错误处理1', e, params);

    // 响应时隐藏加载
    if (config?.loading && params?.loading !== false) {
        hideLoading();
    }

    if (params?.retry !== undefined) {
        config.retry = params?.retry;
    }
    let codeArr = [401, 402];
    // 如果配置不存在或未设置重试选项，则拒绝
    if (!config || !config.retry || codeArr.includes(e.data?.result?.code)) {
        errorMsgFun(e);
        return Promise.reject(e);
    } else {
        // 设置用于跟踪重试计数的变量
        config.__retryCount = config.__retryCount || 0;
        // 检查我们是否已经达到了重试的总次数
        if (config.__retryCount >= config.retry) {
            errorMsgFun(e);
            return Promise.reject(e);
        }
        // 增加重试次数
        config.__retryCount += 1;
        // 创建新的promise处理
        const backoff = new Promise<void>(function (resolve) {
            setTimeout(function () {
                resolve();
            }, config.retryDelay || 1);
        });
        // 返回撤回axios以重试请求的promise
        await backoff;
        return await service(config);
    }
});
// 错误提示显示方式
const errorMsgFun = (e: any) => {
    let config = e.config;
    console.log('错误处理0', e);
    // const params =
    //     typeof config?.data == 'object' ? config?.data.params : JSON.parse(config?.data)?.params;
    const params = config.data?.params || config.params;

    // 如果是取消请求的话，不做任何处理
    if (e?.code == 'ERR_CANCELED') {
        console.log('取消请求', e);
        return new Promise(() => {});
    }
    // 如果是正常请求成功但是接口返回的code不是200
    if (e?.status === 200) {
        console.log('正常请求', e, params.errorMode, config?.errorMode);

        errorHandler(
            e.data.result.msg || e.data.result.error,
            getRequestParam(config, params, 'errorMode')
        );
        return Promise.reject(e?.data);
    }
    // 其他错误
    const errMsg = errorMsgHandler(e?.status || e?.response?.status);

    errorHandler(errMsg, getRequestParam(config, params, 'errorMode'));

    return Promise.reject(e);
};
// 获取请求参数的函数
function getRequestParam(config: any, params: any, paramName: string): any {
    // 首先检查 params 对象是否存在对应的值
    if (params?.[paramName] !== undefined) {
        return params[paramName];
    }

    // 如果没有在 params 中找到，则检查 config 对象中是否存在
    if (config?.[paramName] !== undefined) {
        return config[paramName];
    }

    // 如果都没有传入该参数，返回 undefined
    return undefined;
}
export default service;
