// 引用Unocss
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
    }
};

// 引入全局svgIcon图标组件
import 'virtual:svg-icons-register';
import SvgIcon from '@/components/SvgIcon.vue';
app.component('SvgIcon', SvgIcon);

// 引入Element图标
import { Plus } from '@element-plus/icons-vue';
// 创建一个图标数组，包含需要注册的图标组件
const icons = [Plus];
// 循环注册图标组件
icons.forEach((icon) => {
    if (icon.name && !app.component(icon.name)) {
        app.component(icon.name, icon);
    }
});
import 'dayjs/locale/zh-cn';

// 引入全局样式文件
import '@/assets/css/main.scss';
// 引入UnoCSS
import 'virtual:uno.css';

// 引入mitt
import $bus from '@/utils/mitt.ts';
app.config.globalProperties.$bus = $bus;

app.use(createPinia());
app.use(router);
app.mount('#app');
