<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-3xl shadow-2xl p-12 text-center">
        <h1 class="text-5xl font-bold text-gray-800 mb-16">
          AI 脑筋急转弯
        </h1>
        <button
          @click="startGame"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold py-5 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          开始游戏
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const startGame = () => {
  const roomId = Math.floor(Math.random() * 1000000);
  router.push(`/chat/${roomId}`);
};
</script>
