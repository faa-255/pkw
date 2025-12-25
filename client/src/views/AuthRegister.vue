<template>
  <div class="min-h-screen flex items-center justify-center bg-[#F0F8FA] px-4">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-[#B8E2E3]">
      <h2 class="text-2xl font-bold text-[#5A7D8B] mb-6 text-center">ลงทะเบียนสมาชิก</h2>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
        
        <div class="flex flex-col items-center mb-6">
           <div class="w-24 h-24 rounded-full bg-[#E0F7FA] overflow-hidden border-2 border-[#76C6C8] mb-3 relative group shadow-sm">
              <img v-if="previewImage" :src="previewImage" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-[#76C6C8] text-4xl">👤</div>
           </div>
           <label class="cursor-pointer bg-white border border-[#B8E2E3] text-[#8CA9B8] px-3 py-1 rounded-full text-xs font-bold hover:bg-[#76C6C8] hover:text-white transition shadow-sm">
               เลือกรูปโปรไฟล์
               <input type="file" @change="handleFile" accept="image/*" class="hidden" />
           </label>
        </div>

        <div>
            <label class="block text-sm font-bold text-[#8CA9B8] mb-1">ชื่อ - นามสกุล</label>
            <input 
                v-model="form.name" 
                type="text" 
                class="w-full p-2.5 border border-[#B8E2E3] rounded-lg focus:outline-none focus:border-[#76C6C8] focus:ring-1 focus:ring-[#76C6C8] text-[#5A7D8B]" 
                required
            >
        </div>

        <div>
            <label class="block text-sm font-bold text-[#8CA9B8] mb-1">Username</label>
            <input 
                v-model="form.username" 
                type="text" 
                class="w-full p-2.5 border border-[#B8E2E3] rounded-lg focus:outline-none focus:border-[#76C6C8] focus:ring-1 focus:ring-[#76C6C8] text-[#5A7D8B]" 
                required
            >
        </div>

        <div>
            <label class="block text-sm font-bold text-[#8CA9B8] mb-1">Password</label>
            <div class="relative">
                <input 
                    v-model="form.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    class="w-full p-2.5 border border-[#B8E2E3] rounded-lg pr-10 focus:outline-none focus:border-[#76C6C8] focus:ring-1 focus:ring-[#76C6C8] text-[#5A7D8B]" 
                    required
                >
                <button 
                    type="button" 
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-[#8CA9B8] hover:text-[#76C6C8] transition"
                >
                    <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                </button>
            </div>
        </div>
        
        <div>
            <label class="block text-sm font-bold text-[#8CA9B8] mb-1">สถานะ</label>
            <select v-model="form.role" class="w-full p-2.5 border border-[#B8E2E3] rounded-lg focus:outline-none focus:border-[#76C6C8] text-[#5A7D8B] bg-white">
                <option value="student">นักเรียน (Student)</option>
                <option value="teacher">อาจารย์ (Teacher)</option>
            </select>
        </div>

        <button type="submit" class="w-full bg-[#76C6C8] text-white py-3 rounded-lg hover:bg-[#5FAFB1] font-bold mt-4 shadow-md transition text-lg">
            ลงทะเบียน
        </button>
      </form>
      
      <div class="mt-6 text-center text-sm text-gray-500">
        <router-link to="/login" class="text-[#76C6C8] font-bold hover:underline">
          &lt;&lt; กลับไปหน้าเข้าสู่ระบบ
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from '../api/axiosClient';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ name: '', username: '', password: '', role: 'student' });
const file = ref(null);
const previewImage = ref(null);
const showPassword = ref(false);

const handleFile = (e) => {
    const selected = e.target.files[0];
    if (selected) {
        file.value = selected;
        previewImage.value = URL.createObjectURL(selected);
    }
};

const handleRegister = async () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('username', form.username);
    formData.append('password', form.password);
    formData.append('role', form.role);
    if (file.value) {
        formData.append('avatar', file.value);
    }

    try {
        await axios.post('/auth/register', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('ลงทะเบียนสำเร็จ');
        router.push('/login');
    } catch (error) {
        alert(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
};
</script>