package com.allinone.proja3.proja3.dto.mileage;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CardInfoDTO {
    private Long cardId;
    private Long uno;
    private String encryptedCardNumber;
    private String cardExpiry;
}
