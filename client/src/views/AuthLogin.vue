<template>
  <div class="min-h-screen flex items-center justify-center bg-[#F5F5F0] px-4">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-[#E0D8D0]">
      <h2 class="text-3xl font-bold text-[#5C4033] mb-2 text-center">ยินดีต้อนรับกลับมา</h2>
      <p class="text-[#8D7B68] text-center mb-8">เข้าสู่ระบบการจัดเก็บข้อมูลโครงงาน</p>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-[#8D7B68] mb-1">ชื่อผู้ใช้งาน (Username)</label>
          <input 
            v-model="username" 
            type="text" 
            class="w-full p-3 border border-[#E0D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D7B68] focus:border-transparent transition" 
            placeholder="กรุณากรอกชื่อผู้ใช้งาน"
            required 
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-[#8D7B68] mb-1">รหัสผ่าน (Password)</label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full p-3 border border-[#E0D8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D7B68] focus:border-transparent transition" 
            placeholder="กรุณากรอกรหัสผ่าน"
            required 
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-[#8D7B68] text-white py-3 rounded-lg hover:bg-[#5C4033] transition font-bold shadow-md disabled:opacity-50"
        >
          {{ isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-500">
        หากยังไม่มีบัญชี? 
        <router-link to="/register" class="text-[#8D7B68] font-bold hover:underline">
          ลงทะเบียนที่นี่
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const userStore = useUserStore();
const router = useRouter();

const handleLogin = async () => {
  isLoading.value = true;
  const success = await userStore.login({ 
    username: username.value, 
    password: password.value 
  });
  
  isLoading.value = false;

  if (success) {
    router.push('/'); // ถ้าผ่านจะไปหน้าDashboard
  } else {
    alert('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
  }
};
</script>