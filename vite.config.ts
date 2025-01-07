import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools-cn';
import { resolve } from 'path';
// 引入svg图标
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// 引入Elemetnt-plus
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// 引入UnoCSS
import UnoCSS from 'unocss/vite';

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
		//extensions数组的意思是在import组件的时候自动补全.vue等文件后缀
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.scss'],
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler',
				silenceDeprecations: ['legacy-js-api'],
			},
		},
	},
	plugins: [
		vue(),
		vueDevTools(),
		createSvgIconsPlugin({
			iconDirs: [resolve(process.cwd(), 'src/assets/svg')], // svg的文件路径
			symbolId: 'icon-[name]',
		}),
		AutoImport({
			imports: ['vue', 'vue-router'],
			resolvers: [
				ElementPlusResolver(), // 自动导入图标组件
			],
			dts: resolve(resolve(__dirname, 'src'), 'auto-imports.d.ts'),
		}),
		Components({
			resolvers: [ElementPlusResolver()],
			dts: resolve(resolve(__dirname, 'src'), 'components.d.ts'),
		}),
		UnoCSS(),
	],
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
