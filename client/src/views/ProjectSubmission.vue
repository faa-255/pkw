<template>
  <MainLayout>
    <div class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-[#B8E2E3]">
      <h2 class="text-xl font-bold text-[#5A7D8B] mb-6 border-b border-[#B8E2E3] pb-2">เพิ่มโครงงานใหม่</h2>
      
      <form @submit.prevent="submitForm" class="space-y-5">
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
            <label class="block text-sm font-bold text-[#8CA9B8] mb-1">ประเภทโครงงาน</label>
            <select v-model="form.category" class="w-full p-2.5 border border-[#B8E2E3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#76C6C8] focus:border-[#76C6C8] text-[#5A7D8B] bg-white">
              <option value="IT">IT</option>
              <option value="Science">วิทยาศาสตร์</option>
              <option value="Business">บริหารธุรกิจ</option>
              <option value="Art">ศิลปศาสตร์</option>
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
          <label class="block text-sm font-bold text-[#8CA9B8] mb-1">รายละเอียดโดยย่อ</label>
          <textarea 
            v-model="form.description" 
            rows="4" 
            class="w-full p-2.5 border border-[#B8E2E3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#76C6C8] focus:border-[#76C6C8] text-[#5A7D8B]"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-bold text-[#8CA9B8] mb-1">ไฟล์แนบ(PDF/Image)</label>
          <input 
            type="file" 
            @change="handleFile" 
            class="block w-full text-sm text-[#8CA9B8] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#E0F7FA] file:text-[#5A7D8B] hover:file:bg-[#B8E2E3] cursor-pointer"
          />
        </div>

        <div class="flex gap-4 pt-4">
          <button type="submit" class="flex-1 bg-[#76C6C8] text-white py-2.5 rounded-lg hover:bg-[#5FAFB1] font-bold transition shadow-sm">บันทึกข้อมูล</button>
          <router-link to="/" class="px-6 py-2.5 border border-[#B8E2E3] rounded-lg text-[#8CA9B8] hover:bg-[#F0F8FA] font-bold text-center transition">ยกเลิก</router-link>
        </div>
      </form>
    </div>
  </MainLayout>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from '../api/axiosClient';
import { useRouter } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';

const router = useRouter();
const file = ref(null);
const form = reactive({
  title: '', category: 'IT', description: '', year: new Date().getFullYear()
});

const handleFile = (e) => {
  file.value = e.target.files[0];
};

const submitForm = async () => {
  const formData = new FormData();
  // Loop append ข้อมูล
  for (const key in form) {
    formData.append(key, form[key]);
  }
  if (file.value) {
    formData.append('file', file.value);
  }

  try {
    await axios.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    router.push('/');
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
  }
};
</script>