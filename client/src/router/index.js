import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/userStore';

// Import Views
import Login from '../views/AuthLogin.vue';
import Register from '../views/AuthRegister.vue';
import Dashboard from '../views/ProjectDashboard.vue';
import Submission from '../views/ProjectSubmission.vue';
import ProjectEdit from '../views/ProjectEdit.vue';     // ✅ มีแล้ว
import ProjectDetail from '../views/ProjectDetail.vue'; // ✅ เพิ่มอันนี้เข้ามา


import AdminManage from '../views/AdminManage.vue'; // ✅ หน้าจัดการหลัก (Sidebar)
import AdminUserAdd from '../views/AdminUserAdd.vue'; // ✅ หน้าเพิ่ม
import AdminUserEdit from '../views/AdminUserEdit.vue'; // หน้าแก้ (มีอยู่แล้ว)


const routes = [
    { path: '/admin/manage', component: AdminManage, meta: { requiresAuth: true } },
    { path: '/admin/user/add', component: AdminUserAdd, meta: { requiresAuth: true } },
    { path: '/admin/user/edit/:id', component: AdminUserEdit, meta: { requiresAuth: true } },
    { 
        path: '/login', 
        component: Login 
    },
    { 
        path: '/register', 
        component: Register 
    },
    { 
        path: '/', 
        component: Dashboard, 
        meta: { requiresAuth: true } 
    },
    { 
        path: '/submit', 
        component: Submission, 
        meta: { requiresAuth: true } 
    },
    // ✅ เพิ่ม Route สำหรับหน้าดูรายละเอียด (รับ id)
    { 
        path: '/project/:id', 
        component: ProjectDetail, 
        meta: { requiresAuth: true } 
    },
    // ✅ เพิ่ม Route สำหรับหน้าแก้ไข (รับ id)
    { 
        path: '/edit/:id', 
        component: ProjectEdit, 
        meta: { requiresAuth: true } 
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Guard: ป้องกันคนไม่มีสิทธิ์เข้าหน้า Dashboard และหน้าอื่นๆ ที่ต้องล็อกอิน
router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    
    // เช็ค token จาก localStorage ถ้า store ยังไม่โหลด (กันกรณี Refresh หน้าจอ)
    if (!userStore.token) {
        userStore.token = localStorage.getItem('token');
        // ถ้าเก็บ User Info ไว้ด้วย ก็ควรโหลดกลับมาเพื่อให้แสดงชื่อได้ถูกต้อง
        const storedUser = localStorage.getItem('user_info');
        if (storedUser) {
            userStore.user = JSON.parse(storedUser);
        }
    }

    if (to.meta.requiresAuth && !userStore.token) {
        next('/login');
    } else {
        next();
    }
});

export default router;