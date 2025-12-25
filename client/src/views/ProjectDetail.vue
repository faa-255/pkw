<template>
  <MainLayout>
    <div v-if="project" class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-[#E0D8D0] mt-4 mb-10">
      
      <div class="bg-[#8D7B68] text-white p-6 md:p-8 relative">
        <div class="flex justify-between items-start">
          <div>
            <span class="bg-[#A4907C] text-xs font-bold px-2 py-1 rounded text-white uppercase tracking-wide border border-white/30">
              {{ project.category }}
            </span>
            <h1 class="text-2xl md:text-3xl font-bold mt-3 leading-tight">{{ project.title }}</h1>
            <div class="flex items-center gap-4 mt-2 opacity-90 text-sm">
               <span>📅 ปีการศึกษา: {{ project.year }}</span>
               <span>🕒 เมื่อ: {{ formatDate(project.createdAt) }}</span>
            </div>
          </div>
          
          <div v-if="isOwner" class="flex gap-2">
            <router-link 
              :to="`/edit/${project._id}`" 
              class="bg-[#E6B17E] hover:bg-[#D49E6A] text-white px-3 py-1 rounded text-sm font-bold transition flex items-center gap-1 shadow-sm"
            >
              ✏️ แก้ไข
            </router-link>
            
            <button @click="deleteProject" class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-bold transition flex items-center gap-1 shadow-sm">
               🗑️ ลบ
            </button>
          </div>
        </div>
      </div>

      <div class="p-6 md:p-8 space-y-8">
        <div>
          <h3 class="text-[#5C4033] font-bold text-lg border-b border-[#E0D8D0] pb-2 mb-4">
            📝 บทคัดย่อ / รายละเอียด
          </h3>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line text-base bg-[#F5F5F0] p-4 rounded-lg border border-[#E0D8D0]">
            {{ project.description }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-[#5C4033] font-bold text-lg border-b border-[#E0D8D0] pb-2 mb-4">
              👤 ผู้จัดทำโครงงาน
            </h3>
            <div class="flex items-center gap-4 bg-white p-4 rounded-lg border border-[#E0D8D0] shadow-sm">
               <div class="w-12 h-12 rounded-full bg-[#8D7B68] text-white flex items-center justify-center font-bold text-xl shadow-inner">
                  {{ project.owner?.username?.charAt(0).toUpperCase() || '?' }}
               </div>
               <div>
                  <p class="font-bold text-[#5C4033] text-lg">{{ project.owner?.name || 'Unknown' }}</p>
                  <p class="text-xs text-gray-500 font-medium">
                    สถานะ: <span class="text-[#8D7B68]">{{ project.owner?.role === 'teacher' ? '👨‍🏫 อาจารย์' : '👨‍🎓 นักเรียน' }}</span>
                  </p>
               </div>
            </div>
          </div>

          <div>
            <h3 class="text-[#5C4033] font-bold text-lg border-b border-[#E0D8D0] pb-2 mb-4">
              📂 เอกสารแนบ
            </h3>
            <div v-if="project.file?.fileUrl" class="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between hover:bg-gray-100 transition group">
              <div class="flex items-center gap-3">
                <span class="text-3xl group-hover:scale-110 transition">📄</span>
                <div class="overflow-hidden">
                  <p class="font-bold text-[#5C4033] truncate max-w-[150px]">{{ project.file.fileName }}</p>
                  <p class="text-xs text-gray-500">คลิกเพื่อดาวน์โหลด</p>
                </div>
              </div>
              <a :href="project.file.fileUrl" target="_blank" class="bg-[#8D7B68] text-white text-xs px-4 py-2 rounded-lg font-bold hover:bg-[#6D5B4B] shadow-sm transition">
                Download
              </a>
            </div>
            <div v-else class="text-gray-400 italic bg-gray-50 p-4 rounded border border-dashed text-center">
                🚫 ไม่มีไฟล์แนบในระบบ
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-[#F5F5F0] p-4 text-center border-t border-[#E0D8D0]">
        <router-link to="/" class="text-[#8D7B68] hover:text-[#5C4033] font-bold flex items-center justify-center gap-2 transition">
          ⬅️ กลับไปหน้าคลังข้อมูล
        </router-link>
      </div>
    </div>
    
    <div v-else class="text-center py-20 flex flex-col items-center justify-center text-gray-400">
        กำลังโหลดข้อมูล...
    </div>

  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../api/axiosClient';
import { useUserStore } from '../stores/userStore';
import MainLayout from '../layouts/MainLayout.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const project = ref(null);

const fetchProject = async () => {
  try {
    const res = await axios.get(`/projects/${route.params.id}`);
    project.value = res.data;
  } catch (error) {
    console.error(error);
    alert('ไม่พบข้อมูลโครงงาน');
    router.push('/');
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('th-TH', { 
      day: 'numeric', month: 'long', year: 'numeric'
  });
};

const isOwner = computed(() => {
  if (!project.value || !userStore.user) return false;
  if (userStore.user.role === 'teacher') return false;
  return userStore.user.id === project.value.owner?._id;
});

const deleteProject = async () => {
  if (!confirm('ยืนยันการลบโครงงานนี้?')) return;
  try {
    await axios.delete(`/projects/${project.value._id}`);
    alert('ลบเรียบร้อยแล้ว');
    router.push('/');
  } catch (error) {
    alert('ลบไม่สำเร็จ');
  }
};

onMounted(fetchProject);
</script>