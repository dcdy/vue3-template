import { ref, onMounted, onUnmounted, computed } from 'vue';
import type { Ref, ComputedRef } from 'vue';
/**
 * 正计时
 *
 * @param {number} [initialSeconds=0] - 初始秒数，默认为0。
 * @returns {Object} 定时器的状态和控制方法。
 * @returns {Ref<number>} time - 当前计时器的时间（秒）。
 * @returns {Ref<number>} isRunning - 计时器的运行状态，0表示未启动，1表示正在运行，2表示已暂停。
 * @returns {Function} start - 启动计时器的方法。
 * @returns {Function} pause - 暂停计时器的方法。
 * @returns {Function} reset - 重置计时器的方法，恢复到初始时间。
 * @returns {Function} resume - 继续计时器的方法，恢复到暂停时的状态。
 * @returns {ComputedRef<string>} formattedTime - 格式化后的时间字符串（hh:mm:ss）。
 *
 * @example
 * import { useTimer } from '@/hooks/useTimer';
 * const {
 *     start: startTimer,
 *     reset: resetTimer,
 *     pause: pauseTimer,
 *     resume: resumeTimer,
 *     time: timerTime,
 *     formattedTime: timerFormattedTime,
 *     isRunning: timerRunning
 * } = useTimer();
 */
export function useTimer(initialSeconds: number = 0): {
    time: Ref<number>;
    isRunning: Ref<number>;
    start: () => void;
    pause: () => void;
    reset: () => void;
    resume: () => void;
    formattedTime: ComputedRef<string>;
} {
    const time: Ref<number> = ref(initialSeconds);
    const isRunning: Ref<number> = ref(0);
    let intervalId: ReturnType<typeof setInterval> | null = null;

    /**
     * 格式化时间，转换为 hh:mm:ss 的格式
     * @param {number} seconds - 要格式化的秒数
     * @returns {string} 格式化后的时间字符串
     */
    const formatTime = (seconds: number): string => {
        const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${secs}`;
    };

    /**
     * 启动计时器
     */
    const start = (): void => {
        if (isRunning.value === 0 || isRunning.value === 2) {
            isRunning.value = 1;
            intervalId = setInterval(() => {
                time.value++;
            }, 1000);
        }
    };

    /**
     * 暂停计时器
     */
    const pause = (): void => {
        if (isRunning.value === 1) {
            if (intervalId) clearInterval(intervalId);
            isRunning.value = 2;
        }
    };

    /**
     * 重置计时器
     * 恢复到初始时间，并暂停计时器
     */
    const reset = (): void => {
        pause();
        time.value = initialSeconds;
        isRunning.value = 0;
    };

    /**
     * 恢复计时器
     * 如果计时器已暂停，则继续计时
     */
    const resume = (): void => {
        if (isRunning.value === 2) {
            start();
        }
    };

    onUnmounted(() => {
        if (intervalId) clearInterval(intervalId);
    });

    return {
        time,
        isRunning,
        start,
        pause,
        reset,
        resume,
        formattedTime: computed(() => formatTime(time.value))
    };
}

/**
 * 倒计时
 *
 * @param {number} [initialSeconds=0] 初始倒计时时间，单位秒，默认为0。
 * @returns {Object} 返回包含计时器功能和状态的对象
 * @returns {Ref<number>} time 当前倒计时的剩余时间
 * @returns {Ref<number>} isRunning 当前计时器的状态：
 *          0 - 停止, 1 - 运行中, 2 - 已暂停
 * @returns {Function} start 开始倒计时，接受一个持续时间作为参数（单位：秒）
 * @returns {Function} pause 暂停倒计时
 * @returns {Function} reset 重置倒计时为初始时间
 * @returns {Function} resume 恢复倒计时
 * @returns {ComputedRef<string>} formattedTime 格式化后的剩余时间，格式为 "HH:mm:ss"
 *
 * @example
 * import { useCountdown } from '@/hooks/useTimer';
 * const {
 *     start: startCountdown,
 *     reset: resetCountdown,
 *     pause: pauseCountdown,
 *     resume: resumeCountdown,
 *     time: countdownTime,
 *     formattedTime: countdownFormattedTime,
 *     isRunning: countdownRunning
 * } = useCountdown();
 */
export function useCountdown(initialSeconds: number = 0): {
    time: Ref<number>;
    isRunning: Ref<number>;
    start: (duration: number) => void;
    pause: () => void;
    reset: () => void;
    resume: () => void;
    formattedTime: ComputedRef<string>;
} {
    const time: Ref<number> = ref(initialSeconds);
    const isRunning: Ref<number> = ref(0);
    let intervalId: any = null;

    /**
     * 格式化时间，转换为 hh:mm:ss 的格式
     * @param {number} seconds - 要格式化的秒数
     * @returns {string} 格式化后的时间字符串
     */
    const formatTime = (seconds: number): string => {
        const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${secs}`;
    };

    /**
     * 启动倒计时
     * @param {number} duration - 倒计时的总时长（单位：秒）
     */
    const start = (duration: number): void => {
        if (isRunning.value === 0 || isRunning.value === 2) {
            isRunning.value = 1;
            time.value = duration;
            intervalId = setInterval(() => {
                if (time.value > 0) {
                    time.value--;
                    if (time.value === 0) {
                        isRunning.value = 0;
                    }
                } else {
                    clearInterval(intervalId);
                    isRunning.value = 0;
                }
            }, 1000);
        }
    };

    /**
     * 暂停倒计时
     */
    const pause = (): void => {
        if (isRunning.value === 1) {
            clearInterval(intervalId);
            isRunning.value = 2;
        }
    };

    /**
     * 重置倒计时
     * 恢复到初始时间，并暂停倒计时
     */
    const reset = (): void => {
        pause();
        time.value = initialSeconds;
        isRunning.value = 0;
    };

    /**
     * 恢复倒计时
     * 如果倒计时已暂停，则继续倒计时
     */
    const resume = (): void => {
        if (isRunning.value === 2) {
            intervalId = setInterval(() => {
                if (time.value > 0) {
                    time.value--;
                } else {
                    clearInterval(intervalId);
                    isRunning.value = 0;
                }
            }, 1000);
            isRunning.value = 1;
        }
    };

    onUnmounted(() => {
        if (intervalId) clearInterval(intervalId);
    });

    return {
        time,
        isRunning,
        start,
        pause,
        reset,
        resume,
        formattedTime: computed(() => formatTime(time.value))
    };
}

/**
 * 获取当前时间并提供格式化的时间组件。
 * 
 * 返回一个包含当前年份、月份、日期、星期几、小时、分钟和秒数的计算属性。
 * 每秒钟更新一次当前时间。
 * 
 * @returns {Object} 返回包含以下计算属性的对象：
 *  - year: {String} 当前年份，格式为四位数（如：2025）
 *  - month: {Number} 当前月份，范围从1到12
 *  - date: {String} 当前日期，格式为两位数（如：01）
 *  - week: {String} 当前星期几（如：'一', '二', '三', 等）
 *  - hours: {String} 当前小时，格式为两位数（如：09）
 *  - minutes: {String} 当前分钟，格式为两位数（如：05）
 *  - seconds: {String} 当前秒数，格式为两位数（如：03）
 * 
 * @example
 * import { useCurrentTime } from '@/hooks/useTimer';
 * const {
        year: clockYear,
        month: clockMonth,
        date: clockDate,
        week: clockWeek,
        hours: clockHours,
        minutes: clockMinutes,
        seconds: clockSeconds
    } = useCurrentTime();
 */
export function useCurrentTime(): {
    year: ComputedRef<string>;
    month: ComputedRef<number>;
    date: ComputedRef<string>;
    week: ComputedRef<string>;
    hours: ComputedRef<string>;
    minutes: ComputedRef<string>;
    seconds: ComputedRef<string>;
} {
    const currentTime = ref(new Date());
    const weekMap = ['日', '一', '二', '三', '四', '五', '六'];

    const updateCurrentTime = () => {
        currentTime.value = new Date();
    };

    onMounted(() => {
        const timer = setInterval(updateCurrentTime, 1000);
        return () => clearInterval(timer);
    });

    const formatNumber = (number: number) => {
        return String(number).padStart(2, '0');
    };

    return {
        year: computed(() => formatNumber(currentTime.value.getFullYear())),
        // month: computed(() => formatNumber(currentTime.value.getMonth() + 1)),
        month: computed(() => currentTime.value.getMonth() + 1),
        date: computed(() => formatNumber(currentTime.value.getDate())),
        week: computed(() => weekMap[currentTime.value.getDay()]),
        hours: computed(() => formatNumber(currentTime.value.getHours())),
        minutes: computed(() => formatNumber(currentTime.value.getMinutes())),
        seconds: computed(() => formatNumber(currentTime.value.getSeconds()))
    };
}
