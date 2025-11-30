package com.shliu.aichat.service;

import com.shliu.aichat.model.ChatRoom;

import java.util.List;

public interface ChatService {

    //实现用户与ai聊天；
    String doChat(long roomId, String userPrompt);
    //返回对话列表；
    List<ChatRoom> getChatRoomList();
}
