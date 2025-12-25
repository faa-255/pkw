<template>
  <MainLayout>
    <div class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-[#B8E2E3] mt-6">
      <h2 class="text-2xl font-bold text-[#5A7D8B] mb-6 border-b border-[#B8E2E3] pb-2">✏️ แก้ไขโครงงาน</h2>
      
      <form v-if="!loading" @submit.prevent="submitUpdate" class="space-y-5">
        <div>
          <label class="block text-sm font-bold text-[#8CA9B8] mb-1">ชื่อโครงงาน</label>
          <input 
            v-model="form.title" 
            type="text" 
            required 
            class="w-full p-2.5 border border-[#B8E2E3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#76C6C8] focus:border-[#76C6C8] text-[#5A7D8B]" 
          />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-[#8CA9B8] mb-1">หมวดหมู่</label>
            <select v-model="form.category" class="w-full p-2.5 border border-[#B8E2E3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#76C6C8] focus:border-[#76C6C8] text-[#5A7D8B] bg-white">
              <option value="IT">IT</option>
              <option value="Science">วิทยาศาสตร์</option>
              <option value="Business">ธุรกิจ</option>
              <option value="Art">ศิลป์</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-[#8CA9B8] mb-1">ปีการศึกษา</label>
            <input 
                v-model="form.year" 
                type="number" 
                class="w-full p-2.5 border border-[#B8E2E3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#76C6C8] focus:border-[#76C6C8] text-[#5A7D8B]" 
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-[#8CA9B8] mb-1">รายละเอียด</label>
          <textarea 
            v-model="form.description" 
            rows="5" 
            class="w-full p-2.5 border border-[#B8E2E3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#76C6C8] focus:border-[#76C6C8] text-[#5A7D8B]"
          ></textarea>
        </div>

        <div class="bg-[#F0F8FA] p-4 rounded-lg border border-dashed border-[#B8E2E3]">
          <label class="block text-sm font-bold text-[#8CA9B8] mb-1">เปลี่ยนไฟล์แนบ (ถ้าต้องการ)</label>
          <input 
            type="file" 
            @change="handleFile" 
            class="block w-full text-sm text-[#8CA9B8] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#76C6C8] file:text-white hover:file:bg-[#5FAFB1] file:cursor-pointer cursor-pointer"
          />
          <p class="text-xs text-[#8CA9B8] mt-1 italic">* หากไม่เลือกไฟล์ ระบบจะใช้ไฟล์เดิม</p>
        </div>

        <div class="flex gap-4 pt-4">
          <button type="submit" class="flex-1 bg-[#76C6C8] text-white py-2.5 rounded-lg hover:bg-[#5FAFB1] font-bold transition shadow-sm">
            บันทึกการแก้ไข
          </button>
          <router-link :to="`/project/${route.params.id}`" class="px-6 py-2.5 border border-[#B8E2E3] rounded-lg text-[#8CA9B8] font-bold hover:bg-[#F0F8FA] text-center transition">
            ยกเลิก
          </router-link>
        </div>
      </form>

      <div v-else class="text-center py-20 flex flex-col items-center text-[#8CA9B8]">
          <div class="animate-spin w-8 h-8 border-4 border-[#B8E2E3] border-t-[#8CA9B8] rounded-full mb-3"></div>
          กำลังโหลดข้อมูลเดิม...
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from '../api/axiosClient';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';

const route = useRoute();
const router = useRouter();
const file = ref(null);
const loading = ref(true);

const form = reactive({
  title: '', category: '', description: '', year: ''
});

onMounted(async () => {
  try {
    const res = await axios.get(`/projects/${route.params.id}`);
    const data = res.data;
    form.title = data.title;
    form.category = data.category;
    form.description = data.description;
    form.year = data.year;
  } catch (error) {
    router.push('/');
  } finally {
    loading.value = false;
  }
});

const handleFile = (e) => {
  file.value = e.target.files[0];
};

const submitUpdate = async () => {
  const formData = new FormData();
  formData.append('title', form.title);
  formData.append('category', form.category);
  formData.append('description', form.description);
  formData.append('year', form.year);
  
  if (file.value) {
    formData.append('file', file.value);
  }

  try {
    await axios.put(`/projects/${route.params.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    router.push(`/project/${route.params.id}`); 
  } catch (error) {
    console.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการแก้ไข');
  }
};
</script>