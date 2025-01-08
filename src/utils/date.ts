// 引入day.js
import dayjs from 'dayjs';

/**
 * TAG格式化日期时间
 *
 * @param {string|number|Date} time - 要格式化的时间，可以是时间戳、Date 对象或者日期字符串。
 * @param {string} [format='YYYY-MM-DD HH:mm:ss'] - 日期格式字符串，参考 dayjs 格式化规则，默认值为 `'YYYY-MM-DD HH:mm:ss'`。
 * @returns {string} 返回格式化后的日期时间字符串。
 *
 * @example
 * import { dateFormat } from '@/utils/date';
 * dateFormat('2022-01-01 12:34:56', 'YYYY-MM-DD HH:mm:ss'); // 返回'2022-01-01 12:34:56'
 * dateFormat(1536351763308, 'YYYY-MM-DD'); // 返回'2018-09-08'
 * dateFormat(new Date()); // 返回'2025-01-08 23:49:22'
 * dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss dddd A'); // 返回'2025-01-08 23:49:22 星期三 晚上'
 * 实时获取当前时间：const dayNow = computed(() => dateFormat(now.value, 'YYYY年M月D日 dddd HH:mm:ss'));
 */
export function dateFormat(
    time: string | number | Date,
    format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
    let lang = localStorage.getItem('lang') || 'zh-cn';
    dayjs.locale(lang);
    return dayjs(time).format(format);
}

/**
 * TAG将传入的分钟数转换为小时数，并保留指定的小数位数。
 * 如果转换后的小时数有多余的零，则会被去掉。
 *
 * @param {number} time - 要转换的时间，单位为分钟。
 * @param {number} [num=2] - 保留的小数位数，默认为2位。
 * @returns {string|0} 返回转换后的小时数，若传入的时间无效则返回0。
 *
 * @example
 * import { minuteChangeHour } from '@/utils/date';
 * minuteChangeHour(0); // 返回 '0'
 * minuteChangeHour(60); // 返回 '1'
 * minuteChangeHour(100); // 返回 '1.67'
 */
export function minuteChangeHour(time: number, num: number = 2): number {
    let newTime = 0;
    if (time) {
        newTime = Number((time / 60).toFixed(num).replace(/\.?0+$/, ''));
    }
    return newTime;
}

/**
 * TAG将以秒为单位的持续时间格式化为指定的格式。
 * @param {number} seconds - 以秒为单位的持续时间。
 * @param {string} [format='{h}时{i}分{s}秒'] - 指定持续时间格式的格式字符串，默认为'{h}时{i}分{s}秒'。
 * @returns {string} 格式化后的持续时间。
 *
 * @example
 * import { formatDuration } from '@/utils/date';
 * formatDuration(100); // 返回 '1分40秒'
 * formatDuration(7777, '{h}时{i}分{s}秒'); // 返回 '2时9分37秒'
 * formatDuration(7777,'{h}:{i}:{s}'); // 返回 '2:9:37'
 */
export function formatDuration(seconds: number, format: string = '{h}时{i}分{s}秒'): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.round(seconds % 60);

    // 定义替换规则，确保类型正确
    const replacements: { [key: string]: number } = {
        '{h}': hours,
        '{i}': minutes,
        '{s}': secs
    };

    // 拆分格式字符串并处理每个部分
    let formatted = format.replace(/\{[h|i|s]\}[^{}]*/g, (match) => {
        const key = match.match(/\{[h|i|s]\}/)?.[0] || ''; // 使用类型安全的 optional chaining
        return replacements[key] ? match.replace(key, replacements[key].toString()) : '';
    });

    // 移除首尾的多余分隔符
    formatted = formatted.replace(/^[\s:]+|[\s:]+$/g, '');

    // 如果结果为空，返回 '0秒' 或默认的 '0'
    if (formatted === '') {
        return format.includes('{s}') ? '0秒' : '0';
    }

    return formatted;
}
