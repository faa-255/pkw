<template>
  <MainLayout>
    <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <h1 class="text-2xl font-bold text-[#5C4033]">📚 คลังข้อมูลโครงงาน</h1>
      
      <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <input 
          v-model="search" 
          @input="fetchProjects"
          type="text" 
          placeholder="ค้นหาชื่อโครงงาน..." 
          class="px-4 py-2 border border-[#E0D8D0] rounded-lg focus:outline-none focus:border-[#8D7B68] w-full sm:w-64"
        />

        <select 
          v-model="filterCategory" 
          @change="fetchProjects" 
          class="px-4 py-2 border border-[#E0D8D0] rounded-lg outline-none text-[#5C4033] focus:border-[#8D7B68] bg-white cursor-pointer"
        >
            <option value="">
              ทั้งหมด ({{ (stats['IT'] || 0) + (stats['Science'] || 0) + (stats['Business'] || 0) + (stats['Art'] || 0) }})
            </option>
            <option value="IT">IT ({{ stats['IT'] || 0 }})</option>
            <option value="Science">วิทยาศาสตร์ ({{ stats['Science'] || 0 }})</option>
            <option value="Business">บริหารธุรกิจ ({{ stats['Business'] || 0 }})</option>
            <option value="Art">ศิลปศาสตร์ ({{ stats['Art'] || 0 }})</option>
        </select>

        <router-link 
  v-if="userStore.user?.role === 'student'"
  to="/submit" 
  class="bg-[#8D7B68] hover:bg-[#5C4033] text-white px-4 py-2 rounded-lg shadow transition whitespace-nowrap flex items-center justify-center gap-2 font-bold"
>
  <span>+</span> ส่งโครงงาน
</router-link>
      </div>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400">กำลังโหลดข้อมูล...</div>
    
    <div v-else-if="projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProjectCard 
        v-for="item in projects" 
        :key="item._id" 
        :project="item" 
        @delete="handleDelete" 
      />
    </div>

    <div v-else class="text-center py-20 bg-white rounded-xl border border-dashed border-[#E0D8D0]">
      <p class="text-gray-400">ไม่พบข้อมูลโครงงาน</p>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '../api/axiosClient';
import MainLayout from '../layouts/MainLayout.vue';
import ProjectCard from '../components/ProjectCard.vue';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore(); // 2. ✅ เรียกใช้ store
const projects = ref([]);
const search = ref('');
const filterCategory = ref(''); // ✅ ตัวแปรเก็บค่าตัวเลือก
const stats = ref({});          // ✅ ตัวแปรเก็บจำนวนนับ
const loading = ref(false);

// ✅ ฟังก์ชันดึงตัวเลขสถิติ
const fetchStats = async () => {
  try {
    const res = await axios.get('/projects/stats');
    stats.value = res.data || {};
  } catch (error) {
    console.error("Failed to load stats", error);
  }
};

// ฟังก์ชันดึงข้อมูลโครงงาน (รองรับทั้ง Search และ Category)
const fetchProjects = async () => {
  loading.value = true;
  try {
    // ส่งค่า search และ category ไปที่ Backend
    const res = await axios.get('/projects', { 
        params: { 
            search: search.value,
            category: filterCategory.value // ✅ ส่งค่า category ไปด้วย
        } 
    });
    projects.value = res.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id) => {
  if (!confirm('ยืนยันที่จะลบโครงงานนี้?')) return;
  try {
    await axios.delete(`/projects/${id}`);
    // ลบออกจากหน้าจอทันที
    projects.value = projects.value.filter(p => p._id !== id);
    // ✅ อัปเดตตัวเลขสถิติใหม่ด้วยหลังจากลบ
    fetchStats(); 
  } catch (error) {
    alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการลบ');
  }
};

onMounted(() => {
  fetchProjects();
  fetchStats(); // ✅ เรียกใช้ตอนเปิดหน้าเว็บ
});
</script>