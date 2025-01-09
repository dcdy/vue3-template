<template>
    <main>
        <h2 class="c-red bg-green">首页{{ dayNow }}</h2>
        <HelloWorld msg="Vite + Vue" />
        <el-button
            type="primary"
            class="px-6 h-40 c-red bg-green b-d[2px_solid_red] hover:(bg-gray-400 c-#fff)"
            @click="onButton"
            v-click-outside="onClickOutside"
        >
            点击获取天气
        </el-button>
        <el-date-picker
            v-model="value1"
            type="date"
            placeholder="Pick a day"
        />
        <SvgIcon
            name="alicon-shezhi"
            color="gray"
            size="24"
        />
        <el-icon
            color="red"
            size="24"
        >
            <Plus />
        </el-icon>
        <div
            class="shadow-[0px_6px_13px_#eee] !c-blue"
            @click="skip()"
        >
            跳转到详情页
        </div>
        <!-- temperature、weather、wind -->
        <div
            class=""
            v-for="(e, i) in weatherArr"
            :key="i"
        >
            {{
                '日期：' +
                e.date +
                ' -- 空气质量：' +
                e.air_quality +
                ' -- 温度：' +
                e.temperature +
                ' -- 天气：' +
                e.weather +
                ' -- 风向：' +
                e.wind
            }}
        </div>
    </main>
</template>
<script setup>
const router = useRouter();
import { dateFormat } from '@/utils/date';
import { throttleFun } from '@/utils/index';
import { useNow } from '@vueuse/core';
import { ClickOutside as vClickOutside } from 'element-plus';

import { getWeather } from '@/api/index';

let value1 = ref('');

const now = useNow();
const dayNow = computed(() => dateFormat(now.value, 'YYYY年M月D日 dddd HH:mm:ss'));
const skip = () => {
    router.push('/detail');
};
let weatherArr = ref([]);
// 点击按钮
const onButton = () => {
    let params = {
        city: '沈阳'
        // successMode: 'msg'
    };
    getWeather(params).then((res) => {
        ElMessage({
            message: '点击按钮',
            type: 'success',
            grouping: true
        });
        weatherArr.value = res.data.data;
    });
};
// 点击指定元素外的部分
const onClickOutside = (e) => {
    console.log('🚀 ~点击指定元素外的部分:', e);
    // let extraElement = document.querySelector('.canvas-util-popover')?.contains(e.target);
};
const throttledCallback = throttleFun(1000);
throttledCallback(() => console.log('这将每秒调用一次。'));
</script>
<style lang="scss" scoped></style>
