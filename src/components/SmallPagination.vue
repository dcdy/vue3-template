<!-- 小分页 -->
<template>
    <!--  -->
    <div
        v-if="size == 'small'"
        v-show="props.totalPage > 1"
        class="pagination flex[center]"
    >
        <el-button
            class="btn"
            type="primary"
            :disabled="currentPage <= 1"
            @click="prev()"
        >
            <el-icon size="30"><CaretLeft /></el-icon>
        </el-button>
        <div class="page flex[center]">{{ currentPage }}/{{ props.totalPage }}</div>
        <el-button
            class="btn"
            type="primary"
            :disabled="currentPage >= props.totalPage"
            @click="next()"
        >
            <el-icon size="30"><CaretRight /></el-icon>
        </el-button>
    </div>
    <div
        v-else-if="size == 'large'"
        class="pagination flex[center]"
    >
        <el-pagination
            :current-page.sync="currentPage"
            :total="totalPage"
            :page-size="pageSize"
            layout="prev, pager, next"
            background
            hide-on-single-page
            class="custom-pagination"
            prev-icon="Back"
            next-icon="Right"
            @current-change="changePage"
            @prev-click="largePrev"
            @next-click="largeNext"
        ></el-pagination>
    </div>
</template>

<script setup>
const props = defineProps({
    size: {
        type: String,
        default: 'small'
    },
    page: {
        type: Number,
        default: 1
    },
    pageSize: {
        type: Number,
        default: 1
    },
    totalPage: {
        type: Number,
        default: 1
    },
    totalCount: {
        type: Number,
        default: 0
    }
});
console.log('页数', props);
const emit = defineEmits(['next', 'prev']);

let currentPage = ref(props.page);
watch(
    () => props.page,
    (newVal) => {
        console.log('newVal', newVal);
        currentPage.value = newVal;
    }
);
// 上一页
const prev = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        emit('prev', currentPage.value);
    }
};
// 下一页
const next = () => {
    if (currentPage.value < props.totalPage) {
        currentPage.value++;
        emit('next', currentPage.value);
    }
};
// 改变页数
const changePage = (num) => {
    currentPage.value = num;
};

const largePrev = () => {
    emit('prev', currentPage.value);
};
const largeNext = () => {
    emit('next', currentPage.value);
};

defineExpose({ changePage, prev, next });
</script>

<style lang="scss" scoped>
.btn {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    background: #2a82e4;
    border: 1px solid #2a82e4;
    cursor: pointer;
}
.page {
    width: 40px;
    height: 40px;
    border-radius: 3.33px;

    border: 1px solid #2a82e4;
    margin: 0 10px;
    font-size: 14px;
    color: #ffffff;
}

:deep() {
    .custom-pagination .el-pager li {
        background-color: transparent !important; /* 背景色透明 */
        border: 1px solid #2a82e4 !important; /* 边框色 */
        color: #fff !important; /* 字体颜色 */
        height: 40px !important;
        width: 40px !important;
        line-height: 40px !important;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .custom-pagination .el-pager li:hover {
        background-color: transparent !important; /* 悬停时背景色透明 */
        border: 1px solid #2a82e4 !important;
        color: #2a82e4 !important;
    }

    .custom-pagination .el-pager li.is-active {
        background-color: #0054fe !important; /* 活动项背景色 */
        border: 1px solid #0054fe !important;
        color: #ffffff !important;
    }

    .custom-pagination .btn-prev,
    .custom-pagination .btn-next {
        background-color: transparent !important;
        border: 1px solid #2a82e4 !important;
        color: #fff !important;
        height: 40px !important;
        width: 80px !important;
        line-height: 40px !important;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 40px;
        .el-icon {
            font-size: 24px;
        }
    }
}
</style>
<style>
.el-button.is-disabled,
.el-button.is-disabled:hover {
    background-color: var(--el-button-disabled-bg-color);
    background-image: none;
    border-color: var(--el-button-disabled-border-color);
    color: var(--el-button-disabled-text-color);
    cursor: not-allowed;
}
</style>
