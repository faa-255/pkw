<template>
  <div class="min-h-screen flex flex-col bg-[#F0F9FF] font-sans text-[#1E3A8A]">
    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-8">
      <slot />
    </main>

    <footer class="bg-[#DBEAFE] text-[#1E3A8A] py-6 mt-auto text-center border-t border-[#BFDBFE]">
      <p class="font-bold">ระบบการจัดเก็บโครงงาน</p>
      
      <p class="text-xs text-[#64748B]">ขอบคุณสำหรับการใช้งาน</p>
    </footer>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
</script>