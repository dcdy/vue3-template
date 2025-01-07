import { ref, onMounted, onUnmounted } from 'vue';
/* 
    使用：
    import { useDraggable } from '@/hooks/drag.js';
    const dragPosition = useDraggable('canvas-sidebar', 'canvas-drag', initLeft, initTop, true);
    :style="{ transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)` }"
*/
/**
 * 自定义 Hook: 用于实现拖拽移动功能
 * @param {string} containerId - 要整体移动的元素的 id
 * @param {string} draggableId - 拖拽元素的 id
 * @param {number} initLeft - 初始的 x 值
 * @param {number} initTop - 初始的 y 值
 * @param {boolean} allowOverflow - 是否允许拖拽元素超出窗口范围
 * @returns {object} - 返回拖拽元素的上下左右的距离值
 */
export function useDraggable(containerId, draggableId, initLeft = 0, initTop = 0, allowOverflow = false) {
	const position = ref({ x: initLeft, y: initTop });

	let startX = 0;
	let startY = 0;
	let initX = initLeft;
	let initY = initTop;
	let scale = 1;

	// 处理拖拽开始事件（鼠标和触摸）
	const onDragStart = event => {
		const draggableElement = document.getElementById(draggableId);
		const containerElement = document.getElementById(containerId);

		if (draggableElement && containerElement) {
			const isTouchEvent = event.touches !== undefined;

			// 获取起始位置
			startX = (isTouchEvent ? event.touches[0].clientX : event.clientX) / scale;
			startY = (isTouchEvent ? event.touches[0].clientY : event.clientY) / scale;

			// 根据事件类型添加对应的事件监听
			if (isTouchEvent) {
				document.addEventListener('touchmove', onDragMove);
				document.addEventListener('touchend', onDragEnd);
			} else {
				document.addEventListener('mousemove', onDragMove);
				document.addEventListener('mouseup', onDragEnd);
			}
		}
	};

	// 处理拖拽移动事件
	const onDragMove = event => {
		const containerElement = document.getElementById(containerId);
		if (containerElement) {
			const isTouchEvent = event.touches !== undefined;
			const deltaX = (isTouchEvent ? event.touches[0].clientX : event.clientX) / scale - startX;
			const deltaY = (isTouchEvent ? event.touches[0].clientY : event.clientY) / scale - startY;

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

			position.value.x = Math.round(newX);
			position.value.y = Math.round(newY);
		}
	};

	// 处理拖拽结束事件
	const onDragEnd = event => {
		initX = position.value.x;
		initY = position.value.y;

		// 根据事件类型移除对应的事件监听
		if (event.touches !== undefined) {
			document.removeEventListener('touchmove', onDragMove);
			document.removeEventListener('touchend', onDragEnd);
		} else {
			document.removeEventListener('mousemove', onDragMove);
			document.removeEventListener('mouseup', onDragEnd);
		}
	};

	// 获取缩放系数
	const getScale = () => {
		const appElement = document.getElementById('app');
		const transformStyle = window.getComputedStyle(appElement).transform;
		const scaleMatch = transformStyle.match(
			/matrix\(([\d.]+),\s*[\d.]+,\s*[\d.]+,\s*([\d.]+),\s*[\d.]+,\s*[\d.]+\)/
		);
		if (scaleMatch) {
			scale = parseFloat(scaleMatch[1]) || 1;
		}
	};

	// 组件挂载时设置拖拽事件
	onMounted(() => {
		const draggableElement = document.getElementById(draggableId);
		if (draggableElement) {
			getScale();
			draggableElement.addEventListener('mousedown', onDragStart);
			draggableElement.addEventListener('touchstart', onDragStart);
		}
	});

	// 组件卸载时移除拖拽事件
	onUnmounted(() => {
		const draggableElement = document.getElementById(draggableId);
		if (draggableElement) {
			draggableElement.removeEventListener('mousedown', onDragStart);
			draggableElement.removeEventListener('touchstart', onDragStart);
		}
	});

	// 监听窗口变化
	window.addEventListener('resize', getScale);

	return position;
}
