package com.allinone.proja3.proja3.service.facilities;

import com.allinone.proja3.proja3.dto.facilities.GolfDTO;
import com.allinone.proja3.proja3.dto.facilities.GymDTO;
import com.allinone.proja3.proja3.dto.facilities.GymMembershipDTO;
import com.allinone.proja3.proja3.dto.facilities.MembershipPlanDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.facilities.Gym;
import com.allinone.proja3.proja3.model.facilities.GymMembership;
import com.allinone.proja3.proja3.model.facilities.GymParticipant;
import com.allinone.proja3.proja3.model.facilities.MembershipPlan;
import com.allinone.proja3.proja3.model.mileage.Mileage;

import java.util.List;

public interface GymMembershipService {
//    public GymMembership createMembership(GymMembershipDTO gymMembershipDTO );
    public GymMembership toEntity(GymMembershipDTO gymMembershipDTO);
//    public GymMembership createMembership(GymMembershipDTO gymMembershipDTO);
    public GymMembership createGymMembership(User user, Mileage mileage, MembershipPlan plan);
    public MembershipPlan createGymMembershipPlan (String membershipType, int durationMonths, int price);
    public List<MembershipPlan> getAllMembershipPlans();
    void deleteMembership(Long membershipPlanId);
    public GymMembership  purchaseMembership(GymMembershipDTO gymMembershipDTO);
    public MembershipPlan toEntityMembership (MembershipPlanDTO membershipPlanDTO);
    public List<GymMembershipDTO> getUserMemberships (Long uno);








    //    public List<GymDTO> getUserRegisteredPrograms (Long uno);
    // Convert GymMembership entity to GymMembershipDTO
//    default GymMembershipDTO toDto(GymMembership gymMembership) {
//        if (gymMembership == null) {
//            return null;
//        }
//        return GymMembershipDTO.builder()
//                .membershipId(gymMembership.getMembershipId())
//                .uno(gymMembership.getUser().getUno())  // Assuming 'User' has 'uno'
//                .mileageId(gymMembership.getMileage().getMileageId())  // Assuming 'Mileage' has 'mileageId'
//                .membershipType(gymMembership.getMembershipType())
//                .startDate(gymMembership.getStartDate())
//                .endDate(gymMembership.getEndDate())
//                .isOnHold(gymMembership.isOnHold())
//                .amount(gymMembership.getAmount())  // Placeholder for amount
//                .build();
//    }

    // Convert GymMembershipDTO to GymMembership entity
//    default GymMembership toEntity(GymMembershipDTO gymMembershipDTO) {
//        if (gymMembershipDTO == null) {
//            return null;
//        }
//
//
//        GymMembership gymMembership = new GymMembership();
//        gymMembership.setMembershipId(gymMembershipDTO.getMembershipId());

        // You will need to fetch User and Mileage based on the IDs
//         gymMembership.setUser(findUserByUno(gymMembershipDTO.getUno()));
//         gymMembership.setMileage(findMileageById(gymMembershipDTO.getMileageId()));
//        gymMembership.setUser(user);
//        gymMembership.setMileage(mileage);
//
//        gymMembership.setMembershipType(gymMembershipDTO.getMembershipType());
//        gymMembership.setStartDate(gymMembershipDTO.getStartDate());
//        gymMembership.setEndDate(gymMembershipDTO.getEndDate());
//        gymMembership.setAmount(gymMembership.getAmount());
//        gymMembership.setOnHold(gymMembershipDTO.isOnHold());
//
//        return gymMembership;
//    }

}
