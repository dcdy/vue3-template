import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

// 定义容器类型，接收一个可能为空的HTML元素引用
interface ContainerElement {
    value: HTMLElement | null;
}

/**
 * 自定义 Hook: 右键菜单，用于处理右键菜单的显示与隐藏
 *
 * @param container 包含右键菜单触发区域的元素
 *
 * @returns
 *  - visible: 右键菜单是否可见
 *  - x: 右键菜单的X坐标
 *  - y: 右键菜单的Y坐标
 */
export function useContextmenu(container: ContainerElement) {
    const visible = ref(false); // 菜单是否可见
    const x = ref(0); // 菜单的X坐标
    const y = ref(0); // 菜单的Y坐标

    // 组件挂载时，注册事件监听器
    onMounted(() => {
        if (container.value) {
            container.value.addEventListener('contextmenu', showMenu);
            // 把事件注册到捕获阶段，改变触发不同元素相同事件的触发顺序
            window.addEventListener('contextmenu', hideMenu, true);
            window.addEventListener('click', hideMenu);
        }
    });

    // 组件卸载时，移除事件监听器
    onBeforeUnmount(() => {
        if (container.value) {
            container.value.removeEventListener('contextmenu', showMenu);
        }
    });

    // 显示右键菜单
    function showMenu(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        visible.value = true;

        nextTick(() => {
            const { pageX, pageY } = e;
            const menuContainer = document.querySelector('.context-menu') as HTMLElement;
            const { clientWidth: menuWidth, clientHeight: menuHeight } = menuContainer;
            const isOverPortWidth = pageX + menuWidth > window.innerWidth;
            const isOverPortHeight = pageY + menuHeight > window.innerHeight;

            if (isOverPortWidth) {
                x.value = pageX - menuWidth;
                y.value = pageY;
            }
            if (isOverPortHeight) {
                x.value = pageX;
                y.value = pageY - menuHeight;
            }
            if (!isOverPortHeight && !isOverPortWidth) {
                x.value = pageX;
                y.value = pageY;
            }
        });
    }

    // 隐藏右键菜单
    function hideMenu(): void {
        visible.value = false;
    }

    return { visible, x, y };
}
