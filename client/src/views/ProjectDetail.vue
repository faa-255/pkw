<template>
  <MainLayout>
    <div v-if="project" class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-[#B8E2E3] mt-4 mb-10">
      
      <div class="bg-[#8CA9B8] text-white p-6 md:p-8 relative">
        <div class="flex justify-between items-start">
          <div>
            <span class="bg-[#76C6C8] text-xs font-bold px-2 py-1 rounded text-white uppercase tracking-wide border border-white/30 shadow-sm">
              {{ project.category }}
            </span>
            <h1 class="text-2xl md:text-3xl font-bold mt-3 leading-tight">{{ project.title }}</h1>
            <div class="flex items-center gap-4 mt-2 opacity-90 text-sm font-medium">
               <span>📅 ปีการศึกษา: {{ project.year }}</span>
               <span>🕒 เมื่อ: {{ formatDate(project.createdAt) }}</span>
            </div>
          </div>
          
          <div v-if="canManage" class="flex gap-2">
            <router-link 
              :to="`/edit/${project._id}`" 
              class="bg-[#97C8EB] hover:bg-[#76C6C8] text-white px-3 py-1 rounded text-sm font-bold transition flex items-center gap-1 shadow-sm border border-white/20"
            >
              📝 แก้ไข
            </router-link>
            
            <button @click="deleteProject" class="bg-red-400 hover:bg-red-500 px-3 py-1 rounded text-sm font-bold transition flex items-center gap-1 shadow-sm border border-white/20">
               🚮 ลบ
            </button>
          </div>
        </div>
      </div>

      <div class="p-6 md:p-8 space-y-8">
        <div>
          <h3 class="text-[#5A7D8B] font-bold text-lg border-b border-[#B8E2E3] pb-2 mb-4 flex items-center gap-2">
            📝 รายละเอียด
          </h3>
          <p class="text-gray-600 leading-relaxed whitespace-pre-line text-base bg-[#F0F8FA] p-5 rounded-lg border border-[#B8E2E3]">
            {{ project.description }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-[#5A7D8B] font-bold text-lg border-b border-[#B8E2E3] pb-2 mb-4 flex items-center gap-2">
              👤 ผู้จัดทำโครงงาน
            </h3>
            <div class="flex items-center gap-4 bg-white p-4 rounded-lg border border-[#B8E2E3] shadow-sm">
               <img 
                  v-if="project.owner?.profileImage" 
                  :src="project.owner.profileImage" 
                  class="w-14 h-14 rounded-full object-cover border-2 border-[#B8E2E3]"
               />
               <div v-else class="w-14 h-14 rounded-full bg-[#E0F7FA] text-[#76C6C8] flex items-center justify-center font-bold text-2xl shadow-inner border border-[#B8E2E3]">
                  {{ project.owner?.username?.charAt(0).toUpperCase() || '?' }}
               </div>

               <div>
                  <p class="font-bold text-[#5A7D8B] text-lg">{{ project.owner?.name || 'Unknown' }}</p>
                  <p class="text-xs text-gray-400 font-medium">
                    สถานะ: <span class="text-[#76C6C8] font-bold">{{ project.owner?.role === 'teacher' ? '👨‍🏫 อาจารย์' : '👨‍🎓 นักเรียน' }}</span>
                  </p>
               </div>
            </div>
          </div>

          <div>
            <h3 class="text-[#5A7D8B] font-bold text-lg border-b border-[#B8E2E3] pb-2 mb-4 flex items-center gap-2">
              เอกสาร
            </h3>
            <div v-if="project.file?.fileUrl" class="bg-[#F0F8FA] p-4 rounded-lg border border-[#B8E2E3] flex items-center justify-between hover:bg-[#E0F7FA] transition group">
              <div class="flex items-center gap-3">
                <span class="text-3xl group-hover:scale-110 transition">📄</span>
                <div class="overflow-hidden">
                  <p class="font-bold text-[#5A7D8B] truncate max-w-[150px]">{{ project.file.fileName }}</p>
                 
                </div>
              </div>
              <a :href="project.file.fileUrl" target="_blank" class="bg-[#76C6C8] text-white text-xs px-4 py-2 rounded-lg font-bold hover:bg-[#5FAFB1] shadow-sm transition">
                Download เอกสาร
              </a>
            </div>
            <div v-else class="text-gray-400 italic bg-gray-50 p-4 rounded border border-dashed border-[#B8E2E3] text-center">
                🚫 ไม่มีไฟล์แนบในระบบ
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-[#F0F8FA] p-4 text-center border-t border-[#B8E2E3]">
        <router-link to="/" class="text-[#76C6C8] hover:text-[#5A7D8B] font-bold flex items-center justify-center gap-2 transition">
          ⬅ กลับไปหน้าคลังข้อมูล
        </router-link>
      </div>
    </div>
    
    <div v-else class="text-center py-32 flex flex-col items-center justify-center text-[#8CA9B8]">
        <div class="animate-spin w-10 h-10 border-4 border-[#B8E2E3] border-t-[#8CA9B8] rounded-full mb-4"></div>
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
    router.push('/');
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('th-TH', { 
      day: 'numeric', month: 'long', year: 'numeric'
  });
};

// ✅ ปรับ Logic ให้ Admin จัดการได้ด้วย
const canManage = computed(() => {
  if (!project.value || !userStore.user) return false;
  
  // 1. Admin ทำได้ทุกอย่าง
  if (userStore.user.role === 'admin') return true;

  // 2. Teacher ทำอะไรไม่ได้
  if (userStore.user.role === 'teacher') return false;

  // 3. Student ทำได้แค่ของตัวเอง
  return userStore.user.id === project.value.owner?._id;
});

const deleteProject = async () => {
  if (!confirm('⚠️ ยืนยันการลบโครงงานนี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) return;
  try {
    await axios.delete(`/projects/${project.value._id}`);
    // ไม่ต้อง Alert แล้ว เด้งกลับเลย
    router.push('/');
  } catch (error) {
    alert('ลบไม่สำเร็จ');
  }
};

onMounted(fetchProject);
</script>