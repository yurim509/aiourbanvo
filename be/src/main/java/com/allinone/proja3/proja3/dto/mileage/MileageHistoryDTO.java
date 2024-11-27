package com.allinone.proja3.proja3.dto.mileage;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MileageHistoryDTO {
    private Long mileageId;
    private Long uno; // 사용자의 고유 ID
    private String name; // 사용자의 name (엔터티 내에는 없는정보 user정보를 끌어와야함.)
    private String type; // "+", "-"로 마일리지 증감 여부
    private int amount; // 변경된 마일리지 금액
    private int balance; // 잔액
    private String description;
    private LocalDateTime timestamp;
}
