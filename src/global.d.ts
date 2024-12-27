// 因 vue3 + ts 还没有那么完善
// 全局注册的组件没有类型提示 一下为解决办法

import SvgIcon from '@/components/SvgIcon.vue';
import HelloWorld from '@/components/HelloWorld.vue';

// 参考：
declare module 'vue' {
	export interface GlobalComponents {
		SvgIcon: typeof SvgIcon;
		HelloWorld: typeof HelloWorld;
	}
}

export {};
