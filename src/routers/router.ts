import * as vR from 'vue-router';

const _routes: Array<vR.RouteRecordRaw> = [
];

const router = vR.createRouter({
    history: vR.createWebHistory(), // 使用 Web History 模式
    routes: _routes // 发送路由配置
});

export default router;