<template>
	<main>
		<h2>首页</h2>
		<HelloWorld msg="Vite + Vue" />
		<el-button type="primary">按钮</el-button>
		<el-date-picker v-model="value1" type="date" placeholder="Pick a day" />
		<SvgIcon name="alicon-shezhi" color="gray" size="24" />
		<el-icon color="red" size="24"><Plus /></el-icon>
	</main>
</template>
<script setup>
import HelloWorld from '../components/HelloWorld.vue';
let value1 = ref('');
setTimeout(() => {
	ElMessage({
		message: 'Congrats, this is a success message.',
		type: 'success',
	});
}, 2000);
</script>
