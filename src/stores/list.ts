import { defineStore } from 'pinia';
import { ref } from 'vue';

// 定义列表项的数据结构
interface ListItem {
    id: string | number;
    [key: string]: any; // 允许其他动态属性
}

/**
 * 用于管理列表数据的 store
 *
 * @returns
 * - `list` - 列表数据。Array
 * - `type` - 当前操作类型。String
 * - `typeObj` - 当前操作对象。Object {type: String, data: Any}
 * - `get` - 获取指定 ID 的数据项
 * - `set` - 设置新的列表数据
 * - `setData` - 更新指定 ID 的数据项
 * - `setProp` - 更新指定 ID 的数据项的指定属性
 * - `add` - 添加新的数据项
 * - `remove` - 移除指定 ID 的数据项
 *
 * @example
 * import { useListStore } from '@/stores/list';
 * const store = useListStore();
 */
export const useListStore = defineStore('handle-list', () => {
    /**
     * store 类型
     * @default ''
     */
    let type = ref<string>('');

    /**
     * 类型对象，包含当前操作类型及其相关数据
     */
    let typeObj = ref<{ type: string; data: any }>({ type: '', data: {} });

    /**
     * 列表数据
     */
    const list = ref<ListItem[]>([]);

    /**
     * 获取指定 ID 的数据项
     *
     * @param id - 要查找的项的 ID
     * @returns 返回匹配的列表项，如果找不到则返回 undefined
     * @example
     * const item = get(1);  // 查找 ID 为 1 的列表项
     */
    const get = (id: string | number): ListItem | undefined => {
        return list.value.find((item) => item.id === id);
    };

    /**
     * 设置新的列表数据
     *
     * @param data - 要设置的列表数据
     * @example
     * set([{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]);  // 设置新的数据列表
     */
    const set = (data: ListItem[]): void => {
        type.value = 'edit';
        typeObj.value = {
            type: 'edit',
            data: data
        };
        list.value = data;
    };

    /**
     * 更新指定 ID 的数据项
     *
     * @param id - 要更新的项的 ID
     * @param value - 新的值
     * @example
     * setData(1, { id: 1, name: 'Updated Item' });  // 更新 ID 为 1 的项
     */
    const setData = (id: string | number, value: ListItem): void => {
        type.value = 'edit';
        typeObj.value = {
            type: 'edit',
            data: { id, value }
        };
        const index = list.value.findIndex((item) => item.id === id);
        if (index === -1) return;
        list.value[index] = value;
    };

    /**
     * 更新指定 ID 的数据项的某个属性
     *
     * @param id - 要更新的项的 ID
     * @param prop - 要更新的属性
     * @param value - 属性的新值
     * @example
     * setProp(1, 'name', 'Updated Name');  // 更新 ID 为 1 的项的 name 属性
     */
    const setProp = (id: string | number, prop: string, value: any): void => {
        type.value = 'edit';
        typeObj.value = {
            type: 'edit',
            data: { id, prop, value }
        };
        const index = list.value.findIndex((item) => item.id === id);
        if (index === -1) return;
        list.value[index][prop] = value;
    };

    /**
     * 添加新的数据项
     *
     * @param data - 要添加的数据项
     * @example
     * add({ id: 3, name: 'New Item' });  // 添加新的数据项
     */
    const add = (data: ListItem): void => {
        // 如果有重复的数据，则不添加
        if (list.value.some((item) => item.id === data.id)) return;
        type.value = 'add';
        typeObj.value = {
            type: 'add',
            data: data
        };
        list.value.push(data);
    };

    /**
     * 删除指定 ID 的数据项
     *
     * @param id - 要删除的项的 ID
     * @example
     * remove(1);  // 删除 ID 为 1 的数据项
     */
    const remove = (id: string | number): void => {
        type.value = 'del';
        const listCopy = list.value;
        const delData = listCopy.find((item) => item.id === id);
        let nextData = null;

        listCopy.forEach((item, index) => {
            if (item.id === id) {
                const nextItem = listCopy[index + 1] || listCopy[index - 1];
                if (nextItem) {
                    nextData = nextItem;
                }
            }
        });

        console.log('🚀 ~ remove ~ nextData:', nextData);

        typeObj.value = {
            type: 'del',
            data: {
                delData,
                nextData
            }
        };
        list.value = list.value.filter((item) => item.id !== id);
    };

    return {
        list,
        type,
        typeObj,
        get,
        set,
        setData,
        setProp,
        add,
        remove
    };
});
