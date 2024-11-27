package com.allinone.proja3.proja3.model.mileage;

import com.allinone.proja3.proja3.model.User;
import jakarta.persistence.*;
import lombok.*;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class CardInfo{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cardId;

//    @OneToOne(cascade = CascadeType.REMOVE) // User 삭제 시 CardInfo도 함께 삭제
    @OneToOne
    @JoinColumn(name = "uno")
    private User user; // 사용자와의 연관관계 설정

    private String encryptedCardNumber; // 암호화된 카드 번호

    private String cardExpiry; // 카드 유효기간 등 추가 정보
}