package com.shliu.aichat.model;

import com.volcengine.ark.runtime.model.completion.chat.ChatMessage;
import lombok.Data;
import lombok.Setter;

import java.util.List;

@Data
public class ChatRoom {
    private Long roomId;
    @Setter
    private List<ChatMessage> chatMessages;

}
