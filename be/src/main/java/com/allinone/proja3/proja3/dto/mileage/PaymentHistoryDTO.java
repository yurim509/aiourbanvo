package com.allinone.proja3.proja3.dto.mileage;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaymentHistoryDTO {
    private Long paymentId;
    private Long uno; // 사용자 고유 ID
    private String userName;
    private Long cardId; // 카드 고유 ID
    private String dong;
    private String ho;
    private int price;
    private LocalDateTime timestamp;
}
