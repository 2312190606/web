package com.shliu.aichat.config;

import com.volcengine.ark.runtime.service.ArkService;
import okhttp3.ConnectionPool;
import okhttp3.Dispatcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class AiConfig {

    private static final Logger logger = LoggerFactory.getLogger(AiConfig.class);

    @Value("${ai.apiKey}")
    String apiKey;

    @Bean
    public ArkService arkService() {
        // 检查 API key 是否正确读取
        if (apiKey == null || apiKey.trim().isEmpty()) {
            logger.error("API key 未配置或为空！请检查 application.yml 中的 ai.apiKey 配置");
            throw new IllegalStateException("API key 未配置");
        }
        
        logger.info("正在初始化 ArkService，API key 长度: {}", apiKey.length());
        logger.debug("API key 前缀: {}", apiKey.length() > 10 ? apiKey.substring(0, 10) + "..." : apiKey);
        
        ConnectionPool connectionPool = new ConnectionPool(5, 1, TimeUnit.SECONDS);
        Dispatcher dispatcher = new Dispatcher();

        return ArkService.builder().dispatcher(dispatcher)
                .connectionPool(connectionPool)
                .baseUrl("https://ark.cn-beijing.volces.com/api/v3/")
                .apiKey(apiKey).build();
    }
}
