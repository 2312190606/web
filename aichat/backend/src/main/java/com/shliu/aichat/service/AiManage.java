package com.shliu.aichat.service;

import com.volcengine.ark.runtime.model.bot.completion.chat.BotChatCompletionRequest;
import com.volcengine.ark.runtime.model.bot.completion.chat.BotChatCompletionResult;
import com.volcengine.ark.runtime.model.completion.chat.ChatMessage;
import com.volcengine.ark.runtime.model.completion.chat.ChatMessageRole;
import com.volcengine.ark.runtime.service.ArkService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@Service
public class AiManage {

    private static final Logger logger = LoggerFactory.getLogger(AiManage.class);

    @Resource
    private ArkService arkService;

    public String doChat(String systemPrompt, String userPrompt) {
        final List<ChatMessage> messages = new ArrayList<>();
        final ChatMessage systemMessage = ChatMessage.builder().role(ChatMessageRole.SYSTEM).content(systemPrompt).build();
        final ChatMessage userMessage = ChatMessage.builder().role(ChatMessageRole.USER).content(userPrompt).build();
        messages.add(systemMessage);
        messages.add(userMessage);

//        BotChatCompletionRequest chatCompletionRequest = BotChatCompletionRequest.builder()
//                .botId("bot-20251005202857-74jzd")
//                .messages(messages)
//                .build();
//
//        BotChatCompletionResult chatCompletionResult =  service.createBotChatCompletion(chatCompletionRequest);
//        //chatCompletionResult.getChoices().forEach(choice -> System.out.println(choice.getMessage().getContent()));
//        if(chatCompletionResult.getChoices() == null || chatCompletionResult.getChoices().isEmpty()) {
////            return "没有返回结果";
//            throw new RuntimeException("AI没有返回结果");
//        }
//        return (String)chatCompletionResult.getChoices().get(0).getMessage().getContent();
        return doChat(messages);
    }

    public String doChat(List<ChatMessage> messages) {

        if (messages == null || messages.isEmpty()) {
            return "消息列表为空，无法生成回复";
        }

        try {
            BotChatCompletionRequest chatCompletionRequest = BotChatCompletionRequest.builder()
                    .botId("bot-20251129215651-m7tvh")
                    .messages(messages)
                    .build();

            logger.debug("发送 AI 请求，botId: {}, 消息数量: {}", chatCompletionRequest.getBotId(), messages.size());

            BotChatCompletionResult chatCompletionResult = arkService.createBotChatCompletion(chatCompletionRequest);

            // 不要在这里关闭执行器，否则后续请求会失败
            // arkService.shutdownExecutor();

            if (chatCompletionResult.getChoices() != null && !chatCompletionResult.getChoices().isEmpty()) {
                return (String)chatCompletionResult.getChoices().get(0).getMessage().getContent();
            }

            logger.warn("AI 返回结果为空");
            return "no answer from AI";
        } catch (Exception e) {
            logger.error("调用 AI 服务失败: {}", e.getMessage(), e);
            if (e.getMessage() != null && e.getMessage().contains("401")) {
                throw new RuntimeException("API key 认证失败，请检查 application.yml 中的 ai.apiKey 配置是否正确", e);
            }
            throw new RuntimeException("AI 服务调用失败: " + e.getMessage(), e);
        }
    }
}
