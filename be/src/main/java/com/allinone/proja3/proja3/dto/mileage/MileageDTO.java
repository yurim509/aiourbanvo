package com.allinone.proja3.proja3.dto.mileage;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MileageDTO {
    private Long mileageId;
    private String dong;
    private String ho;
    private int price;
    private boolean state; // 활성화 상태
    private boolean autopay; // 자동 결제 설정 여부
    private Long cardId; // 카드 정보의 ID, 없을 시 nul


}
