<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden border border-[#E0D8D0] hover:shadow-lg transition-all duration-300 flex flex-col h-full">
    <div class="bg-[#F5F5F0] px-4 py-2 border-b border-[#E0D8D0] flex justify-between items-center">
      <span class="text-xs font-bold text-[#8D7B68] uppercase bg-[#E0D8D0] px-2 py-1 rounded">
        {{ project.category }}
      </span>
      <span class="text-xs text-gray-500">{{ formatDate(project.createdAt) }}</span>
    </div>

    <div class="p-5 flex-1 flex flex-col">
      <h3 class="text-lg font-bold text-[#5C4033] mb-2 leading-tight">{{ project.title }}</h3>
      <p class="text-sm text-gray-600 line-clamp-3 mb-4">{{ project.description }}</p>
      
      <div class="mt-auto flex items-center gap-2 pt-3 border-t border-gray-100">
        <div class="w-8 h-8 rounded-full bg-[#8D7B68] text-white flex items-center justify-center text-sm font-bold">
           {{ project.owner?.name?.charAt(0).toUpperCase() || '?' }}
        </div>
        <div class="flex flex-col">
            <span class="text-[10px] text-gray-400">ผู้จัดทำ</span>
            <span class="text-xs font-bold text-[#5C4033]">{{ project.owner?.name || 'Unknown User' }}</span>
        </div>
      </div>
    </div>

    <div class="px-4 py-3 bg-gray-50 flex justify-between items-center gap-2">
      <a v-if="project.file?.fileUrl" :href="project.file.fileUrl" target="_blank" class="flex-1 text-center bg-[#8D7B68] text-white text-xs py-1.5 rounded hover:bg-[#6D5B4B] transition shadow-sm font-bold">
        ดาวน์โหลดไฟล์
      </a>
      <span v-else class="flex-1 text-center text-xs text-gray-300 py-1.5 border border-dashed rounded">ไม่มีไฟล์</span>

      <router-link 
        v-if="isOwner" 
        :to="`/edit/${project._id}`" 
        class="px-3 py-1.5 border border-[#E0D8D0] text-[#8D7B68] text-xs rounded hover:bg-white transition font-bold"
        title="แก้ไข"
      >
          แก้ไข
      </router-link>

      <button 
        v-if="canDelete" 
        @click="$emit('delete', project._id)" 
        class="px-3 py-1.5 border border-red-200 text-red-500 text-xs rounded hover:bg-red-50 transition font-bold"
      >
        ลบโครงงานนี้
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '../stores/userStore';

const props = defineProps({
  project: { type: Object, required: true }
});

const emit = defineEmits(['delete']);
const userStore = useUserStore();

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
};

// ✅ เพิ่มตัวแปร isOwner (ใช้สำหรับปุ่มแก้ไข)
const isOwner = computed(() => {
  // 1. ต้องล็อกอิน และมีข้อมูลเจ้าของ
  if (!userStore.user || !props.project.owner) return false;

  // 2. ถ้าเป็นอาจารย์ ห้ามแก้ไข (ตามโจทย์)
  if (userStore.user.role === 'teacher') return false;

  // 3. ต้องเป็นเจ้าของ ID เดียวกัน
  return userStore.user.id === props.project.owner._id;
});

// ✅ ตัวแปร canDelete (ใช้สำหรับปุ่มลบ) - Logic เดียวกันกับ isOwner
const canDelete = computed(() => {
    return isOwner.value; // เรียกใช้ Logic เดียวกันเลยเพื่อความชัวร์
});
</script>