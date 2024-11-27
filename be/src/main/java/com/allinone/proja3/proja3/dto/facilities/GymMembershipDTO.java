package com.allinone.proja3.proja3.dto.facilities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GymMembershipDTO {
    private Long membershipId;
    private Long uno;  // Instead of embedding the full User object
    private Long mileageId;  // Instead of embedding the full Mileage object
    private LocalDate startDate;
    private LocalDate endDate;
//    private boolean isOnHold;
    private Long membershipPlanId;
    private String membershipType;





}
