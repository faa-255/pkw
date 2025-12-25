<template>
  <MainLayout>
    
    <section v-if="userStore.user?.role === 'admin'" class="mb-10 animate-fade-in-up">
        <div class="bg-white rounded-xl shadow-sm border border-[#97C8EB] overflow-hidden">
            <div class="bg-[#8CA9B8] px-6 py-4 border-b border-[#76C6C8]/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-white text-[#8CA9B8] flex items-center justify-center text-xl shadow-sm">🛠️</div>
                    <div><h2 class="text-lg font-bold text-white">แผงควบคุมผู้ดูแลระบบ</h2><p class="text-xs text-[#E0F7FA]">Overview & Management</p></div>
                </div>
                <router-link to="/admin/manage" class="bg-[#76C6C8] hover:bg-[#5FAFB1] text-white px-5 py-2 rounded-lg shadow-md font-bold text-sm flex items-center gap-2 transition duration-300 border border-white/20"><span>⚙️</span> จัดการสมาชิก</router-link>
            </div>
            <div class="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                 <div class="bg-[#97C8EB]/10 p-4 rounded-xl border border-[#97C8EB]/50 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                     <div class="w-12 h-12 rounded-full bg-[#97C8EB] text-white flex items-center justify-center text-xl">🛡️</div>
                     <div><p class="text-xs text-gray-500 font-bold uppercase tracking-wider">ผู้ดูแลระบบ</p><p class="text-2xl font-bold text-[#6B8E9E]">{{ userStats['admin'] || 0 }}</p></div>
                 </div>
                 <div class="bg-[#92D2CD]/10 p-4 rounded-xl border border-[#92D2CD]/50 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                     <div class="w-12 h-12 rounded-full bg-[#92D2CD] text-white flex items-center justify-center text-xl">👨‍🏫</div>
                     <div><p class="text-xs text-gray-500 font-bold uppercase tracking-wider">คุณครู</p><p class="text-2xl font-bold text-[#5B9EA3]">{{ userStats['teacher'] || 0 }}</p></div>
                 </div>
                 <div class="bg-[#76C6C8]/10 p-4 rounded-xl border border-[#76C6C8]/50 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                     <div class="w-12 h-12 rounded-full bg-[#76C6C8] text-white flex items-center justify-center text-xl">👨‍🎓</div>
                     <div><p class="text-xs text-gray-500 font-bold uppercase tracking-wider">นักเรียน</p><p class="text-2xl font-bold text-[#4D8C91]">{{ userStats['student'] || 0 }}</p></div>
                 </div>
                 <div class="bg-[#8CA9B8]/10 p-4 rounded-xl border border-[#8CA9B8]/50 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                     <div class="w-12 h-12 rounded-full bg-[#8CA9B8] text-white flex items-center justify-center text-xl">📚</div>
                     <div><p class="text-xs text-gray-500 font-bold uppercase tracking-wider">โครงงานรวม</p><p class="text-2xl font-bold text-[#5A7D8B]">{{ projects.length }}</p></div>
                 </div>
            </div>
        </div>
    </section>

    <div class="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 pb-6 border-b border-[#B8E2E3]">
      <div>
          <h1 class="text-3xl font-bold text-[#5A7D8B] flex items-center gap-3">📚 คลังข้อมูลโครงงาน</h1>
          <div v-if="currentFilterUser" class="mt-3 flex items-center gap-2 animate-fade-in-up">
              <span class="text-sm text-gray-500">กำลังแสดงผลงานของ:</span>
              <span class="bg-[#76C6C8] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm">
                  👤 {{ currentFilterUser }}
                  <router-link to="/" class="hover:text-[#E0F7FA] text-white ml-1 bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">✕</router-link>
              </span>
          </div>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto p-1">
        <div class="relative group">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#8CA9B8] group-focus-within:text-[#76C6C8] transition">🔍</span>
            <input v-model="search" @input="fetchProjects" type="text" placeholder="ค้นหาชื่อโครงงาน..." class="pl-10 pr-4 py-2.5 bg-white border border-[#B8E2E3] rounded-lg shadow-sm text-sm outline-none w-full sm:w-64 focus:border-[#76C6C8] focus:ring-1 focus:ring-[#76C6C8] transition text-[#5A7D8B]"/>
        </div>
        <div class="relative">
             <select v-model="filterCategory" @change="fetchProjects" class="appearance-none pl-4 pr-10 py-2.5 bg-white border border-[#B8E2E3] rounded-lg shadow-sm text-sm font-bold outline-none cursor-pointer hover:border-[#76C6C8] focus:border-[#76C6C8] transition w-full sm:w-auto" :class="categoryTextColor">
                <option value="" class="text-gray-500">🗂️ ทั้งหมด ({{ totalStats }})</option>
                <option value="IT" class="text-[#97C8EB]">💻 IT ({{ stats['IT'] || 0 }})</option>
                <option value="Science" class="text-[#76C6C8]">🧪 วิทยาศาสตร์ ({{ stats['Science'] || 0 }})</option>
                <option value="Business" class="text-[#8CA9B8]">📊 บริหารธุรกิจ ({{ stats['Business'] || 0 }})</option>
                <option value="Art" class="text-[#92D2CD]">🎨 ศิลปศาสตร์ ({{ stats['Art'] || 0 }})</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#8CA9B8]">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
        <router-link v-if="userStore.user?.role === 'student'" to="/submit" class="bg-[#76C6C8] hover:bg-[#5FAFB1] text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          <span>+ ส่งโครงงาน</span> 
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="text-center py-32 flex flex-col items-center">
        <div class="animate-spin w-10 h-10 border-4 border-[#B8E2E3] border-t-[#8CA9B8] rounded-full mb-4"></div>
        <p class="text-[#8CA9B8] font-medium">กำลังโหลดข้อมูล...</p>
    </div>
    
    <div v-else-if="projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
      <ProjectCard v-for="item in projects" :key="item._id" :project="item" @view="openModal" class="h-full"/>
    </div>

    <div v-else class="text-center py-20 bg-[#F0F8FA] rounded-2xl border-2 border-dashed border-[#B8E2E3] mx-auto max-w-2xl">
      <div class="text-6xl mb-4 opacity-50 text-[#97C8EB]">📂</div>
      <h3 class="text-lg font-bold text-[#5A7D8B] mb-1">ไม่พบข้อมูลโครงงาน</h3>
      <p class="text-sm text-gray-400">
          {{ currentFilterUser ? `ยังไม่มีโครงงานจากคุณ ${currentFilterUser}` : 'ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นดูนะครับ' }}
      </p>
      <router-link v-if="currentFilterUser" to="/" class="text-[#76C6C8] font-bold mt-2 inline-block hover:underline">กลับไปดูทั้งหมด</router-link>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-[#5A7D8B]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300" @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up border border-[#B8E2E3]">
            <div class="bg-white px-8 py-5 border-b border-[#B8E2E3] flex justify-between items-start sticky top-0 z-10">
                <div class="pr-8">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-3 shadow-sm" :class="getCategoryBadgeClass(selectedProject.category)">{{ selectedProject.category }}</span>
                    <h2 class="text-2xl font-bold text-[#5A7D8B] leading-snug">{{ selectedProject.title }}</h2>
                </div>
                <button @click="closeModal" class="p-2 rounded-full hover:bg-[#F0F8FA] text-[#8CA9B8] transition flex-shrink-0">✖</button>
            </div>
            <div class="p-8 overflow-y-auto custom-scrollbar">
                <div class="flex flex-wrap gap-6 mb-8 pb-6 border-b border-[#B8E2E3]/50">
                    <div class="flex items-center gap-3">
                        <div><p class="text-xs text-gray-500 font-bold uppercase">ปีการศึกษา</p><p class="text-sm font-bold text-[#5A7D8B]">{{ selectedProject.year }}</p></div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-2">
                                <img v-if="selectedProject.owner?.profileImage" :src="selectedProject.owner.profileImage" class="w-10 h-10 rounded-full object-cover border border-[#B8E2E3]">
                                
                        <div>
                             <p class="text-xs text-gray-500 font-bold uppercase">ผู้จัดทำ</p>
                             <span class="text-sm font-bold text-[#5A7D8B]">{{ selectedProject.owner?.name }}</span>
                             </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 class="text-[#76C6C8] font-bold text-lg mb-3 flex items-center gap-2">📑 บทคัดย่อ</h3>
                    <div class="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line bg-[#F0F8FA] p-5 rounded-xl border border-[#B8E2E3]">{{ selectedProject.description }}</div>
                </div>
            </div>
            <div class="bg-[#F0F8FA] px-8 py-5 border-t border-[#B8E2E3] flex flex-col sm:flex-row justify-between items-center gap-4">
                <a v-if="selectedProject.file?.fileUrl" :href="selectedProject.file.fileUrl" target="_blank" class="flex items-center gap-2 text-white bg-[#8CA9B8] hover:bg-[#6B8E9E] px-5 py-2.5 rounded-lg font-bold text-sm transition shadow-sm w-full sm:w-auto justify-center"><span>📄</span> ดาวน์โหลดเอกสาร</a>
                <span v-else class="text-sm text-gray-400 italic bg-white px-4 py-2 rounded-lg border border-[#B8E2E3]">🚫 ไม่มีไฟล์แนบ</span>
                <div v-if="canManage" class="flex gap-3 w-full sm:w-auto justify-end">
                    <router-link :to="`/edit/${selectedProject._id}`" class="px-4 py-2 bg-white border border-[#97C8EB] text-[#5A7D8B] hover:bg-[#E0F7FA] rounded-lg text-sm font-bold flex items-center gap-2 transition">แก้ไข</router-link>
                    <button @click="handleDeleteFromModal" class="px-4 py-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-sm font-bold flex items-center gap-2 transition">ลบ</button>
                </div>
            </div>
        </div>
    </div>

  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from '../api/axiosClient';
import MainLayout from '../layouts/MainLayout.vue';
import ProjectCard from '../components/ProjectCard.vue';
import { useUserStore } from '../stores/userStore';

const route = useRoute();
const userStore = useUserStore();
const projects = ref([]);
const search = ref('');
const filterCategory = ref('');
const stats = ref({});          
const userStats = ref({}); 
const loading = ref(false);
const showModal = ref(false);
const selectedProject = ref({});
const currentFilterUser = ref('');

const totalStats = computed(() => {
    return (stats.value['IT'] || 0) + (stats.value['Science'] || 0) + (stats.value['Business'] || 0) + (stats.value['Art'] || 0);
});

const categoryTextColor = computed(() => {
    switch(filterCategory.value) {
        case 'IT': return 'text-[#508CA4]';
        case 'Science': return 'text-[#4D8C91]';
        case 'Business': return 'text-[#5A7D8B]';
        case 'Art': return 'text-[#5B9EA3]';
        default: return 'text-[#5A7D8B]';
    }
});

const fetchStats = async () => {
  try {
    const res = await axios.get('/projects/stats');
    stats.value = res.data || {};
  } catch (error) { console.error("Failed to load stats", error); }
};

const fetchUserStats = async () => {
    if (userStore.user?.role === 'admin') {
        try {
            const res = await axios.get('/auth/stats');
            userStats.value = res.data;
        } catch (e) { console.error(e); }
    }
};

const fetchProjects = async () => {
  loading.value = true;
  try {
    const params = { 
        search: search.value, 
        category: filterCategory.value 
    };
    
    // ✅ ส่ง userId ไปที่ Backend ถ้ามี
    if (route.query.userId) {
        params.userId = route.query.userId;
    }

    const res = await axios.get('/projects', { params });
    projects.value = res.data;

    // หาชื่อคนทำ
    if(route.query.userId && projects.value.length > 0) {
        currentFilterUser.value = projects.value[0].owner?.name;
    } else {
        currentFilterUser.value = '';
    }

  } catch (error) { console.error(error); } 
  finally { loading.value = false; }
};

// ✅ Watch URL เปลี่ยนแปลง
watch(() => route.query, () => {
    fetchProjects();
});

const openModal = (project) => { selectedProject.value = project; showModal.value = true; };
const closeModal = () => { showModal.value = false; selectedProject.value = {}; };
const handleDeleteFromModal = async () => {
    if (!confirm('ยืนยันที่จะลบโครงงานนี้?')) return;
    try {
        await axios.delete(`/projects/${selectedProject.value._id}`);
        projects.value = projects.value.filter(p => p._id !== selectedProject.value._id);
        fetchStats(); closeModal();
    } catch (error) { alert('ลบไม่สำเร็จ'); }
};
const canManage = computed(() => {
    if (!userStore.user || !selectedProject.value.owner) return false;
    if (userStore.user.role === 'admin') return true;
    if (userStore.user.role === 'teacher') return false;
    return userStore.user.id === selectedProject.value.owner._id;
});
const getCategoryBadgeClass = (cat) => {
     switch(cat) {
        case 'IT': return 'bg-[#97C8EB] text-white';
        case 'Science': return 'bg-[#76C6C8] text-white';
        case 'Business': return 'bg-[#8CA9B8] text-white';
        case 'Art': return 'bg-[#92D2CD] text-white';
        default: return 'bg-[#B8E2E3] text-[#5A7D8B]';
    }
};

onMounted(async () => {
  await fetchProjects();
  fetchStats(); 
  fetchUserStats(); 
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #B8E2E3; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #76C6C8; }
@keyframes scale-up { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
.animate-scale-up { animation: scale-up 0.2s ease-out; }
@keyframes fade-in-up { 0% { transform: translateY(10px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
.animate-fade-in-up { animation: fade-in-up 0.4s ease-out; }
</style>