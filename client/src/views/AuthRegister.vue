<template>
  <div class="min-h-screen flex items-center justify-center bg-[#F5F5F0]">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-[#E0D8D0]">
      <h2 class="text-2xl font-bold text-[#5C4033] mb-6 text-center">ลงทะเบียนสมาชิก</h2>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
            <label class="block text-sm text-[#8D7B68] mb-1">ชื่อ - นามสกุล</label>
            <input v-model="form.name" type="text" class="w-full p-2 border border-[#E0D8D0] rounded focus:outline-none focus:border-[#8D7B68]" required>
        </div>
        <div>
            <label class="block text-sm text-[#8D7B68] mb-1">ชื่อผู้ใช้งาน (Username)</label>
            <input v-model="form.username" type="text" class="w-full p-2 border border-[#E0D8D0] rounded focus:outline-none focus:border-[#8D7B68]" required>
        </div>
        <div>
            <label class="block text-sm text-[#8D7B68] mb-1">รหัสผ่าน</label>
            <input v-model="form.password" type="password" class="w-full p-2 border border-[#E0D8D0] rounded focus:outline-none focus:border-[#8D7B68]" required>
        </div>
        
 <div>
    <label class="block text-sm text-[#8D7B68] mb-1">สถานะ</label>
    <select v-model="form.role" class="w-full p-2 border border-[#E0D8D0] rounded text-[#5C4033]">
        <option value="student">นักเรียน (Student)</option>
        <option value="teacher">อาจารย์ (Teacher)</option>
    </select>
</div>

        <button type="submit" class="w-full bg-[#8D7B68] text-white py-2 rounded hover:bg-[#5C4033] transition font-bold mt-4">
            คลิกเพื่อลงทะเบียน
        </button>
      </form>
      
      <p class="mt-4 text-center text-sm text-gray-500">
        ท่านมีบัญชีแล้ว? <router-link to="/login" class="text-[#8D7B68] font-bold hover:underline">คลิกเพื่อเข้าสู่ระบบ</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import axios from '../api/axiosClient';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
    name: '',
    username: '',
    password: '',
    role: 'student' // ค่าเริ่มต้น
});

const handleRegister = async () => {
    try {
        await axios.post('/auth/register', form);
        alert('ลงทะเบียนสำเร็จแล้ว กรุณาเข้าสู่ระบบ');
        router.push('/login');
    } catch (error) {
        alert(error.response?.data?.message || '!เกิดข้อผิดพลาด!');
    }
};
</script>