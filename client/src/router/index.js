import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/userStore';

// Import Views
import Login from '../views/AuthLogin.vue';
import Register from '../views/AuthRegister.vue';
import Dashboard from '../views/ProjectDashboard.vue';
import Submission from '../views/ProjectSubmission.vue';
import ProjectEdit from '../views/ProjectEdit.vue';
import ProjectDetail from '../views/ProjectDetail.vue';

import AdminManage from '../views/AdminManage.vue';
import AdminUserAdd from '../views/AdminUserAdd.vue';
import AdminUserEdit from '../views/AdminUserEdit.vue';

const routes = [
    { path: '/admin/manage', component: AdminManage, meta: { requiresAuth: true } },
    { path: '/admin/user/add', component: AdminUserAdd, meta: { requiresAuth: true } },
    { path: '/admin/user/edit/:id', component: AdminUserEdit, meta: { requiresAuth: true } },
    { 
        path: '/login', 
        component: Login,
        // เพิ่ม meta เพื่อบอกว่าเป็นหน้าสำหรับคน "ยังไม่ล็อกอิน" เท่านั้น
        meta: { guestOnly: true } 
    },
    { 
        path: '/register', 
        component: Register,
        meta: { guestOnly: true }
    },
    { 
        path: '/project-dashboard', 
        name: 'project-dashboard',
        component: Dashboard, 
        alias: '/', 
        meta: { requiresAuth: true } 
    },
    { 
        path: '/submit', 
        component: Submission, 
        meta: { requiresAuth: true } 
    },
    { 
        path: '/project/:id', 
        component: ProjectDetail, 
        meta: { requiresAuth: true } 
    },
    { 
        path: '/edit/:id', 
        component: ProjectEdit, 
        meta: { requiresAuth: true } 
    },
    // เพิ่ม: กรณีพิมพ์ URL มั่วๆ ให้ดีดกลับไปหน้า Dashboard หรือ Login
    {
        path: '/:pathMatch(.*)*',
        redirect: '/project-dashboard'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Guard: ป้องกันและจัดการสิทธิ์การเข้าถึง
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    
    // 1. เช็คและโหลด Token ถ้ายังไม่มีใน Store
    if (!userStore.token) {
        const token = localStorage.getItem('token');
        if (token) {
            userStore.token = token;
            const storedUser = localStorage.getItem('user_info');
            if (storedUser) {
                userStore.user = JSON.parse(storedUser);
            }
        }
    }

    // 2. กรณี: เข้าหน้าที่ต้องล็อกอิน (requiresAuth) แต่ไม่มี Token
    if (to.meta.requiresAuth && !userStore.token) {
        return next('/login');
    }

    // 3. กรณี: ล็อกอินอยู่แล้ว แต่อยากเข้าหน้า Login/Register (guestOnly)
    // ให้ดีดกลับไปหน้า Dashboard เลย ไม่ต้องล็อกอินซ้ำ
    if (to.meta.guestOnly && userStore.token) {
        return next('/project-dashboard');
    }

    // ผ่านตลอด
    next();
});

export default router;