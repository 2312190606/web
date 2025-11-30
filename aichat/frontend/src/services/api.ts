import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ChatRoom {
  id: number;
}

export const sendChatMessage = async (roomId: number, userPrompt: string): Promise<string> => {
  const response = await apiClient.post(`/${roomId}/chat`, null, {
    params: {
      userPrompt,
    },
  });
  return response.data;
};

export const getChatRooms = async (): Promise<ChatRoom[]> => {
  const response = await apiClient.get<ChatRoom[]>('/rooms');
  return response.data;
};
