<template>
  <MainLayout>
    <div class="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md border border-[#B8E2E3] mt-10">
      <h2 class="text-2xl font-bold text-[#5A7D8B] mb-6 border-b border-[#B8E2E3] pb-4">แก้ไขข้อมูลผู้ใช้งาน</h2>

      <form v-if="!loading" @submit.prevent="updateUser" class="space-y-4">
        
        <div class="flex flex-col items-center mb-6">
           <div class="w-24 h-24 rounded-full bg-[#E0F7FA] border-2 border-[#76C6C8] flex items-center justify-center overflow-hidden relative group shadow-sm">
              <img v-if="previewImage" :src="previewImage" class="w-full h-full object-cover" />
              <div v-else class="text-4xl text-[#76C6C8]">👤</div>
           </div>
           <label class="cursor-pointer mt-3 bg-white border border-[#B8E2E3] text-[#8CA9B8] px-3 py-1 rounded-full text-xs font-bold hover:bg-[#76C6C8] hover:text-white transition shadow-sm">
               เปลี่ยนรูปโปรไฟล์
               <input type="file" @change="handleFile" class="hidden" accept="image/*" />
           </label>
        </div>

        <div>
            <label class="block text-sm font-bold text-[#8CA9B8] mb-1">ชื่อ - นามสกุล</label>
            <input 
                v-model="form.name" 
                type="text" 
                class="w-full p-2.5 border border-[#B8E2E3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#76C6C8] focus:border-[#76C6C8] text-[#5A7D8B]" 
                required 
            />
        </div>

        <div>
            <label class="block text-sm font-bold text-[#8CA9B8] mb-1">Username</label>
            <input 
                v-model="form.username" 
                type="text" 
                class="w-full p-2.5 border border-[#B8E2E3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#76C6C8] focus:border-[#76C6C8] text-[#5A7D8B]" 
                required 
            />
        </div>

        <div>
            <label class="block text-sm font-bold text-[#8CA9B8] mb-1">เปลี่ยนรหัสผ่าน <span class="text-xs font-normal text-gray-400">(เว้นว่างไว้ถ้าไม่เปลี่ยน)</span></label>
            <div class="relative">
                <input 
                    v-model="form.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    class="w-full p-2.5 border border-[#B8E2E3] rounded-lg pr-10 focus:outline-none focus:ring-1 focus:ring-[#76C6C8] focus:border-[#76C6C8] text-[#5A7D8B]" 
                    placeholder="ตั้งรหัสผ่านใหม่..."
                />
                <button 
                    type="button" 
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-[#8CA9B8] hover:text-[#76C6C8] transition"
                >
                    <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                </button>
            </div>
        </div>

        <div>
            <label class="block text-sm font-bold text-[#8CA9B8] mb-1">สถานะ (Role)</label>
            <select v-model="form.role" class="w-full p-2.5 border border-[#B8E2E3] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#76C6C8] focus:border-[#76C6C8] text-[#5A7D8B]">
                <option value="student">นักเรียน (Student)</option>
                <option value="teacher">อาจารย์ (Teacher)</option>
                <option value="admin">ผู้ดูแลระบบ (Admin)</option>
            </select>
        </div>

        <div class="flex gap-3 pt-6">
            <button type="submit" class="flex-1 bg-[#76C6C8] text-white py-2.5 rounded-lg font-bold hover:bg-[#5FAFB1] shadow-md transition">
                บันทึกการแก้ไข
            </button>
            <router-link to="/admin/manage" class="px-6 py-2.5 border border-[#B8E2E3] rounded-lg text-[#8CA9B8] hover:bg-[#F0F8FA] font-bold transition text-center">
                ยกเลิก
            </router-link>
        </div>
      </form>

      <div v-else class="text-center py-20 flex flex-col items-center text-[#8CA9B8]">
          <div class="animate-spin w-8 h-8 border-4 border-[#B8E2E3] border-t-[#8CA9B8] rounded-full mb-3"></div>
          กำลังโหลดข้อมูล...
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../api/axiosClient';
import MainLayout from '../layouts/MainLayout.vue';

const route = useRoute();
const router = useRouter();
const file = ref(null);
const previewImage = ref(null);
const loading = ref(true);
const showPassword = ref(false); // ✅ เพิ่มตัวแปร
const form = reactive({ name: '', username: '', role: '', password: '' });

// ดึงข้อมูลผู้ใช้มาแสดงก่อน
onMounted(async () => {
    try {
        const res = await axios.get(`/auth/users/${route.params.id}`);
        form.name = res.data.name;
        form.username = res.data.username;
        form.role = res.data.role;
        form.password = ''; 
        
        if (res.data.profileImage) {
            previewImage.value = res.data.profileImage;
        }
    } catch (error) {
        console.error(error);
        alert("ไม่พบข้อมูลผู้ใช้งาน หรือเกิดข้อผิดพลาด");
        router.push('/admin/manage');
    } finally {
        loading.value = false;
    }
});

const handleFile = (e) => {
    const selected = e.target.files[0];
    if (selected) {
        file.value = selected;
        previewImage.value = URL.createObjectURL(selected);
    }
};

const updateUser = async () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('username', form.username);
    formData.append('role', form.role);
    
    // ส่งรหัสผ่านไปเฉพาะถ้ามีการกรอก
    if (form.password) {
        formData.append('password', form.password);
    }
    
    if (file.value) {
        formData.append('avatar', file.value);
    }

    try {
        await axios.put(`/auth/users/${route.params.id}`, formData, {
             headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('✅ แก้ไขข้อมูลสำเร็จ!');
        router.push('/admin/manage');
    } catch (error) {
        alert(error.response?.data?.message || 'แก้ไขไม่สำเร็จ');
    }
};
</script>