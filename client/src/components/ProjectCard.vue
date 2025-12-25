<template>
  <div 
    @click="$emit('view', project)"
    class="bg-white rounded-lg shadow-sm border border-[#E0D8D0] hover:shadow-md hover:border-[#8D7B68] transition-all duration-300 flex flex-col h-full cursor-pointer group relative overflow-hidden"
  >
    <div :class="categoryColor" class="absolute left-0 top-0 bottom-0 w-1.5"></div>

    <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-start pl-6">
      <div class="flex-1 pr-2">
         <span class="text-[10px] font-bold tracking-wider uppercase text-gray-400">
           {{ project.category }}
         </span>
         <h3 class="text-lg font-bold text-[#5C4033] leading-tight group-hover:text-[#8D7B68] transition mt-1 line-clamp-2">
           {{ project.title }}
         </h3>
      </div>
      <span class="text-[10px] text-gray-400 font-medium whitespace-nowrap mt-0.5 bg-gray-50 px-1.5 py-0.5 rounded">
        {{ formatDate(project.createdAt) }}
      </span>
    </div>

    <div class="p-5 pl-6 flex-1 flex flex-col">
      <p class="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed font-light">
        {{ project.description }}
      </p>
      
      <div class="mt-auto pt-3 border-t border-gray-50" @click.stop>
        <router-link 
            :to="`/?userId=${project.owner?._id}`"
            class="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-1 -ml-1 transition pr-2 group/owner"
            title="คลิกเพื่อดูผลงานทั้งหมดของคนนี้"
        >
            <img 
                v-if="project.owner?.profileImage" 
                :src="project.owner.profileImage" 
                class="w-8 h-8 rounded-full object-cover border border-gray-200 group-hover/owner:border-[#76C6C8]"
            />
            <div v-else class="w-8 h-8 rounded-full bg-[#E0D8D0] text-[#5C4033] flex items-center justify-center text-xs font-bold group-hover/owner:bg-[#E0F7FA] group-hover/owner:text-[#76C6C8]">
               {{ project.owner?.username?.charAt(0).toUpperCase() || '?' }}
            </div>

            <div class="flex flex-col">
                <span class="text-[10px] text-gray-400 font-medium uppercase">ผู้จัดทำ</span>
                <span class="text-xs font-bold text-[#5C4033] group-hover/owner:text-[#76C6C8] transition">
                    {{ project.owner?.name || 'ไม่ระบุตัวตน' }}
                </span>
            </div>
        </router-link>
      </div>
    </div>
    
    <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition text-[#8D7B68] text-xs font-bold flex items-center gap-1">
        คลิกเพื่อดูรายละเอียด ↗
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  project: { type: Object, required: true }
});

const emit = defineEmits(['view']);

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
};

const categoryColor = computed(() => {
    switch(props.project.category) {
        case 'IT': return 'bg-[#97C8EB]'; 
        case 'Science': return 'bg-[#76C6C8]'; 
        case 'Business': return 'bg-[#8CA9B8]'; 
        case 'Art': return 'bg-[#92D2CD]'; 
        default: return 'bg-[#B8E2E3]'; 
    }
});
</script>