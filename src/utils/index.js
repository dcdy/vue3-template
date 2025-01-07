/**
 * 防抖
 * @param {fun} fun
 * @param {number} delay
 * @returns
 */
export function debounce(fun, delay = 500) {
	// timer 是在闭包中的
	let timer = null;

	return function () {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			fun.apply(this, arguments);
			timer = null;
		}, delay);
	};
}
/**
 * 节流
 * @param {fun} fun
 * @param {number} delay
 * @returns
 */
export function throttle(fun, intervalTime) {
	var startTime, timer;
	return function () {
		if (!startTime) {
			startTime = new Date();
		}
		let currentTime = new Date();
		clearTimeout(timer);
		if (currentTime - startTime >= intervalTime) {
			fun.call(this, arguments);
			startTime = currentTime;
		} else {
			timer = setTimeout(throttle(fun, intervalTime), 50);
		}
	};
}

/**
 * 该函数返回给定回调函数的节流版本，只能在指定的延迟时间内调用一次。
 * @param delay -
 * delay参数是在回调函数可以再次执行之前需要等待的时间间隔，以毫秒为单位。此函数返回一个闭包，该闭包将回调函数作为参数，并且仅当自上次执行以来经过的时间大于或等于指定的延迟时才执行它。
 * @returns 正在返回一个高阶函数。返回的函数将回调函数作为参数，并根据传递给外部函数的延迟参数限制其执行。
 */
export function throttleFun(delay) {
	let time = null;
	return function (callback) {
		let currentTime = new Date().getTime();
		if (currentTime - time >= delay) {
			callback();
			time = new Date().getTime();
		}
	};
}

/**
 * 截取地址url中的值,返回一个对象
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
	url = url == null ? window.location.href : url;
	const search = url.substring(url.lastIndexOf('?') + 1);
	const obj = {};
	const reg = /([^?&=]+)=([^?&=]*)/g;
	search.replace(reg, (rs, $1, $2) => {
		const name = decodeURIComponent($1);
		let val = decodeURIComponent($2);
		val = String(val);
		obj[name] = val;
		return rs;
	});
	return obj;
}
/**
 * 格式化时间为特殊的日子，显示昨今明日
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option, isHiddenTimeDay) {
	if (!time) return '';

	if (('' + time).length === 10) {
		time = parseInt(time) * 1000;
	} else {
		time = +time;
	}
	const d = new Date(time);
	const now = new Date();

	// 得到指定时间的分秒，补0
	let dateHour = d.getHours().toString().padStart(2, '0');
	let dateMinutes = d.getMinutes().toString().padStart(2, '0');

	// const diff = (now - d) / 1000
	// if (diff < 30) {
	//   return '刚刚'
	// } else if (diff < 3600) {
	//   // less 1 hour
	//   return Math.ceil(diff / 60) + '分钟前'
	// } else if (diff < 3600 * 24) {
	//   return Math.ceil(diff / 3600) + '小时前'
	// } else if (diff < 3600 * 24 * 2) {
	//   return '1天前'
	// }

	// 如果时间与今天相差小于等于1天
	// 显示昨今明日 + 时分
	if (
		!isHiddenTimeDay &&
		d.getFullYear() == now.getFullYear() &&
		d.getMonth() + 1 == now.getMonth() + 1 &&
		Math.abs(d.getDate() - now.getDate()) <= 1
	) {
		let timeDay = '';
		if (d.getDate() == now.getDate()) {
			timeDay = '今';
		} else if (d.getDate() - now.getDate() == 1) {
			timeDay = '明';
		} else if (d.getDate() - now.getDate() == -1) {
			timeDay = '昨';
		}
		return timeDay + '日 ' + dateHour + ':' + dateMinutes;
	}

	// 如果时间与今天相差大于1天显示设定的格式
	// 如果设定了格式
	if (option) {
		return parseTime(time, option);
	} else {
		// 如果没设定格式
		return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分';
	}
}

/**
 * Parse the time to string
 * 格式化时间为指定格式
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
	if (arguments.length === 0 || !time) {
		return null;
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s} 星期{a}';
	let date;
	if (typeof time === 'object') {
		date = time;
	} else {
		if (typeof time === 'string') {
			if (/^[0-9]+$/.test(time)) {
				// support "1548221490638"
				time = parseInt(time);
			} else {
				// support safari
				// https://stackoverflow.com/questions/4310953/invalid-date-in-safari
				time = time.replace(new RegExp(/-/gm), '/');
			}
		}

		if (typeof time === 'number' && time.toString().length === 10) {
			time = time * 1000;
		}
		date = new Date(time);
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay(),
	};

	const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key];
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value];
		}
		return value.toString().padStart(2, '0');
	});

	return time_str;
}

//写入到Cookie
//name:cookie名称  value:cookie值，Days天数，不写默认30天
export function setCookie(name, value, days) {
	// var Days = 2;
	if (!days) days = 30;

	// 因为toUTCString()会少8小时，所以用下面方法Days*24*60*60*1000
	const exp = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000);
	// 存储的同时存储对应的过期时间，不知道为啥到了
	document.cookie = name + '=' + escape(value) + ';expires=' + exp;
	document.cookie =
		name + 'Expires' + '=' + escape(new Date().getTime() + days * 24 * 60 * 60 * 1000) + ';expires=' + exp;

	// document.cookie = name + "=" + escape(value) + ";expires=" + (exp.toUTCString() + (+0800));
}
// 如果清除cookie
// 将指定cookie的值设为空，时间设为-1(注：如果没清空就是时间爱按太少-1改为-24*60*60)
// 例setCookie('cookie', '', -1)
export function clearCookie(name) {
	setCookie(name, '', -1);
	setCookie(name + 'Expires', '', -1);
}

// 获取指定cookie的key和value
export function getCookie(name) {
	var endstr = document.cookie.indexOf(';', name);
	console.log('endstr', endstr);
	if (endstr == -1) endstr = document.cookie.length;
	return unescape(document.cookie.substring(name, endstr));
}
// 只获取指定cookie的value
export function getCookieVal(name) {
	var arg = name + '=';
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	while (i < clen) {
		var j = i + alen;
		// 如果cookie内有值就调用上面的getCookie方法获取value
		if (document.cookie.substring(i, j) == arg) {
			return getCookie(j);
		}
		i = document.cookie.indexOf(' ', i) + 1;
		if (i == 0) break;
	}
	return null;
}
// 判断cookie是否过期
export function isExpiresFun(name) {
	if (Number(getCookieVal(name + 'Expires')) > new Date().getTime()) {
		return false;
	} else {
		// 如果cookie已经过期就清除
		setCookie(name, '', -1);
		setCookie(name + 'Expires', '', -1);
		return true;
	}
}

// 获取网速函数（根据图片加载速度）最多等5秒超出就返回
export function getSpeedWithImg(imgUrl, fileSize, time) {
	return new Promise((resolve, reject) => {
		let start = null;
		let end = null;
		let fiveSeconds = null;
		let img = document.createElement('img');
		if (!time) time = 5000;
		start = new Date().getTime();

		// 后面加'?t=' + (+new Date());可以防止图片缓存
		img.src = imgUrl + '?t=' + +new Date();
		// 最多只等5秒，超出5秒就直接返回网速过慢结果
		setTimeout(() => {
			fiveSeconds = new Date().getTime();
			console.log('fiveSeconds', fiveSeconds, fiveSeconds - start);
			if (!end) {
				resolve({ speed: '您的网速过慢，小于1' });
			}
		}, time);
		// 获取图片加载速度和时间
		img.onload = function (e) {
			end = new Date().getTime();
			let time = end - start;
			const speed = ((fileSize * 1000) / (end - start)).toFixed(2);
			let obj = {
				speed: speed,
				time: time,
			};
			console.log(obj);
			resolve(obj);
		};
	}).catch(err => {
		console.log('err', err);
		throw err;
	});
}

// URL转为Blob下载base64图片
export function dataURLtoBlob(dataurl) {
	var arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}
// 下载文件
export function downloadFile(url, name) {
	var a = document.createElement('a');
	a.setAttribute('href', url);
	a.setAttribute('download', name);
	a.setAttribute('target', '_blank');
	let clickEvent = document.createEvent('MouseEvents');
	clickEvent.initEvent('click', true, true);
	a.dispatchEvent(clickEvent);
}
// 下载base64图片
export function downloadFileByBase64(base64, name) {
	var myBlob = dataURLtoBlob(base64);
	var myUrl = URL.createObjectURL(myBlob);
	downloadFile(myUrl, name);
}
// 下载base64图片,需要带前缀'data:image/png;base64,'
export function Base64ToUrl(base64) {
	var myBlob = dataURLtoBlob(base64);
	var myUrl = URL.createObjectURL(myBlob);
	return myUrl;
}
/**
 * 原生文件上传(暂时不写了)
 * @param {Object} filesObj 文件对象
 * @param {Number} minFileNum 最少文件数
 * @param {Number} maxFileNum 最多文件数
 * @param {Array} confirmTypeArr 限制文件类型
 * @param {Number} confirmSize 限制文件大小
 * @param {String} countOverMsg 文件超出个数提示语
 * @param {Boolean} isErrorReturn 是否遇到不符合的文件就直接返回false
 * @returns {Array} fileList
 */
export function fileCountCheck(
	filesObj,
	minFileNum,
	maxFileNum,
	confirmTypeArr,
	confirmSize,
	countOverMsg,
	isErrorReturn = true
) {
	console.log('上传文件对象', filesObj.files, minFileNum, maxFileNum, confirmTypeArr, confirmSize, countOverMsg); // 文件对象
	let fileList = Array.from(filesObj.files);
	if (window.File && window.FileList) {
		var fileCount = fileList.length;

		// 如果数量超出了
		if (fileCount < minFileNum || fileCount > maxFileNum) {
			// 不符合数量的处理
			if (countOverMsg) {
				this.$message.warning(countOverMsg);
			} else {
				this.$message.warning(`最多选择${maxFileNum}张图片`);
			}
			// 选择完后清空value值，不然不触发change事件
			// document.getElementById("chatUploadImages").value = "";
			return false;
		}

		// 类型不符合要求
		let isConfirmType = true;
		// 大小不符合要求
		let isConfirmSize = true;
		// 筛选出fileList中confirmTypeArr && confirmTypeArr.findIndex(e => e === item.type) !== -1和item.size / 1024 / 1024) <= confirmSize的数据
		const filteredList = fileList.filter(item => {
			let isTypeMatch = true;
			if (confirmTypeArr) {
				if (confirmTypeArr.findIndex(e => e === item.type) !== -1) {
					isTypeMatch = confirmTypeArr.findIndex(e => e === item.type) !== -1;
				} else {
					isConfirmType = false;
					isTypeMatch = false;
				}
			}
			let isSizeMatch = item.size / 1024 / 1024 <= confirmSize ? true : (isConfirmSize = false);
			console.log('fileList筛选前的数据：', item, isTypeMatch, isSizeMatch);
			return isTypeMatch && isSizeMatch;
		});

		console.log('fileList筛选后的数据：', filteredList);

		if (!isConfirmType) {
			this.$message.warning('上传文件只能是常见图片格式!');
			// 选择完后清空value值，不然不触发change事件
			// document.getElementById("chatUploadImages").value = "";
			if (isErrorReturn) {
				return false;
			}
		}
		if (!isConfirmSize) {
			if (confirmSize < 1024) {
				this.$message.warning(`上传文件大小不能超过${confirmSize}M!`);
			} else {
				this.$message.warning(`上传文件大小不能超过${confirmSize / 1024}G!`);
			}
			// 选择完后清空value值，不然不触发change事件
			// document.getElementById("chatUploadImages").value = "";
			if (isErrorReturn) {
				return false;
			}
		}
		return filteredList;
	} else {
		// 不支持FileAPI
		this.$message.error('抱歉，你的浏览器不支持FileAPI，请升级浏览器！');
		return false;
	}
}

/**
 * 页面缩放
 * @param {number} w
 * @param {number} h
 * @param {string} dom
 * @returns
 */
export function domScale(w = 1280, h = 720, dom = '.wrap', aroundH) {
	let scale =
		document.documentElement.clientWidth / document.documentElement.clientHeight < w / h
			? document.documentElement.clientWidth / w
			: document.documentElement.clientHeight / h;
	scale = scale == 1 ? 1 : Number(scale) + 0.0026;
	let domEle = document.querySelector(dom);
	console.log(
		'页面缩放',
		document.documentElement.clientWidth,
		document.documentElement.clientHeight,
		w,
		h,
		scale,
		domEle
	);
	if (domEle) {
		if (aroundH) {
			let translateY = (aroundH + parseInt(window.getComputedStyle(domEle).marginTop)) / scale;
			// scale = document.documentElement.clientWidth/document.documentElement.clientHeight < (w+translateY*2)/h ?
			//         (document.documentElement.clientWidth / (w+translateY*2)):
			//         (document.documentElement.clientHeight / h);
			// scale = scale == 1 ? 1 : Number(scale) + 0.0026;
			console.log(
				'😱 ~ domScale ~ translateY:',
				scale,
				aroundH,
				window.getComputedStyle(domEle).marginTop,
				translateY
			);
			domEle.style.transform = `scale(${scale}) translate(-50%, calc(-50% - ${translateY}px))`;
		} else {
			domEle.style.transform = `scale(${scale}) translate(-100%,-100%)`;
		}
		console.log('scalescalescale', scale, dom, document.documentElement.clientWidth, document.body.scrollWidth);
	}
	document.documentElement.style.setProperty('--app-scale', scale);
	return scale;
}

/**
 * 获取当前环境
 * @returns
 */
export function processEnv() {
	console.log('processEnv', process.env.NODE_ENV);
	if (process.env.NODE_ENV === 'development') return 'development'; //开发环境
	// if (window.location.href.includes('192.168')) return 'test';        //测试环境，"192.168"根据实际情况而定
	return 'production'; //线上环境
}

/**
 * 判断系统
 * 谷歌浏览器：mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36 (khtml, like gecko) chrome/111.0.0.0 safari/537.36
 * Electron：mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36 (khtml, like gecko) zhijiao/0.1.4 chrome/91.0.4472.69 electron/13.0.0 safari/537.36
 * // pc端输出结果：Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36
 * 移动端输出结果：Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1
 * @returns
 */
export function getCurrentSystem() {
	let version = navigator.userAgent.toLowerCase();
	// console.log("versionversion",version);
	if (!!version.match(/compatible/i) || version.match(/Windows/i)) {
		return 'windows';
	} else if (!!version.match(/Macintosh/i) || version.match(/MacIntel/i)) {
		return 'mac';
	} else if (!!version.match(/iphone/i) || version.match(/Ipad/i)) {
		return 'ios';
	} else if (!!version.match(/android/i)) {
		return 'android';
	} else {
		return 'other';
	}
}
/**
 * 获取地址url
 * @param {str} sParam 地址url
 * @returns
 */
export function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
}

/**
 * 获取mac屏幕流虚拟音频，判断是否授权并安装了插件
 * @returns CAMERA_PERMISSION_NOT_GRANTED || AUDIO_PERMISSION_NOT_GRANTED || SCREEN_PERMISSION_NOT_GRANTED || ALLOWED || NOT_INSTALL_BLACKHOLE
 */
export async function getAudioRecordPermission(isScreen) {
	if ((await getMacAudioRecordPermission('camera')) !== 'granted') {
		if (!(await requestMacAudioRecordPermission('camera'))) {
			return 'CAMERA_PERMISSION_NOT_GRANTED'; // 没授权
		}
	}
	if ((await getMacAudioRecordPermission('microphone')) !== 'granted') {
		if (!(await requestMacAudioRecordPermission('microphone'))) {
			return 'AUDIO_PERMISSION_NOT_GRANTED'; // 没授权
		}
	}
	if (isScreen) {
		console.log('getMacAudioRecordPermission', await getMacAudioRecordPermission('screen'));
		// if (await getMacAudioRecordPermission("screen") !== 'granted') {
		return 'SCREEN_PERMISSION_NOT_GRANTED'; // 没授权
		// }
		// if (!await getIfAlreadyInstallSoundFlowerOrBlackHole()) {
		//     return 'NOT_INSTALL_BLACKHOLE'; // 没安装插件
		// }
	}
	return 'ALLOWED'; // 允许
}
// 检查用户电脑是否有安装SoundFlower或者BlackHole
export async function getIfAlreadyInstallSoundFlowerOrBlackHole() {
	const devices = await navigator.mediaDevices.enumerateDevices();
	console.log(
		'sound检查用户电脑是否有安装SoundFlower或者BlackHole',
		devices,
		devices.some(
			device => device.label.includes('BlackHole 2ch (Virtual)') || device.label.includes('Soundflower (2ch)')
		)
	);
	return devices.some(
		device => device.label.includes('BlackHole 2ch (Virtual)') || device.label.includes('Soundflower (2ch)')
	);
}
// 获取是否有麦克风权限（blackhole的实现方式是将屏幕音频模拟为麦克风）
// 'not-determined' | 'granted' | 'denied' | 'restricted' | 'unknown'
// "未确定”|“授予”|“拒绝”|“受限”|“未知”
// mediaType string - 可以是 microphone, camera 或 screen.
async function getMacAudioRecordPermission(mediaType) {
	console.log('获取权限', mediaType, await window.electronAPI.setCheckMicrophone(mediaType));
	return await window.electronAPI.setCheckMicrophone(mediaType);
}
// 请求麦克风权限（blackhole的实现方式是将屏幕音频模拟为麦克风）
// mediaType string - 请求的媒体类型，可以是microphone 和 camera。
async function requestMacAudioRecordPermission(mediaType) {
	console.log('请求麦克风权限', mediaType, await window.electronAPI.askCheckMicrophone(mediaType));
	return await window.electronAPI.askCheckMicrophone(mediaType);
}

/**
 * 字符串首字母大写
 * @param {string} str 要首字母大写的字符串
 * @return {string}
 */
export function capitalizeFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 深拷贝
 * @param {object} origin 要拷贝的数组或对象
 * @param {boolean} deep 是否深拷贝
 * @return {boolean}
 */
export function deepCopy(origin, deep = true) {
	// deep true  启动深拷贝
	// false  浅拷贝
	let obj = {};
	// 数组对象
	if (origin instanceof Array) {
		// true 数组  obj 就得是数组
		obj = [];
	}
	for (let key in origin) {
		let value = origin[key];
		// 确定value是不是引用型，前提是deep 是true
		obj[key] = !!deep && typeof value === 'object' && value !== null ? extend(value, deep) : value;
	}
	return obj;
}

/**
 * 分钟数字转为时间（保留两个小数）
 * @param {number}
 * @return {number}
 */
export function minuteChangeHour(time) {
	let newTime = null;
	// 写一个根据传入的time分钟数转换为小时数保留两位小数的函数,小数有0的去掉

	if (time) {
		newTime = (time / 60).toFixed(2).replace(/\.?0+$/, '');
	}
	return newTime;
}

/**
 * 截取流id的信息，默认截取uid，根据_截取第一个_后的uid
 * @param {string} id_str
 * @return {string,number}
 */
export function splitUid(id_str, i = 1) {
	let res = id_str.toString().split('_')[i];
	return res;
}
/**
 * 判断两个流id是否是一个人
 * @param {string} origin_id
 * @param {string} new_id
 * @return {boolean}
 */
export function compareStreamId(origin_id, new_id) {
	// 如果new_id是完全流id名字，接截取uid来判断
	if (!origin_id || !new_id) return false;
	if (splitUid(new_id)) {
		if (splitUid(origin_id) == splitUid(new_id)) {
			return true;
		} else {
			return false;
		}
	} else {
		if (splitUid(origin_id) == new_id) {
			return true;
		} else {
			return false;
		}
	}
}

/**校验传入的iconClass是否为外部链接
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
	return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * 将以秒为单位的持续时间格式化为指定的格式。
 * @param {number} seconds - 以秒为单位的持续时间。
 * @param {string} format - 指定持续时间格式的格式字符串。
 * @returns {string} 格式化后的持续时间。
 */
export function formatDuration(seconds, format) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	// 定义替换规则
	const replacements = {
		'{h}': hours,
		'{i}': minutes,
		'{s}': secs,
	};

	// 拆分格式字符串并处理每个部分
	let formatted = format.replace(/\{[h|i|s]\}[^{}]*/g, match => {
		const key = match.match(/\{[h|i|s]\}/)[0];
		return replacements[key] ? match.replace(key, replacements[key]) : '';
	});

	// 移除首尾的多余分隔符
	formatted = formatted.replace(/^[\s:]+|[\s:]+$/g, '');

	// 如果结果为空，返回0或0秒
	if (formatted === '') {
		return format.includes('{s}') ? '0秒' : '0';
	}

	return formatted;
}
