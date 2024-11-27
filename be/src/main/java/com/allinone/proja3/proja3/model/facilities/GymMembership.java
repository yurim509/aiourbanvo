package com.allinone.proja3.proja3.model.facilities;

import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.mileage.Mileage;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import static com.allinone.proja3.proja3.model.facilities.QGymMembership.gymMembership;

@Entity
@Table(name = "tbl_user_gym_membership")
@Data
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
//사용자 (주민)가 구매한 헬스장 이용권
public class GymMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long membershipId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uno" , referencedColumnName = "uno") // 회원과 연관
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="mileageId" , referencedColumnName ="mileageId") // 마일리지와 연관
    private Mileage mileage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membership_plan_id", referencedColumnName = "membershipPlanId") // 사용자가 선택한 이용권 계획
    private MembershipPlan membershipPlan;

    private LocalDate startDate;
    private LocalDate endDate;



}
