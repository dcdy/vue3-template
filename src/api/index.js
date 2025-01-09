//统一管理项目全部接口的文件
//获取真实服务器的接口的数据利用当前axios
import request from './request';

// get
// export function get(data) {
//     return request({
//         url: '',
//         method: 'get',
//         params: data
//     });
// }
// post
// export function post(data) {
//     return request({
//         url: '',
//         method: 'post',
//         data
//     });
// }
// 获取天气
export function getWeather(data) {
    return request({
        url: '/api/weather',
        method: 'get',
        params: data
    });
}
