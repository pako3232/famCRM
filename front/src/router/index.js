import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import adminka from '../views/adminka.vue'
import florist from '../views/florist.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/adminka',
        name: 'adminka',
        component: adminka,
    },
    {
        path: '/florist',
        name: 'florist',
        component: florist,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 🔒 Проверка авторизации перед каждой страницей
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('role');

    // Если роль не найдена и текущий маршрут не '/login', перенаправляем на /login
    if (!role && to.path !== '/login') {
        console.log('логин');
        return next('/login');
    }

    // Если роль есть и это флорист
    if (role === 'florist' && to.path !== '/florist') {
        console.log('флорист');
        return next('/florist');
    }

    // Если роль есть и это админ
    if (role === 'admin' && to.path !== '/adminka') {
        console.log('админка');
        return next('/adminka');
    }

    // Если ничего из вышеупомянутого не подходит, продолжаем нормальную навигацию
    next();
});
export default router;