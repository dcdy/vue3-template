<template>
    <div ref="contextmenuRef">
        <slot></slot>
        <Teleport to="body">
            <!-- <Transition
                @enter="handleEnter"
                @after-enter="handdleAfterEnter"
            > -->
            <ul
                v-if="visible"
                class="context-menu"
                :style="{ left: x + 'px', top: y + 'px' }"
            >
                <li
                    class="context-menu-item"
                    v-for="(item, index) in menu"
                    @click="select(item, index)"
                >
                    {{ item.name }}
                </li>
            </ul>
            <!-- </Transition> -->
        </Teleport>
    </div>
</template>

<script setup>
const emit = defineEmits(['select']);
const props = defineProps({
    menu: {
        type: Array,
        default: () => []
    }
});

let contextmenuRef = ref(null);
import { useContextmenu } from '@/hooks/useContextmenu';
const { visible, x, y } = useContextmenu(contextmenuRef);
console.log('右键菜单', visible.value, x.value, y.value, props.menu);

const select = (item, index) => {
    emit('select', item, index);
};

function handleEnter(el) {
    // 手动计算auto下撑开的容器高度
    el.style.height = 'auto';
    // 这里需要减去多余的padding
    const h = el.clientHeight - 2;
    // 高度回归为0 否则没有过渡效果
    el.style.height = 0 + 'px';

    // 渲染下一帧之前，复制过渡和计算出的高度
    requestAnimationFrame(() => {
        el.style.height = h + 'px';
        el.style.transition = '.3s';
    });
}

// 进入动画结束后，关闭过渡，否则关闭菜单时有时延
function handdleAfterEnter(el) {
    el.style.transition = 'none';
}
</script>

<style lang="scss" scoped>
.context-menu {
    overflow: hidden;
    position: absolute;
    z-index: 999;
    width: 80px;
    padding: 2px 5px;
    box-sizing: border-box;
    border-radius: 4px;
    font-size: 14px;
    background-color: #fff;

    // border: 1px solid #000;
    box-shadow: 0 0 5px 1px #eee;
    .context-menu-item {
        margin: 5px 0;
        padding: 5px 0;
        box-sizing: border-box;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
        &:hover {
            color: #fff;
            background-color: #0078d7;
        }
    }
}
</style>
