<template>
    <el-config-provider
        :locale="locale"
        :button="{ autoInsertSpace: true }"
        :message="{ max: 3 }"
    >
        <RouterView />
    </el-config-provider>
</template>
<script setup>
import { RouterView } from 'vue-router';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// import en from 'element-plus/es/locale/lang/en';
let locale = ref(zhCn);

// 路由改变title为路由的meta值
import { useTitle } from '@vueuse/core';
const router = useRouter();
onMounted(() => {
    router.afterEach((to) => {
        console.log('🚀 ~ router.afterEach ~ to:', to, to.meta.title);
        // document.title = to.meta.title;
        useTitle(to.meta.title);
    });
});
</script>

<style scoped></style>
