<template>
	<!-- <template v-if="props.name.indexOf('#') == -1">
        <i class="font-icon" :class="props.name"></i>
    </template> -->
	<!-- <template> -->
	<!-- 展示外部图标 -->
	<div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" :class="name"></div>
	<!-- 展示内部图标 -->
	<svg v-else aria-hidden="true" class="svg-icon" :width="props.size" :height="props.size">
		<use :xlink:href="iconName" :fill="props.color" />
	</svg>
	<!-- </template> -->
</template>

<script setup>
import '@/assets/iconfonts/iconfont.js'; // 本地引入阿里图标库
// import '@/assets/iconfonts/icon.js'; // 在线地址引入阿里图标库
// import '@/assets/fonts/font.css';
import { defineProps, computed } from 'vue';
const props = defineProps({
	prefix: {
		type: String,
		default: 'icon',
	},
	name: {
		type: String,
		required: true,
		default: '',
	},
	color: {
		type: String,
		default: 'currentColor',
	},
	size: {
		type: [String, Number],

		default: '2em',
	},
});

/**
 * 判断当前图标是否为外部图标
 */
function external(path) {
	// console.log('path', path);
	return /^(https?:|mailto:|tel:)/.test(path);
}

const isExternal = computed(() => external(props.name));
// console.log('是否外部', props.name, isExternal);
// console.log('isExternal', isExternal);
/**
 * 外部图标样式
 */
const styleExternalIcon = computed(() => ({
	mask: `url(${props.name}) no-repeat 50% 50%`,
	'-webkit-mask': `url(${props.name}) no-repeat 50% 50%`,
	'background-color': `${props.color}`,
}));
// console.log('styleExternalIcon', styleExternalIcon);

/**
 * 内部图标
 * 自己本地引入的图标使用 默认前缀，直接写名称close
 * 阿里图标库的图标 不带默认前缀
 */
const iconName = computed(() => {
	if (props.name.indexOf('alicon') !== -1 || props.name.indexOf('myicon') !== -1) {
		return `#${props.name}`;
	}
	return `#${props.prefix}-${props.name}`;
});
</script>

<style lang="scss" scoped>
.svg-icon {
	overflow: hidden;

	// width: 2em;
	// height: 2em;
	vertical-align: -0.15em;

	fill: 'currentColor';
	color: v-bind('props.color');
}

.svg-external-icon {
	display: inline-block;
	vertical-align: -0.35em;
	background-color: 'currentColor';

	-webkit-mask-size: cover !important;
	mask-size: cover !important;
}

.font-icon {
	font-size: v-bind('props.size');
	color: v-bind('props.color');
}
</style>
