<template>
  <nav class="bg-[#8CA9B8] text-white shadow-md py-3 px-6 sticky top-0 z-50">
    <div class="container mx-auto flex justify-between items-center">
      
      <router-link to="/" class="text-lg font-bold flex items-center gap-2 hover:text-[#E0F7FA] transition">
        📂 <span class="hidden sm:inline">ระบบการจัดเก็บโครงงาน</span>
      </router-link>
      
      <div v-if="userStore.isAuthenticated" class="flex items-center gap-4">
        <div class="text-right hidden sm:block">
          <div class="text-[10px] sm:text-xs text-[#E0F7FA] font-bold tracking-wider uppercase mb-0.5">
             {{ getRoleLabel(userStore.user?.role) }}
          </div>
          <div class="text-sm font-bold text-white leading-none">
            {{ userStore.user?.name || userStore.user?.username }}
          </div>
        </div>

        <div class="relative group">
            <router-link :to="`/?userId=${userStore.user?.id}`" title="ดูงานของฉัน">
                <img 
                    v-if="userStore.user?.profileImage" 
                    :src="userStore.user.profileImage" 
                    class="w-10 h-10 rounded-full object-cover border-2 border-white/50 shadow-sm group-hover:border-[#92D2CD] transition cursor-pointer"
                />
                <div v-else class="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-lg border-2 border-white/50 group-hover:border-[#92D2CD] transition cursor-pointer">
                    {{ userStore.user?.username?.charAt(0).toUpperCase() }}
                </div>
            </router-link>
        </div>

        <div class="pl-2 border-l border-white/20">
            <button @click="handleLogout" class="bg-[#76C6C8] hover:bg-[#5FAFB1] text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow">
              ออกจากระบบ
            </button>
        </div>
      </div>
      
      <div v-else class="space-x-3 text-sm font-medium">
        <router-link to="/login" class="hover:text-[#E0F7FA] transition">เข้าสู่ระบบ</router-link>
        <router-link to="/register" class="bg-[#E0F7FA] text-[#5A7D8B] px-3 py-1.5 rounded font-bold hover:bg-white transition">
          ลงทะเบียน
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const getRoleLabel = (role) => {
    switch(role) {
        case 'admin': return '🛠️ ผู้ดูแลระบบ';
        case 'teacher': return '👨‍🏫 ครูที่ปรึกษา';
        case 'student': return '👨‍🎓 นักเรียน';
        default: return 'ผู้ใช้งานทั่วไป';
    }
};

const handleLogout = () => {
  if(confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      userStore.logout();
  }
};
</script>