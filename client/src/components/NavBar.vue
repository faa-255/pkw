<template>
  <nav class="bg-earth-primary text-earth-base shadow-md py-3 px-6 sticky top-0 z-50">
    <div class="container mx-auto flex justify-between items-center">
      
      <router-link to="/" class="text-lg font-bold flex items-center gap-2 hover:text-white transition">
         <span class="hidden sm:inline">ระบบการจัดเก็บโครงงาน</span>
      </router-link>
      
      <div v-if="userStore.isAuthenticated" class="flex items-center gap-3">
        
        <div class="text-right hidden sm:block">
          <div class="text-xs text-earth-light uppercase font-bold tracking-wider">
            {{ userStore.user?.role === 'teacher' ? '👨‍🏫 อาจารย์' : '👨‍🎓 นักเรียน' }}
          </div>
          <div class="text-sm font-bold text-white leading-none">
            {{ userStore.user?.name }}
          </div>
        </div>

        <button 
          @click="handleLogout" 
          class="ml-2 bg-[#6D5B4B] hover:bg-[#5C4033] text-white px-3 py-1.5 rounded text-xs font-bold transition shadow border border-[#8D7B68]"
        >
          ออกจากระบบ
        </button>
      </div>
      
      <div v-else class="space-x-3 text-sm">
        <router-link to="/login" class="hover:text-white transition">เข้าสู่ระบบ</router-link>
        <router-link to="/register" class="bg-earth-base text-earth-primary px-3 py-1.5 rounded font-bold hover:bg-white transition">
          ลงทะเบียน
        </router-link>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '../stores/userStore';
const userStore = useUserStore();
const handleLogout = () => {
  if(confirm('ต้องการออกจากระบบหรือไม่')) userStore.logout();
};
</script>