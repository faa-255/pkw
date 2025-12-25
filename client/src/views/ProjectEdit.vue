<template>
  <MainLayout>
    <div class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-[#E0D8D0] mt-6">
      <h2 class="text-2xl font-bold text-[#5C4033] mb-6 border-b pb-2">✏️ แก้ไขโครงงาน</h2>
      
      <form v-if="!loading" @submit.prevent="submitUpdate" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-[#5C4033] mb-1">ชื่อโครงงาน</label>
          <input v-model="form.title" type="text" required class="w-full p-2 border border-[#E0D8D0] rounded focus:border-[#8D7B68] outline-none" />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-[#5C4033] mb-1">หมวดหมู่</label>
            <select v-model="form.category" class="w-full p-2 border border-[#E0D8D0] rounded">
              <option value="IT">IT / Software</option>
              <option value="Science">วิทยาศาสตร์</option>
              <option value="Business">บริหารธุรกิจ</option>
              <option value="Art">ศิลปศาสตร์</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-[#5C4033] mb-1">ปีการศึกษา</label>
            <input v-model="form.year" type="number" class="w-full p-2 border border-[#E0D8D0] rounded" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-[#5C4033] mb-1">รายละเอียด</label>
          <textarea v-model="form.description" rows="5" class="w-full p-2 border border-[#E0D8D0] rounded focus:border-[#8D7B68] outline-none"></textarea>
        </div>

        <div class="bg-gray-50 p-4 rounded border border-dashed border-gray-300">
          <label class="block text-sm font-medium text-[#5C4033] mb-1">เปลี่ยนไฟล์แนบ (ถ้าต้องการ)</label>
          <input type="file" @change="handleFile" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#8D7B68] file:text-white hover:file:bg-[#6D5B4B]"/>
          <p class="text-xs text-gray-400 mt-1">* หากไม่เลือกไฟล์ ระบบจะใช้ไฟล์เดิม</p>
        </div>

        <div class="flex gap-4 pt-4">
          <button type="submit" class="flex-1 bg-[#8D7B68] text-white py-2 rounded-lg hover:bg-[#5C4033] font-bold transition">
            บันทึกการแก้ไข
          </button>
          <router-link :to="`/project/${route.params.id}`" class="px-6 py-2 border border-[#E0D8D0] rounded-lg text-gray-500 hover:bg-gray-50 text-center">
            ยกเลิก
          </router-link>
        </div>
      </form>

      <div v-else class="text-center py-10 text-gray-400">กำลังโหลดข้อมูลเดิม...</div>
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

// ดึงข้อมูลเก่ามาแสดง
onMounted(async () => {
  try {
    const res = await axios.get(`/projects/${route.params.id}`);
    const data = res.data;
    form.title = data.title;
    form.category = data.category;
    form.description = data.description;
    form.year = data.year;
  } catch (error) {
    alert('ไม่พบข้อมูลโครงงาน');
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
    // ใช้ PUT แทน POST
    await axios.put(`/projects/${route.params.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert('แก้ไขข้อมูลสำเร็จ!');
    router.push(`/project/${route.params.id}`); // กลับไปหน้า Detail
  } catch (error) {
    alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการแก้ไข');
  }
};
</script>