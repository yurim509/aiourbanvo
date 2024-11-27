package com.allinone.proja3.proja3.dto.community;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatDTO {
    private Long productId;      // 관련 상품 ID
    private Long senderId;       // 발신자 ID
    private Long recipientId;     // 수신자 ID
    private String senderName;
    private String recipientName;
    private String message;      // 메시지 내용
    private LocalDateTime timestamp; // 메시지 전송 시간
}
