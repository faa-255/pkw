<template>
  <div class="min-h-screen flex items-center justify-center bg-[#F0F8FA] px-4">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-[#B8E2E3]">
      <h2 class="text-3xl font-bold text-[#5A7D8B] mb-2 text-center">ยินดีต้อนรับกลับมา</h2>
      <p class="text-[#8CA9B8] text-center mb-8">เข้าสู่ระบบการจัดเก็บข้อมูลโครงงาน</p>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-[#8CA9B8] mb-1">ชื่อผู้ใช้งาน (Username)</label>
          <input 
            v-model="form.username" 
            type="text" 
            class="w-full p-3 border border-[#B8E2E3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#76C6C8] focus:border-transparent transition text-[#5A7D8B]" 
            placeholder="กรุณากรอกชื่อผู้ใช้งาน"
            required 
          />
        </div>

        <div>
            <label class="block text-sm font-bold text-[#8CA9B8] mb-1">รหัสผ่าน (Password)</label>
            <div class="relative"> 
                <input 
                    v-model="form.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    class="w-full p-3 border border-[#B8E2E3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#76C6C8] focus:border-transparent transition pr-10 text-[#5A7D8B]" 
                    required
                    placeholder="กรุณากรอกรหัสผ่าน"
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

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-[#76C6C8] text-white py-3 rounded-lg hover:bg-[#5FAFB1] transition font-bold shadow-md disabled:opacity-50 text-lg"
        >
          {{ isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-500">
        <router-link to="/register" class="text-[#76C6C8] font-bold hover:underline">
          คลิกเพื่อลงทะเบียนที่นี่
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'; 
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const router = useRouter();
const userStore = useUserStore();

const form = reactive({ username: '', password: '' });
const showPassword = ref(false);
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  
  const success = await userStore.login({ 
    username: form.username, 
    password: form.password 
  });
  
  isLoading.value = false;

  if (success) {
    router.push('/'); 
  } else {
    alert('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
  }
};
</script>