import { defineStore } from 'pinia';
import axios from '../api/axiosClient'; // เรียกใช้ axios ที่เราตั้งค่าไว้

export const useUserStore = defineStore('user', {
  state: () => ({
    // โหลด Token และข้อมูล User จาก LocalStorage ถ้ามี (กัน User รีเฟรชหน้าแล้วหลุด)
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user_info')) || null,
  }),

  getters: {
    // เช็คว่าล็อกอินอยู่ไหม
    isAuthenticated: (state) => !!state.token,
    // เช็คว่าเป็น Admin ไหม
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    async login(credentials) {
      try {
        // ยิง API ไปที่ Backend
        const res = await axios.post('/auth/login', credentials);
        
        // อัปเดต State
        this.token = res.data.token;
        this.user = res.data.user;

        // บันทึกลง LocalStorage (ปิดคอมเปิดใหม่ก็ยังล็อกอินอยู่)
        localStorage.setItem('token', this.token);
        localStorage.setItem('user_info', JSON.stringify(this.user));

        return true; // ล็อกอินสำเร็จ
      } catch (error) {
        console.error("Login Failed:", error);
        return false; // ล็อกอินพลาด
      }
    },

    logout() {
      // ล้างค่าทุกอย่าง
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user_info');
      
      // บังคับรีเฟรชหน้าเว็บเพื่อให้ Redirect ไปหน้า Login
      window.location.href = '/login';
    }
  }
});