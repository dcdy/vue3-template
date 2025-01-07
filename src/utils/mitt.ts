/* 
    使用：
    import $bus from '@/utils/mitt.ts'

    派发（emit）：$bus.emit('emitter', 2)
    监听（on）：$bus.on('emitter', e => console.log('监听emitter', e) )
    监听所有(‘*’)：$bus.on('*', (type, e) => console.log(type, e) )  //type为事件类型
    取消监听(off)：$bus.off('emitter', () => {console.log('取消监听')}) 
    取消所有事件：$bus.all.clear()
*/
import mitt from 'mitt';
const $bus = mitt();

export default $bus;
