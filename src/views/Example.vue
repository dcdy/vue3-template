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

        <!-- HACK拖拽 -->
        <div
            class="drag w-fit bg-red"
            id="drag"
            ref="drag"
            v-if="showDragDialog"
        >
            <div
                class="drag-child"
                id="drag-child"
                ref="dragChild"
                @click.stop="onDrag"
            >
                按我拖拽
            </div>
            <div class="">我是拖拽内容</div>
            <div
                class="position[t-0,r-0] size-20 bg-blue text-20 flex[center]"
                @click="showDragDialog = false"
            >
                ×
            </div>
        </div>
        <div
            class=""
            @click="disableDrag"
        >
            点击禁用拖拽
        </div>
        <div
            class=""
            @click="enableDrag"
        >
            点击开始拖拽
        </div>
        <div class="">
            当前拖拽状态：{{ isDragging }}；当前位置：{{
                'x：' + position.x + '；y：' + position.y + isClick
            }}
        </div>
        <!-- HACK右键菜单 -->
        <h1 class="">右键菜单</h1>
        <ContextMenu
            class="w-100 bg-#b1c4ff"
            :menu="[{ name: '修改' }, { name: '删除' }]"
            @select="onContextMenu"
        >
            <div
                class="py-2 cursor-pointer"
                v-for="(item, index) in [1, 2, 3]"
                :key="index"
            >
                <div class="flex[center,] hover:(bg-#0078D7 c-#fff) rounded-4 p[3,5]">
                    <div class="size-5 mr-5"></div>
                    <div class="">{{ item }}</div>
                </div>
            </div>
        </ContextMenu>
        <!-- HACK播放音乐 -->
        <el-button
            type="primary"
            @click="play()"
        >
            播放音乐
        </el-button>
        <el-button
            type="primary"
            @click="play2()"
        >
            播放音乐2
        </el-button>
        <el-button
            type="primary"
            @click="pauseAudio()"
        >
            暂停音乐
        </el-button>
        <el-button
            type="primary"
            @click="resumeAudio()"
        >
            继续播放
        </el-button>
        <el-button
            type="primary"
            @click="stopAudio()"
        >
            停止音乐
        </el-button>
    </main>
</template>
<script setup>
const router = useRouter();
let value1 = ref('');
// TAG当前时间
import { dateFormat } from '@/utils/date';
import { useNow } from '@vueuse/core';
const now = useNow();
const dayNow = computed(() => dateFormat(now.value, 'YYYY年M月D日 dddd HH:mm:ss'));

// TAG路由跳转
const skip = () => {
    router.push('/detail');
};

// TAG调用接口
import { getWeather } from '@/api/index';
let weatherArr = ref([]);
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

// TAG点击指定元素外的部分
import { ClickOutside as vClickOutside } from 'element-plus';
const onClickOutside = (e) => {
    console.log('🚀 ~点击指定元素外的部分:', e);
    // let extraElement = document.querySelector('.canvas-util-popover')?.contains(e.target);
};

// TAG拖拽useDraggable
import { useDraggable } from '@/hooks/useDraggable';
let drag = useTemplateRef('drag');
let dragChild = useTemplateRef('dragChild');
const { position, isDragging, isClick, enableDrag, disableDrag } = useDraggable(drag, dragChild, {
    allowOverflow: 1
});
let showDragDialog = ref(true);
const onDrag = () => {
    if (!isClick.value) {
        console.log('🚀 ~ 不点击');
        return; // 不执行点击
    }
    console.log('🚀 ~ 点击事件', isClick.value);
};

// TAG右键菜单
const onContextMenu = (item, index) => {
    console.log('右键菜单点击的选项', item, index);
    ElMessage({
        message: '右键了菜单：' + item + index,
        type: 'success'
    });
};

// TAG播放音乐
import AlarmAudio from '@/assets/ling.mp3';
import AlarmAudioAlarm from '@/assets/alarm.mp3';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
const { playAudio, stopAudio, pauseAudio, resumeAudio } = useAudioPlayer();
const play = () => {
    playAudio(AlarmAudio);
};
const play2 = () => {
    playAudio(AlarmAudioAlarm);
};
</script>
<style lang="scss" scoped></style>
