<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex justify-center p-4">
    <div class="w-full max-w-5xl flex gap-4">
      <div class="w-64 bg-white rounded-2xl shadow-lg p-6 h-fit">
        <h2 class="text-xl font-bold text-gray-800 mb-4 pb-3 border-b">历史对话</h2>
        <div class="space-y-2">
          <div
            v-for="room in chatRooms"
            :key="room.id"
            @click="switchRoom(room.id)"
            class="p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50"
            :class="{ 'bg-blue-100': room.id === currentRoomId }"
          >
            <div class="font-medium text-gray-700">对话 {{ room.id }}</div>
          </div>
          <div v-if="chatRooms.length === 0" class="text-gray-400 text-sm text-center py-4">
            暂无历史记录
          </div>
        </div>
      </div>

      <div class="flex-1 bg-white rounded-2xl shadow-lg flex flex-col max-h-screen">
        <div class="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
          <h1 class="text-2xl font-bold text-center">AI 脑筋急转弯</h1>
          <p class="text-center text-blue-100 mt-1">房间号: {{ roomId }}</p>
        </div>

        <div ref="messageContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
          <div v-for="(message, index) in messages" :key="index">
            <div v-if="message.role === 'ai'" class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <span class="text-white text-sm font-bold">AI</span>
              </div>
              <div class="bg-gray-100 rounded-2xl rounded-tl-sm p-4 max-w-lg">
                <p class="text-gray-800 whitespace-pre-wrap">{{ message.content }}</p>
              </div>
            </div>

            <div v-else class="flex items-start gap-3 justify-end">
              <div class="bg-blue-600 rounded-2xl rounded-tr-sm p-4 max-w-lg">
                <p class="text-white whitespace-pre-wrap">{{ message.content }}</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center flex-shrink-0">
                <span class="text-white text-sm font-bold">我</span>
              </div>
            </div>
          </div>

          <div v-if="isLoading" class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <span class="text-white text-sm font-bold">AI</span>
            </div>
            <div class="bg-gray-100 rounded-2xl rounded-tl-sm p-4">
              <div class="flex gap-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t p-6 space-y-4">
          <div class="flex gap-3">
            <button
              @click="sendStart"
              :disabled="gameStarted || isLoading"
              class="px-6 py-2 rounded-xl font-medium transition-all duration-200"
              :class="gameStarted || isLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'"
            >
              开始
            </button>
            <button
              @click="endGame"
              :disabled="gameEnded || !gameStarted || isLoading"
              class="px-6 py-2 rounded-xl font-medium transition-all duration-200"
              :class="gameEnded || !gameStarted || isLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'"
            >
              结束游戏
            </button>
          </div>

          <div class="flex gap-3">
            <input
              v-model="userInput"
              @keyup.enter="sendMessage"
              :disabled="isLoading || gameEnded"
              type="text"
              placeholder="请输入内容"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              @click="sendMessage"
              :disabled="!userInput.trim() || isLoading || gameEnded"
              class="px-8 py-3 rounded-xl font-medium transition-all duration-200"
              :class="!userInput.trim() || isLoading || gameEnded ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { sendChatMessage, getChatRooms } from '../services/api';

interface Message {
  role: 'ai' | 'user';
  content: string;
}

interface ChatRoom {
  id: number;
}

const route = useRoute();
const router = useRouter();
const roomId = ref<number>(Number(route.params.roomId));
const currentRoomId = ref<number>(roomId.value);
const messages = ref<Message[]>([]);
const userInput = ref('');
const isLoading = ref(false);
const gameStarted = ref(false);
const gameEnded = ref(false);
const chatRooms = ref<ChatRoom[]>([]);
const messageContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

const sendStart = async () => {
  if (gameStarted.value || isLoading.value) return;

  await sendChatRequest('开始');
  gameStarted.value = true;
};

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value || gameEnded.value) return;

  const message = userInput.value.trim();
  await sendChatRequest(message);
  userInput.value = '';
};

const sendChatRequest = async (content: string) => {
  messages.value.push({
    role: 'user',
    content,
  });
  scrollToBottom();

  isLoading.value = true;

  try {
    const response = await sendChatMessage(roomId.value, content);

    messages.value.push({
      role: 'ai',
      content: response,
    });

    if (response.includes('游戏已结束')) {
      gameEnded.value = true;
    }

    scrollToBottom();
  } catch (error) {
    console.error('发送消息失败:', error);
    messages.value.push({
      role: 'ai',
      content: '抱歉，发送消息失败，请稍后重试。',
    });
    scrollToBottom();
  } finally {
    isLoading.value = false;
  }
};

const endGame = async () => {
  if (gameEnded.value || !gameStarted.value || isLoading.value) return;

  await sendChatRequest('结束');
};

const loadChatRooms = async () => {
  try {
    const rooms = await getChatRooms();
    chatRooms.value = rooms;
  } catch (error) {
    console.error('加载历史记录失败:', error);
  }
};

const switchRoom = (id: number) => {
  router.push(`/chat/${id}`);
  window.location.reload();
};

onMounted(() => {
  loadChatRooms();
});
</script>
