<template>
  <MainLayout>
    <div class="flex flex-col md:flex-row gap-6 min-h-[80vh] font-sans">
      
      <aside class="w-full md:w-64 flex-shrink-0">
        <div class="bg-white rounded-lg shadow-sm border border-[#B8E2E3] overflow-hidden sticky top-24">
          <div class="bg-[#F0F8FA] border-b border-[#B8E2E3] px-4 py-3">
            <h3 class="text-xs font-bold text-[#5A7D8B] uppercase tracking-wider">
              เมนูจัดการสมาชิก
            </h3>
          </div>
          
          <nav class="flex flex-col p-2 space-y-1">
            <button 
              @click="activeTab = 'teacher'"
              class="group flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-md transition-colors w-full"
              :class="activeTab === 'teacher' 
                ? 'bg-[#76C6C8] text-white shadow-sm' 
                : 'text-[#8CA9B8] hover:bg-[#F0F8FA] hover:text-[#76C6C8]'"
            >
              <div class="flex items-center gap-3">
                <span class="text-base">👨‍🏫</span>
                <span>รายชื่อคุณครู</span>
              </div>
              <span :class="activeTab === 'teacher' ? 'bg-white/20 text-white' : 'bg-[#E0F7FA] text-[#76C6C8]'" 
                    class="py-0.5 px-2 rounded-full text-xs font-bold">
                {{ teacherCount }}
              </span>
            </button>

            <button 
              @click="activeTab = 'student'"
              class="group flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-md transition-colors w-full"
              :class="activeTab === 'student' 
                ? 'bg-[#76C6C8] text-white shadow-sm' 
                : 'text-[#8CA9B8] hover:bg-[#F0F8FA] hover:text-[#76C6C8]'"
            >
               <div class="flex items-center gap-3">
                <span class="text-base">👨‍🎓</span>
                <span>รายชื่อนักเรียน</span>
              </div>
              <span :class="activeTab === 'student' ? 'bg-white/20 text-white' : 'bg-[#E0F7FA] text-[#76C6C8]'" 
                    class="py-0.5 px-2 rounded-full text-xs font-bold">
                {{ studentCount }}
              </span>
            </button>

            <button 
              @click="activeTab = 'admin'"
              class="group flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-md transition-colors w-full"
              :class="activeTab === 'admin' 
                ? 'bg-[#76C6C8] text-white shadow-sm' 
                : 'text-[#8CA9B8] hover:bg-[#F0F8FA] hover:text-[#76C6C8]'"
            >
               <div class="flex items-center gap-3">
                <span class="text-base">🛠️</span>
                <span>ผู้ดูแลระบบ</span>
              </div>
              <span :class="activeTab === 'admin' ? 'bg-white/20 text-white' : 'bg-[#E0F7FA] text-[#76C6C8]'" 
                    class="py-0.5 px-2 rounded-full text-xs font-bold">
                {{ adminCount }}
              </span>
            </button>

            <div class="pt-4 mt-2 border-t border-[#E0F7FA]">
              <router-link 
                to="/admin/user/add" 
                class="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#76C6C8] hover:bg-[#5FAFB1] text-white text-sm font-bold rounded-md transition shadow-sm"
              >
                <span>➕</span> เพิ่มผู้ใช้งานใหม่
              </router-link>
            </div>
          </nav>
        </div>
      </aside>

      <main class="flex-1">
        <div class="bg-white rounded-lg shadow-sm border border-[#B8E2E3]">
            <div class="px-6 py-5 border-b border-[#B8E2E3] flex justify-between items-center bg-white rounded-t-lg">
                <div>
                    <h2 class="text-xl font-bold text-[#5A7D8B] flex items-center gap-2">
                        {{ tabTitle }}
                    </h2>
                    <p class="text-sm text-[#8CA9B8] mt-1">จัดการข้อมูลสมาชิกในระบบ</p>
                </div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#E0F7FA] text-[#5A7D8B] border border-[#B8E2E3]">
                    ทั้งหมด {{ filteredUsers.length }} คน
                </span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead class="bg-[#F0F8FA] border-b border-[#B8E2E3]">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-[#8CA9B8] uppercase tracking-wider">
                      โปรไฟล์
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-[#8CA9B8] uppercase tracking-wider">
                      ข้อมูลผู้ใช้
                    </th>
                    <th scope="col" class="px-6 py-3 text-center text-xs font-bold text-[#8CA9B8] uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                  <tr v-for="user in filteredUsers" :key="user._id" class="hover:bg-[#F0F8FA] transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap w-24">
                         <div class="relative">
                            <img v-if="user.profileImage" :src="user.profileImage" class="w-10 h-10 rounded-full object-cover border border-[#B8E2E3] shadow-sm">
                            <div v-else class="w-10 h-10 rounded-full bg-[#E0F7FA] flex items-center justify-center font-bold text-[#76C6C8] border border-[#B8E2E3] shadow-sm text-sm">
                                {{ user.username.charAt(0).toUpperCase() }}
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex flex-col">
                            <span class="text-sm font-bold text-[#5A7D8B]">{{ user.name }}</span>
                            <span class="text-xs text-[#8CA9B8] font-medium">Username: @{{ user.username }}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div class="flex items-center justify-center gap-4 opacity-80 hover:opacity-100">
                            <router-link :to="`/admin/user/edit/${user._id}`" class="text-[#76C6C8] hover:text-[#5FAFB1] flex items-center gap-1 transition font-bold text-xs border border-[#B8E2E3] px-3 py-1.5 rounded-md bg-white hover:bg-[#E0F7FA]">
                                ✏️ แก้ไข
                            </router-link>
                            <button @click="deleteUser(user._id)" class="text-red-400 hover:text-red-600 flex items-center gap-1 transition font-bold text-xs border border-red-100 px-3 py-1.5 rounded-md bg-white hover:bg-red-50">
                                🗑️ ลบ
                            </button>
                        </div>
                    </td>
                  </tr>
                  <tr v-if="filteredUsers.length === 0">
                      <td colspan="3" class="px-6 py-16 text-center text-gray-400">
                          <div class="flex flex-col items-center gap-2">
                              <span class="text-4xl opacity-50 text-[#97C8EB]">📭</span>
                              <span class="text-sm font-medium text-[#8CA9B8]">ไม่พบรายชื่อในหมวดหมู่นี้</span>
                          </div>
                      </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
      </main>

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '../api/axiosClient';
import MainLayout from '../layouts/MainLayout.vue';

const users = ref([]);
const activeTab = ref('teacher'); // ค่าเริ่มต้นให้โชว์ครู

// ดึงข้อมูลทั้งหมด
const fetchUsers = async () => {
    try {
        const res = await axios.get('/auth/users');
        users.value = res.data;
    } catch (error) {
        console.error("Error fetching users");
    }
};

// กรองข้อมูลตาม Tab ที่เลือก
const filteredUsers = computed(() => {
    return users.value.filter(u => u.role === activeTab.value);
});

// ชื่อหัวข้อที่จะแสดง
const tabTitle = computed(() => {
    if(activeTab.value === 'teacher') return '👨‍🏫 รายชื่อคุณครู';
    if(activeTab.value === 'student') return '👨‍🎓 รายชื่อนักเรียน';
    return '🛠️ ผู้ดูแลระบบ';
});

// นับจำนวนแต่ละประเภท
const teacherCount = computed(() => users.value.filter(u => u.role === 'teacher').length);
const studentCount = computed(() => users.value.filter(u => u.role === 'student').length);
const adminCount = computed(() => users.value.filter(u => u.role === 'admin').length);

// ฟังก์ชันลบ
const deleteUser = async (id) => {
    if(!confirm("⚠️ ยืนยันการลบผู้ใช้งานรายนี้? ข้อมูลทั้งหมดของผู้ใช้นี้จะหายไปถาวร")) return;
    try {
        await axios.delete(`/auth/users/${id}`);
        users.value = users.value.filter(u => u._id !== id);
    } catch (error) {
        alert("ลบไม่สำเร็จ");
    }
};

onMounted(fetchUsers);
</script>