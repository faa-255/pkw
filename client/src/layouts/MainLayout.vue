<template>
  <div class="min-h-screen flex flex-col bg-[#F5F5F0] font-sans text-[#5C4033]">
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-8">
      <slot />
    </main>

    <footer class="bg-[#E0D8D0] text-[#5C4033] py-6 mt-auto text-center border-t border-[#d7ccc8]">
      <p class="font-bold">ระบบการจัดเก็บโครงงาน</p>
      <p class="text-xs text-gray-600">ขอบคุณสำหรับการใช้งาน</p>
    </footer>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
</script>