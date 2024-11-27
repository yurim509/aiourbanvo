package com.allinone.proja3.proja3.model.facilities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_membership_plan")
@Data
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
//관리자 헬스장 이용권 등록시
public class MembershipPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long membershipPlanId;

    private String membershipType; // 예: 1개월권, 6개월권, 1년권
    private int price; // 가격
    private int durationMonths; // 기간(개월)

    @Builder.Default
    private boolean delFlag = false; // 삭제 여부 플래그 (기본값: false)
}
