<template>
	<el-config-provider :locale="locale">
		<RouterView />
	</el-config-provider>
</template>
<script setup>
import { RouterView } from 'vue-router';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// import en from 'element-plus/es/locale/lang/en';
let locale = ref(zhCn);
</script>

<style scoped></style>
