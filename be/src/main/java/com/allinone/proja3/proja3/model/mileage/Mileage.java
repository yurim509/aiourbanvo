package com.allinone.proja3.proja3.model.mileage;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Mileage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mileageId; // 고유 식별자

    @Column(nullable = false)
    private String dong;

    @Column(nullable = false)
    private String ho;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private boolean state = true;
    // true일 때만 활성화된 마일리지

    private boolean autopay; // 자동결제 설정

    //@OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true) // cardid 삭제시 , null로 처리
    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "card_id")
    private CardInfo cardInfo; // 카드 정보와 연관관계 설정


    // 마일리지 상태 확인 메소드 (Optional)
    public boolean isActive() {
        return state;
    }

    public boolean isAutopay() {return autopay;}

    // CardInfo를 제거하는 메서드
    public void removeCardInfo() {
        this.cardInfo = null;
    }
}
