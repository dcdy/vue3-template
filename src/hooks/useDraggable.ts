import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import type { Ref } from 'vue';

// 定义参数接口
interface DraggableArgs {
    initLeft?: number; // 可选参数，默认值为0
    initTop?: number; // 可选参数，默认值为0
    allowOverflow?: number; // 可选参数，默认值为0
    disabled?: boolean; // 可选参数，默认值为false
    zIndex?: number; // 可选参数，默认值为1
}

/**
 * 自定义 Hook: 用于实现拖拽移动功能
 *
 * @param containerElementRef - 容器元素的 Ref，必传
 * @param draggableElementRef - 拖拽元素的 Ref，必传
 * @param args - 拖拽元素的其他相关配置（可选）
 *   - `initLeft` (number): 拖拽元素初始的 left 偏移量，可选，默认值为 0。
 *   - `initTop` (number): 拖拽元素初始的 top 偏移量，可选，默认值为 0。
 *   - `allowOverflow` (number): 是否允许拖拽元素超出容器边界，可选，默认值为 0(0:不允许;1:允许;-1:不允许且跟随窗口大小移动)。
 *   - `disabled` (boolean): 是否禁用拖拽，可选,默认值为 false。
 *   - `zIndex` (number): 拖拽元素的 z-index 值，可选，默认值为 1。
 *
 * @returns
 *   - `position` - 拖拽元素的当前位置Object（x 和 y 坐标）
 *   - `isDragging` - 拖拽状态
 *   - `isClick` - 是否为点击
 *   - `enableDrag` - 启用拖拽的函数
 *   - `disableDrag` - 禁用拖拽的函数
 * 
 * @example
 * import { useDraggable } from '@/hooks/useDraggable';
   let drag = useTemplateRef('drag');
   let dragChild = useTemplateRef('dragChild');
   const { position, isDragging, isClick, enableDrag, disableDrag } = useDraggable(drag, dragChild, {
       allowOverflow: -1
   });
 */
export function useDraggable(
    containerElementRef: Ref<HTMLElement>,
    draggableElementRef: Ref<HTMLElement>,
    args: DraggableArgs = {}
): {
    position: { x: number; y: number };
    isDragging: Ref<string>;
    isClick: Ref<boolean>;
    enableDrag: () => void;
    disableDrag: () => void;
} {
    let containerElement = containerElementRef.value;
    let draggableElement = draggableElementRef.value;
    const { initLeft = 0, initTop = 0, allowOverflow = 0, disabled = false, zIndex = 1 } = args;

    const position = reactive<{ x: number; y: number }>({ x: initLeft, y: initTop });
    let startX = 0; // 拖拽开始时的鼠标或触摸点的 x 坐标
    let startY = 0; // 拖拽开始时的鼠标或触摸点的 y 坐标
    let initX = initLeft; // 拖拽元素初始的 x 偏移量
    let initY = initTop; // 拖拽元素初始的 y 偏移量
    let scale = 1; // 缩放系数
    let isDraggable = ref(!disabled); // 控制拖拽是否启用
    let isDragging = ref<string>('init'); // 是否处于正在拖拽状态
    let isClick = ref<boolean>(true);

    // 处理拖拽开始事件（鼠标和触摸）
    const onDragStart = (event: MouseEvent | TouchEvent) => {
        if (!isDraggable.value) return; // 如果拖拽被禁用，直接返回
        event.preventDefault();
        event.stopPropagation();

        if (draggableElement && containerElement) {
            initX = position.x;
            initY = position.y;

            // 绑定移动和结束事件
            if (event instanceof TouchEvent) {
                startX = event.touches[0].clientX / scale;
                startY = event.touches[0].clientY / scale;
                document.addEventListener('touchmove', onDragMove);
                document.addEventListener('touchend', onDragEnd);
            } else {
                startX = event.clientX / scale;
                startY = event.clientY / scale;
                document.addEventListener('mousemove', onDragMove);
                document.addEventListener('mouseup', onDragEnd);
            }
            isDragging.value = 'start';
        }
    };

    // 处理拖拽过程中移动事件（鼠标和触摸）
    const onDragMove = (event: MouseEvent | TouchEvent) => {
        if (!isDraggable.value) return; // 如果拖拽被禁用，直接返回
        event.preventDefault();
        event.stopPropagation();
        let deltaX = 0;
        let deltaY = 0;

        if (containerElement) {
            if (event instanceof TouchEvent) {
                deltaX = event.touches[0].clientX / scale - startX;
                deltaY = event.touches[0].clientY / scale - startY;
            } else {
                deltaX = event.clientX / scale - startX;
                deltaY = event.clientY / scale - startY;
            }
            let newX = initX + deltaX;
            let newY = initY + deltaY;

            // 限制拖拽元素超出窗口范围
            if (!allowOverflow) {
                const bodyRect = document.body.getBoundingClientRect();
                const containerRect = containerElement.getBoundingClientRect();

                const maxX = (bodyRect.width - containerRect.width) / scale;
                const maxY = (bodyRect.height - containerRect.height) / scale;

                if (newX < 0) newX = 0;
                if (newY < 0) newY = 0;
                if (newX > maxX) newX = maxX;
                if (newY > maxY) newY = maxY;
            }
            position.x = Math.round(newX);
            position.y = Math.round(newY);

            // 更新容器样式
            containerElement.style.transform = `translate(${position.x}px, ${position.y}px)`;
            isDragging.value = 'ing';
            isClick.value = false;
        }
    };

    // 处理拖拽结束事件（鼠标和触摸）
    const onDragEnd = (event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (event instanceof TouchEvent) {
            document.removeEventListener('touchmove', onDragMove);
            document.removeEventListener('touchend', onDragEnd);
        } else {
            document.removeEventListener('mousemove', onDragMove);
            document.removeEventListener('mouseup', onDragEnd);
        }
        isDragging.value = 'end';
        setTimeout(() => {
            isClick.value = true;
        }, 0);
    };

    // 获取缩放系数
    const getScale = () => {
        const appElement = document.getElementById('app');
        const transformStyle = window.getComputedStyle(appElement!).transform;
        const scaleMatch = transformStyle.match(
            /matrix\(([\d.]+),\s*[\d.]+,\s*[\d.]+,\s*([\d.]+),\s*[\d.]+,\s*[\d.]+\)/
        );
        if (scaleMatch) {
            scale = parseFloat(scaleMatch[1]) || 1;
        }
    };

    // 监听窗口变化，更新拖拽元素的边界
    const updatePositionOnResize = () => {
        if (allowOverflow === -1) {
            const bodyRect = document.body.getBoundingClientRect();
            const containerRect = containerElement?.getBoundingClientRect() || {
                width: 0,
                height: 0
            };

            // 计算新的可拖动区域的最大值
            const maxX = (bodyRect.width - containerRect.width) / scale;
            const maxY = (bodyRect.height - containerRect.height) / scale;

            if (position.x > maxX) {
                position.x = Math.round(maxX);
            }
            if (position.y > maxY) {
                position.y = Math.round(maxY);
            }

            // 强制更新样式
            if (containerElement) {
                containerElement.style.transform = `translate(${position.x}px, ${position.y}px)`;
            }
        }
    };

    // 定义一个回调函数
    const resizeHandler = (evt: Event) => {
        getScale();
        updatePositionOnResize();
    };

    // 组件挂载时设置拖拽事件
    onMounted(() => {
        draggableElement = draggableElementRef.value;
        containerElement = containerElementRef.value;
        console.log('🚀 ~ 拖拽初始挂载', draggableElement, containerElement);
        if (draggableElement) {
            getScale();
            draggableElement.addEventListener('mousedown', onDragStart);
            draggableElement.addEventListener('touchstart', onDragStart);
            if (disabled) {
                draggableElement.style.cursor = 'not-allowed';
            } else {
                draggableElement.style.cursor = 'move';
            }
        }
        if (containerElement) {
            containerElement.classList.add('custom-drag');
            containerElement.style.zIndex = zIndex + '';
        }

        // 监听窗口变化
        window.addEventListener('resize', resizeHandler);
    });

    // 组件卸载时移除拖拽事件
    onBeforeUnmount(() => {
        if (draggableElement) {
            draggableElement.removeEventListener('mousedown', onDragStart);
            draggableElement.removeEventListener('touchstart', onDragStart);
        }
        window.removeEventListener('resize', resizeHandler);
    });

    // 启用拖拽
    const enableDrag = () => {
        if (draggableElement) {
            draggableElement.style.cursor = 'move';
        }
        isDraggable.value = true;
    };

    // 禁用拖拽
    const disableDrag = () => {
        if (draggableElement) {
            draggableElement.style.cursor = 'not-allowed';
        }

        isDraggable.value = false;
    };

    return {
        position,
        isDragging,
        isClick,
        enableDrag,
        disableDrag
    };
}
