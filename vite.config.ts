import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools-cn';
import { resolve } from 'path';
// 引入svg图标
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueDevTools(),
		createSvgIconsPlugin({
			iconDirs: [resolve(process.cwd(), 'src/assets/svg')], // svg的文件路径
			symbolId: 'icon-[name]',
		}),
	],
	resolve: {
		alias: {
			// '@': fileURLToPath(new URL('./src', import.meta.url)),
			'@': resolve('src'),
		},
	},
	css: {
		preprocessorOptions: {
			scss: { api: 'modern-compiler', silenceDeprecations: ['legacy-js-api'] },
		},
	},
	server: {
		host: '0.0.0.0', // 让服务器对外可访问
		port: 5183, // 设置端口号为 4000
	},
	build: {
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
	},
});
