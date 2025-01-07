<template>
	<main>
		<h2 class="c-red bg-green">首页</h2>
		<HelloWorld msg="Vite + Vue" />
		<el-button type="primary" class="px-6 h-40 c-red bg-green b-d[2px_solid_red] hover:(bg-gray-400 c-#fff)"
			>按钮</el-button
		>
		<el-date-picker v-model="value1" type="date" placeholder="Pick a day" />
		<SvgIcon name="alicon-shezhi" color="gray" size="24" />
		<el-icon color="red" size="24"><Plus /></el-icon>
		<div class="shadow-[0px_6px_13px_#eee] !c-blue" @click="skip()">跳转到详情页</div>
	</main>
</template>
<script setup>
const router = useRouter();

let value1 = ref('');
setTimeout(() => {
	ElMessage({
		message: '消息',
		type: 'success',
	});
}, 2000);
const skip = () => {
	router.push('/detail');
};
</script>
