// 引入day.js
import dayjs from 'dayjs';

// 格式化时间
export function dateFormat(time, format) {
	return dayjs(time).locale('zh-cn').format(format);
}
