<template>
  <MainLayout>
    <div class="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-[#BFDBFE] mt-10">
      
      <h2 class="text-2xl font-bold text-[#1E3A8A] mb-6 flex items-center gap-2">
        {{ isEditMode ? '✏️ แก้ไขข้อมูลผู้ใช้งาน' : '➕ เพิ่มผู้ใช้งานใหม่' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        
        <div class="flex flex-col items-center mb-6">
           <div 
             @click="triggerFileInput" 
             class="w-24 h-24 rounded-full bg-[#EFF6FF] border-2 border-dashed border-[#60A5FA] flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-[#2563EB] hover:bg-[#DBEAFE] transition duration-300"
           >
              <img v-if="newImagePreview" :src="newImagePreview" class="w-full h-full object-cover" />
              <img v-else-if="existingImageUrl" :src="existingImageUrl" class="w-full h-full object-cover" />
              <span v-else class="text-3xl text-[#93C5FD] group-hover:scale-110 transition">👤</span>

              <input 
                 ref="fileInputRef" 
                 type="file" 
                 @change="handleFileChange" 
                 class="hidden" 
                 accept="image/*" 
              />
           </div>

           <p 
             @click="triggerFileInput" 
             class="text-xs text-gray-500 mt-3 cursor-pointer hover:text-[#2563EB] hover:underline transition"
           >
             {{ isEditMode ? 'คลิกเพื่อเปลี่ยนรูปโปรไฟล์' : 'คลิกเพื่ออัปโหลดรูปโปรไฟล์' }}
           </p>
        </div>

        <div>
            <label class="block text-sm font-bold text-[#1E3A8A] mb-1">ชื่อ - นามสกุล</label>
            <input 
              v-model="form.name" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-[#BFDBFE] outline-none transition" 
              required 
              placeholder="เช่น ครูสมศรี ใจดี" 
            />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-bold text-[#1E3A8A] mb-1">Username</label>
                <input 
                  v-model="form.username" 
                  type="text" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-[#BFDBFE] outline-none disabled:bg-gray-100 disabled:text-gray-500" 
                  :disabled="isEditMode" 
                  required 
                />
            </div>
            
            <div>
                <label class="block text-sm font-bold text-[#1E3A8A] mb-1">
                    Password 
                    <span v-if="isEditMode" class="text-xs font-normal text-gray-400">(เว้นว่างหากไม่เปลี่ยน)</span>
                </label>
                <input 
                  v-model="form.password" 
                  type="password" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-[#BFDBFE] outline-none" 
                  :required="!isEditMode" 
                  placeholder="••••••"
                />
            </div>
        </div>

        <div>
            <label class="block text-sm font-bold text-[#1E3A8A] mb-1">สถานะ (Role)</label>
            <div class="relative">
                <select v-model="form.role" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-[#BFDBFE] outline-none bg-white appearance-none cursor-pointer">
                    <option value="student">👨‍🎓 นักเรียน (Student)</option>
                    <option value="teacher">👨‍🏫 ครูที่ปรึกษา (Teacher)</option>
                    <option value="admin">🛠️ ผู้ดูแลระบบ (Admin)</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
        </div>

        <div class="flex gap-3 pt-6">
            <button type="submit" class="flex-1 bg-[#2563EB] text-white py-2.5 rounded-lg font-bold hover:bg-[#1D4ED8] shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5">
                {{ isEditMode ? 'บันทึกการแก้ไข' : 'ยืนยันการเพิ่มข้อมูล' }}
            </button>
            <router-link to="/admin/manage" class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#1E3A8A] font-bold transition">
                ยกเลิก
            </router-link>
        </div>
      </form>
    </div>
  </MainLayout>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from '../api/axiosClient';
import MainLayout from '../layouts/MainLayout.vue';

const router = useRouter();
const route = useRoute();
const fileInputRef = ref(null);

const userId = route.params.id;
const isEditMode = computed(() => !!userId);

const file = ref(null);
const newImagePreview = ref(null);
const existingImageUrl = ref(null);

const BASE_IMAGE_URL = import.meta.env.VITE_API_BASE_URL 
    ? `${import.meta.env.VITE_API_BASE_URL}/uploads/` 
    : 'http://localhost:3000/uploads/'; 

const form = reactive({
    name: '',
    username: '',
    password: '',
    role: 'student'
});

onMounted(async () => {
    if (isEditMode.value) {
        try {
            const res = await axios.get(`/users/${userId}`);
            const user = res.data;
            
            form.name = user.name;
            form.username = user.username;
            form.role = user.role;
            
            if (user.image) {
                existingImageUrl.value = BASE_IMAGE_URL + user.image;
            }
        } catch (error) {
            console.error(error);
            alert('ไม่สามารถดึงข้อมูลผู้ใช้งานได้');
            router.push('/admin/manage');
        }
    }
});

const triggerFileInput = () => {
    fileInputRef.value.click();
};

const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
        file.value = selected;
        newImagePreview.value = URL.createObjectURL(selected);
    }
};

const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('role', form.role);

    if (form.password) {
        formData.append('password', form.password);
    }

    if (file.value) {
        formData.append('avatar', file.value);
    }

    try {
        if (isEditMode.value) {
            await axios.put(`/users/${userId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('✅ แก้ไขข้อมูลเรียบร้อยแล้ว');
        } else {
            formData.append('username', form.username);
            if (!form.password) {
                alert('กรุณากำหนดรหัสผ่าน');
                return;
            }
            await axios.post('/users', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('✅ เพิ่มผู้ใช้งานเรียบร้อยแล้ว');
        }
        router.push('/admin/manage');
    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'ทำรายการไม่สำเร็จ โปรดลองใหม่');
    }
};
</script>