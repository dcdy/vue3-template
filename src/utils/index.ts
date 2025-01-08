/**
 * TAG防抖
 * @param {Function} fun - 要防抖的函数
 * @param {number} [delay=500] - 防抖延迟时间，默认为 500 毫秒
 * @returns {Function} - 返回一个防抖函数
 *
 * @example
 * const debouncedLog = debounce(() => {
 *   console.log('debounce');
 * }, 300);
 */
export function debounce<T extends (...args: any[]) => any>(
    fun: T,
    delay: number = 500
): (...args: Parameters<T>) => void {
    let timeout: any = null; // 使用 NodeJS.Timeout 类型（如果你在 Node.js 环境中）---这里使用any会更方便
    return function (this: any, ...args: Parameters<T>) {
        clearTimeout(timeout!); // 使用非空断言操作符（!）因为已经初始化了 timeout
        timeout = setTimeout(() => {
            fun.apply(this, args);
        }, delay);
    };
}

/**
 * TAG节流
 * @param {Function} fun - 要节流的函数
 * @param {number} [delay=500] - 节流间隔时间，默认为 500 毫秒
 * @returns {Function} - 返回一个节流函数
 *
 * @example
 * const throttleLog = throttle(() => {
 *   console.log('throttle');
 * }, 500);
 */
export function throttle<T extends (...args: any[]) => any>(
    fun: T,
    delay: number
): (...args: Parameters<T>) => void {
    let canRun = true;
    return function (this: any, ...args: Parameters<T>): void {
        if (canRun) {
            fun.apply(this, args);
            canRun = false;
            setTimeout(() => {
                canRun = true;
            }, delay);
        }
    };
}

/**
 * TAG防抖 Promise
 * @param {Function} fn - 要防抖的异步函数
 * @param {number} delay - 防抖延迟时间，默认为 500 毫秒
 * @returns {Function} - 返回一个新的防抖函数
 *
 * @example
 * const fetchData = async () => {
 *   const response = await fetch('/api/data');
 *   console.log(await response.json());
 * };
 * const debouncedFetchData = debouncePromise(fetchData, 500);
 * debouncedFetchData();
 */
export function debouncePromise(
    fn: (...args: any[]) => Promise<any>,
    delay: number = 500
): (...args: any[]) => Promise<any> {
    let pendingPromise: ReturnType<typeof setTimeout> | null = null;

    return function (...args: any[]) {
        if (pendingPromise) {
            clearTimeout(pendingPromise);
        }

        return new Promise<any>((resolve, reject) => {
            pendingPromise = setTimeout(() => {
                fn(...args)
                    .then(resolve)
                    .catch(reject);
            }, delay);
        });
    };
}

/**
 * TAG返回节流版本的回调函数。每隔多少秒就调用一次该函数
 * @param {number} [delay=3000] - 节流间隔时间，单位毫秒，默认为 3000 毫秒
 * @returns {Function} - 返回一个高阶函数，接受回调函数作为参数
 *
 * @example
 * const throttledCallback = throttleFun(1000);
 * throttledCallback(() => console.log('这将每秒调用一次。'));
 */
export function throttleFun(delay: number): (callback: () => void) => void {
    let time: number | null = null;
    return function (callback: () => void) {
        const currentTime = Date.now();
        if (time === null || currentTime - time >= delay) {
            callback();
            time = currentTime;
        }
    };
}

/**
 * TAG截取地址url中的值,返回一个对象
 * @param {string} url - URL 字符串
 * @returns {Record<string, string>} - 返回一个对象，其中包含 URL 中的查询参数
 *
 * @example
 * const queryParams = getQueryObject('https://example.com?page=2&sort=desc');
 * console.log(queryParams); // { page: '2', sort: 'desc' }
 */
export function getQueryObject(url: string | null = null): Record<string, string> {
    url = url || window.location.href;
    const search = url.substring(url.lastIndexOf('?') + 1);
    const obj: Record<string, string> = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1);
        let val = decodeURIComponent($2);
        obj[name] = val;
        return rs;
    });
    return obj;
}

/**
 * TAG获取 URL 中指定的查询参数值。
 *
 * @param {string} sParam - 要获取的参数名。
 *
 * @returns {string | null} - 返回指定参数的值，如果没有该参数则返回 `null`。
 *
 * @example
 * const param = getUrlParameter('id');
 * console.log(param); // 如果 URL 中存在 `?id=123`，则返回 '123'，否则返回 null
 */
export function getUrlParameter(sParam: string): string | null {
    const sPageURL = decodeURIComponent(window.location.search.substring(1));
    const sURLVariables = sPageURL.split('&');

    for (let i = 0; i < sURLVariables.length; i++) {
        const sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? null : sParameterName[1];
        }
    }

    return null;
}

/**
 * TAG写入到 Cookie
 * @param {string} name - Cookie 名称
 * @param {string} value - Cookie 值
 * @param {number} [days=30] - Cookie 的过期天数，默认 30 天
 *
 * @example
 * setCookie('user', 'JohnDoe', 7);  // 设置一个名为 "user" 的 Cookie，值为 "JohnDoe"，过期时间为 7 天
 */
export function setCookie(name: string, value: string, days: number = 30): void {
    // 因为 toUTCString() 会少 8 小时，所以用下面方法 Days*24*60*60*1000
    const exp = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000);

    // 存储的同时存储对应的过期时间
    document.cookie = name + '=' + escape(value) + ';expires=' + exp;
    document.cookie =
        name +
        'Expires' +
        '=' +
        escape((new Date().getTime() + days * 24 * 60 * 60 * 1000).toString()) +
        ';expires=' +
        exp;
}

/**
 * TAG清除指定的 Cookie
 * @param {string} name - 要清除的 Cookie 名称
 *
 * @example
 * clearCookie('user');  // 清除名为 "user" 的 Cookie
 */
export function clearCookie(name: string): void {
    setCookie(name, '', -1);
    setCookie(name + 'Expires', '', -1);
}

/**
 * TAG获取指定 Cookie 的名称和值
 * @param {string | number} name - Cookie 名称
 * @returns {string} - 返回指定 Cookie 的值
 *
 * @example
 * const cookieValue = getCookie('user');  // 获取名为 "user" 的 Cookie 的值
 */
export function getCookie(name: string | number): string {
    var endstr = document.cookie.indexOf(';', Number(name));
    if (endstr == -1) endstr = document.cookie.length;
    return unescape(document.cookie.substring(Number(name), endstr));
}

/**
 * TAG只获取指定 Cookie 的值（不包含名称）
 * @param {string} name - Cookie 名称
 * @returns {string | null} - 返回指定 Cookie 的值，若找不到则返回 null
 *
 * @example
 * const cookieValue = getCookieVal('user');  // 获取名为 "user" 的 Cookie 的值
 */
export function getCookieVal(name: string): string | null {
    var arg = name + '=';
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        // 如果 cookie 内有值就调用上面的 getCookie 方法获取 value
        if (document.cookie.substring(i, j) == arg) {
            return getCookie(j);
        }
        i = document.cookie.indexOf(' ', i) + 1;
        if (i == 0) break;
    }
    return null;
}

/**
 * TAG判断指定的 Cookie 是否已过期
 * @param {string} name - Cookie 名称
 * @returns {boolean} - 如果 Cookie 已过期则返回 true，否则返回 false
 *
 * @example
 * const isExpired = isExpiresFun('user');  // 检查名为 "user" 的 Cookie 是否过期
 */
export function isExpiresFun(name: string): boolean {
    if (Number(getCookieVal(name + 'Expires')) > new Date().getTime()) {
        return false;
    } else {
        // 如果 Cookie 已经过期就清除
        setCookie(name, '', -1);
        setCookie(name + 'Expires', '', -1);
        return true;
    }
}

/**
 * TAG获取网速函数（根据图片加载速度）最多等5秒，超出就返回网速过慢的结果。
 *
 * @param {string} imgUrl - 要加载的图片 URL。
 * @param {number} fileSize - 图片文件大小（单位：KB）。
 * @param {number} [time=5000] - 最大等待时间（单位：毫秒，默认值：5000）。
 * @returns {Promise<{speed: string | number, time: number}>} - 返回一个包含加载速度和加载时间的 Promise。
 *
 * @example
 * const result = await getSpeedWithImg('https://example.com/img.jpg', 500, 5000);
 * console.log(result.speed);  // 网速或提示信息
 */
export async function getSpeedWithImg(
    imgUrl: string,
    fileSize: number,
    time: number = 5000
): Promise<{ speed: string | number; time: number }> {
    return new Promise<{ speed: string | number; time: number }>((resolve, reject) => {
        let start: number = Date.now();
        let end: number | null = null;
        let fiveSeconds: number | null = null;
        let img = document.createElement('img');

        // 防止图片缓存
        img.src = `${imgUrl}?t=${Date.now()}`;

        // 超时处理：最多等待 `time` 毫秒
        setTimeout(() => {
            fiveSeconds = Date.now();
            if (!end) {
                resolve({ speed: '您的网速过慢，小于1', time: fiveSeconds - start });
            }
        }, time);

        // 图片加载成功后的处理
        img.onload = function () {
            end = Date.now();
            const time = end - start;
            const speed = ((fileSize * 1000) / time).toFixed(2);
            resolve({ speed, time });
        };

        img.onerror = (err) => {
            reject(err);
        };
    }).catch((err) => {
        console.log('err', err);
        throw err;
    });
}

/**
 * TAG页面缩放处理，根据指定的宽高和容器 DOM 进行缩放。
 *
 * @param {number} w - 缩放比例基准宽度（默认 1920）。
 * @param {number} h - 缩放比例基准高度（默认 1080）。
 * @param {string} dom - 需要缩放的 DOM 元素选择器（默认 `.wrap`）。
 * @param {number} [aroundH] - 垂直方向的偏移量，用于调整缩放后的元素位置。
 *
 * @returns {number} - 当前的缩放比例。
 *
 * @example
 * const scale = domScale(1920, 1080, '.container');
 * console.log(scale); // 返回当前的缩放比例
 */
export function domScale(
    w: number = 1920,
    h: number = 1080,
    dom: string = '.wrap',
    aroundH?: number
): number {
    let scale =
        document.documentElement.clientWidth / document.documentElement.clientHeight < w / h
            ? document.documentElement.clientWidth / w
            : document.documentElement.clientHeight / h;

    scale = scale === 1 ? 1 : Number(scale) + 0.0026;

    const domEle = document.querySelector(dom) as HTMLElement | null;

    if (domEle) {
        if (aroundH) {
            const translateY =
                (aroundH + parseInt(window.getComputedStyle(domEle).marginTop)) / scale;
            if (domEle) {
                domEle.style.transform = `scale(${scale}) translate(-50%, calc(-50% - ${translateY}px))`;
            }
        } else {
            domEle.style.transform = `scale(${scale}) translate(-100%,-100%)`;
        }
    }

    document.documentElement.style.setProperty('--app-scale', scale.toString());

    return scale;
}

/**
 * TAG获取当前的环境类型。
 *
 * @returns {string} - 返回当前环境（`development`、`production`）。
 *
 * @example
 * const env = processEnv();
 * console.log(env); // 返回 'development' 或 'production'
 */
export function processEnv(): string {
    console.log('processEnv', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') return 'development';
    return 'production';
}

/**
 * TAG判断当前运行系统的类型。
 *
 * @returns {string} - 返回当前操作系统类型（`windows`、`mac`、`ios`、`android`、`other`）。
 *
 * @example
 * const system = getCurrentSystem();
 * console.log(system); // 返回 'windows' 或 'mac' 等
 */
export function getCurrentSystem(): string {
    const version = navigator.userAgent.toLowerCase();

    if (version.includes('compatible') || version.includes('windows')) {
        return 'windows';
    } else if (version.includes('macintosh') || version.includes('macintel')) {
        return 'mac';
    } else if (version.includes('iphone') || version.includes('ipad')) {
        return 'ios';
    } else if (version.includes('android')) {
        return 'android';
    } else {
        return 'other';
    }
}

/**
 * TAG将字符串的首字母大写。
 *
 * @param {string} str - 要首字母大写的字符串。
 *
 * @returns {string} - 返回首字母大写后的字符串。
 *
 * @example
 * const capitalizedStr = capitalizeFirstLetter('hello');
 * console.log(capitalizedStr); // 输出 'Hello'
 */
export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * TAG对象或数组的深拷贝。
 *
 * @param {T} origin - 要拷贝的对象或数组。
 * @param {boolean} [deep=true] - 是否进行深拷贝（默认为 true）。
 *
 * @returns {T} - 返回拷贝后的对象或数组。
 *
 * @example
 * const original = { name: 'Alice', nested: { age: 25 } };
 * const copied = deepCopy(original);
 * console.log(copied); // 输出拷贝后的对象
 */
export function deepCopy<T>(origin: T, deep: boolean = true): T {
    let obj: T = Array.isArray(origin) ? ([] as T) : ({} as T);

    for (let key in origin) {
        let value = origin[key];
        // 确定值是不是引用类型并且需要深拷贝
        obj[key] = deep && value && typeof value === 'object' ? deepCopy(value, deep) : value;
    }

    return obj;
}

/**
 * TAG截取流 ID 中的信息，默认截取 `uid`，根据 `_` 截取第一个 `_` 后的 `uid`。
 *
 * @param {string} id_str - 要处理的流 ID 字符串。
 * @param {number} [i=1] - 截取 `_` 后的第几个部分（默认为 1）。
 *
 * @returns {string} - 截取到的 ID 字符串。
 *
 * @example
 * const uid = splitUid('stream_123_abc', 1);
 * console.log(uid); // 输出 '123'
 */
export function splitUid(id_str: string, i: number = 1): string {
    let res = id_str.toString().split('_')[i];
    return res;
}

/**
 * TAG判断两个流 ID 是否代表同一个人。
 *
 * @param {string} origin_id - 原始流 ID。
 * @param {string} new_id - 新的流 ID。
 *
 * @returns {boolean} - 如果是同一个人返回 `true`，否则返回 `false`。
 *
 * @example
 * const isSamePerson = compareStreamId('stream_123_abc', '123');
 * console.log(isSamePerson); // 输出 true 或 false
 */
export function compareStreamId(origin_id: string, new_id: string): boolean {
    // 如果 origin_id 或 new_id 不存在，直接返回 false
    if (!origin_id || !new_id) return false;

    // 比较拆分后的 uid 是否一致
    if (splitUid(new_id)) {
        return splitUid(origin_id) === splitUid(new_id);
    } else {
        return splitUid(origin_id) === new_id;
    }
}

/**
 * TAG校验给定的地址是否为外部链接。
 *
 * @param {string} path - 要校验的地址字符串。
 *
 * @returns {boolean} - 如果是外部链接返回 `true`，否则返回 `false`。
 *
 * @example
 * const isExternalLink = isExternal('https://www.example.com');
 * console.log(isExternalLink); // 输出 true
 */
export function isExternal(path: string): boolean {
    return /^(https?:|mailto:|tel:)/.test(path);
}
