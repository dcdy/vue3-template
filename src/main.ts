import '@/assets/css/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);

// 引入全局变量
app.config.globalProperties.$imgUrl = 'http://';
// 引入全局函数
app.config.globalProperties.$filters = {
	format(str: string) {
		if (!str) {
			return '';
		} else {
			return str;
		}
	},
};

// 引入全局svgIcon图标组件
import 'virtual:svg-icons-register';
import SvgIcon from '@/components/SvgIcon.vue';
app.component('SvgIcon', SvgIcon);

app.use(createPinia());
app.use(router);
app.mount('#app');
