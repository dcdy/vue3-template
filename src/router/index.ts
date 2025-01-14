import { createRouter, createWebHistory } from 'vue-router';
import Example from '../views/Example.vue';
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Example',
            component: Example
        },
        {
            path: '/detail',
            name: 'Detail',
            component: () => import('../views/Detail.vue'),
            meta: {
                title: '详情'
            }
        }
    ]
});

export default router;
