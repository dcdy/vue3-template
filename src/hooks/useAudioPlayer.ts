import { ref, onUnmounted } from 'vue';

/**
 * AudioPlayer 类型
 * 定义了音频播放器钩子的返回类型
 */
export interface AudioPlayer {
    /**
     * 播放音频
     * @param {string} src 音频源地址
     * @returns {void}
     */
    playAudio: (src: string) => void;

    /**
     * 暂停音频播放
     * @returns {void}
     */
    pauseAudio: () => void;

    /** 继续播放音频
     * @returns {void}
     */
    resumeAudio: () => void;

    /**
     * 停止音频播放并重置音频源
     * @returns {void}
     */
    stopAudio: () => void;
}

/**
 * useAudioPlayer Hook
 * 提供音频播放控制功能，包括播放、暂停和停止音频等功能。
 *
 * @returns {AudioPlayer} 返回音频播放器的控制函数
 *  - `playAudio` - 播放音频
 *  - `pauseAudio` - 暂停音频播放
 *  - `resumeAudio` - 继续播放音频
 *  - `stopAudio` - 停止音频播放并重置音频源
 *
 * @example
 * import { useAudioPlayer } from '@/hooks/useAudioPlayer';
 * const { playAudio, pauseAudio, resumeAudio, stopAudio } = useAudioPlayer();
 * import AlarmAudio from '@/assets/alarm.mp3';
 *
 * // 播放音频
 * playAudio(AlarmAudio);
 * // 暂停音频播放
 * pauseAudio();
 * // 继续播放音频
 * resumeAudio();
 * // 停止音频播放并重置音频源
 * stopAudio();
 */
export function useAudioPlayer(): AudioPlayer {
    // 音频对象的引用
    const audio = ref<HTMLAudioElement | null>(null);

    /**
     * 创建或更新音频实例
     * @param {string} src 音频源地址
     * @returns {HTMLAudioElement} 返回音频实例
     */
    const createAudioInstance = (src: string): HTMLAudioElement => {
        if (!audio.value) {
            audio.value = new Audio(src);
        } else {
            audio.value.src = src;
        }
        return audio.value;
    };

    /**
     * 播放音频
     * @param {string} src 音频源地址
     */
    const playAudio = (src: string): void => {
        const audioInstance = createAudioInstance(src);
        audioInstance.play().catch((error) => {
            console.error('播放失败: ', error);
        });
    };

    /**
     * 暂停音频播放
     */
    const pauseAudio = (): void => {
        if (audio.value) {
            audio.value.pause();
        }
    };

    /** 继续播放音频 */
    const resumeAudio = (): void => {
        if (audio.value) {
            audio.value.play();
        }
    };

    /**
     * 停止音频播放并重置音频源
     */
    const stopAudio = (): void => {
        if (audio.value) {
            audio.value.pause();
            audio.value.currentTime = 0; // 重置音频时间到 0
        }
    };

    // 在组件销毁时清理音频资源
    onUnmounted(() => {
        if (audio.value) {
            audio.value.pause();
            audio.value = null;
        }
    });

    return {
        playAudio,
        pauseAudio,
        resumeAudio,
        stopAudio
    };
}
