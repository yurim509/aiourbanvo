package com.allinone.proja3.proja3.service.facilities;


import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.facilities.GolfDTO;
import com.allinone.proja3.proja3.dto.facilities.GymDTO;
import com.allinone.proja3.proja3.dto.facilities.GymMembershipDTO;
import com.allinone.proja3.proja3.dto.facilities.MembershipPlanDTO;
import com.allinone.proja3.proja3.dto.mileage.MileageDTO;
import com.allinone.proja3.proja3.dto.user.UserDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.facilities.Gym;
import com.allinone.proja3.proja3.model.facilities.GymMembership;

import com.allinone.proja3.proja3.model.facilities.GymParticipant;
import com.allinone.proja3.proja3.model.facilities.MembershipPlan;
import com.allinone.proja3.proja3.model.mileage.Mileage;
import com.allinone.proja3.proja3.repository.UserRepository;
import com.allinone.proja3.proja3.repository.facilities.GymMembershipRepository;

import com.allinone.proja3.proja3.repository.facilities.GymParticipantRepository;
import com.allinone.proja3.proja3.repository.facilities.MembershipPlanRepository;
import com.allinone.proja3.proja3.repository.mileage.MileageRepository;
import com.allinone.proja3.proja3.service.mileage.MileageService;
import com.allinone.proja3.proja3.service.mileage.PaymentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.lang.reflect.Member;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import static com.allinone.proja3.proja3.model.mileage.QMileage.mileage;

@Service
@Log4j2
@RequiredArgsConstructor
public class GymMembershipServiceImpl implements GymMembershipService {

    @Autowired
    private GymMembershipRepository gymMembershipRepository;
    @Autowired
    private GymParticipantRepository gymParticipantRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MileageRepository mileageRepository;
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private MembershipPlanRepository membershipPlanRepository;
    @Autowired
    private MileageService mileageService;

    private final SmsService smsService;


    //참가자 헬스장 이용권 조회
    public List<GymMembershipDTO> getUserMemberships (Long uno) {
        List<GymMembership> memberships = gymMembershipRepository.findByUserUno(uno);

        return memberships.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }


    private GymMembershipDTO toDTO(GymMembership membership) {
        return GymMembershipDTO.builder()
                .membershipId(membership.getMembershipId())
                .startDate(membership.getStartDate())
                .endDate(membership.getEndDate())
                .membershipType(membership.getMembershipPlan().getMembershipType())
//                .price(membership.getMembershipPlan().getPrice())
//                .durationMonths(membership.getMembershipPlan().getDurationMonths())
                .build();
    }

    //사용자 이용권 결제
    @Override
    public GymMembership purchaseMembership(GymMembershipDTO gymMembershipDTO) {
        GymMembership existingMembership = gymMembershipRepository.findByUserUnoAndEndDateAfter(gymMembershipDTO.getUno(), LocalDate.now());
        // 이미 유효한 이용권이 있으면 예외를 발생
        if (existingMembership != null) {
            throw new IllegalStateException("이미 유효한 이용권이 존재합니다. 이용권이 만료된 후에 다시 시도해 주세요.");
        }
        GymMembership gymMembership = toEntity(gymMembershipDTO);
        String membershipType =gymMembership.getMembershipPlan().getMembershipType();
        int amount = gymMembership.getMembershipPlan().getPrice();
        String description = "헬스장 이용권 결제 (" +membershipType+") : "+ amount+"원";
        Long uno = gymMembership.getUser().getUno();
        String dong = gymMembership.getUser().getDong();
        String ho = gymMembership.getUser().getHo();

        // 랜덤한 입장 코드 생성
       int accessCode = (int) (Math.random() * 90000) + 10000;
        System.out.println(accessCode);

//        헬스장 이용권 정보와 입장코드를 생성하여  메시지 전송
//            String messageText ="안녕하세요! " + gymMembership.getUser().getUserName()+"님, 헬스장(" +membershipType+") 이용권이 구매 완료되었습니다."
//                    +gymMembership.getStartDate()+" 부터 " +gymMembership.getEndDate()+"까지 이용가능하며, 귀하의 입장 코드는 "+accessCode+" 입니다. 이용해주셔서 감사합니다.";
//
//            System.out.println("1212"+messageText);
//            smsService.sendConfirmationMessage(gymMembership.getUser().getPhone(), messageText);


        paymentService.processUseMileage(dong, ho, uno, amount, description);

        log.info("Regular Payment / dong:{}, ho:{}, amount:{}", dong, ho, amount);
        return gymMembershipRepository.save(gymMembership);
    }

    //사용자 이용권 결제
//    @Override
//    public GymMembership purchaseMembership(GymMembershipDTO gymMembershipDTO) {
//        GymMembership gymMembership = toEntity(gymMembershipDTO);
//        String membershipType =gymMembership.getMembershipPlan().getMembershipType();
//        int amount = gymMembership.getMembershipPlan().getPrice();
//        String description = "헬스장 이용권 결제 (" +membershipType+") : "+ amount+"원";
//        Long uno = gymMembership.getUser().getUno();
//        String dong = gymMembership.getUser().getDong();
//        String ho = gymMembership.getUser().getHo();
//
//        int accessCode = (int) (Math.random() * 90000) + 10000;
//        System.out.println(accessCode);
//
////        헬스장 이용권 정보와 입장코드를 생성하여  메시지 전송
////            String messageText ="안녕하세요! " + gymMembership.getUser().getUserName()+"님, 헬스장(" +membershipType+") 이용권이 구매 완료되었습니다."
////                    +gymMembership.getStartDate()+" 부터 " +gymMembership.getEndDate()+"까지 이용가능하며, 귀하의 입장 코드는 "+accessCode+" 입니다. 이용해주셔서 감사합니다.";
////
////            System.out.println("1212"+messageText);
////            smsService.sendConfirmationMessage(gymMembership.getUser().getPhone(), messageText);
//
//
//        paymentService.processUseMileage(dong, ho, uno, amount, description);
//
//        log.info("Regular Payment / dong:{}, ho:{}, amount:{}", dong, ho, amount);
//        return gymMembershipRepository.save(gymMembership);
//    }



    @Override
    public GymMembership toEntity(GymMembershipDTO gymMembershipDTO) {
        // DTO에서 User와 Mileage를 가져오는 로직을 구현
        User user = userRepository.findById(gymMembershipDTO.getUno())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Mileage mileage = mileageRepository.findById(gymMembershipDTO.getMileageId())
                .orElseThrow(() -> new RuntimeException("Mileage not found"));
        MembershipPlan membershipPlan = membershipPlanRepository.findById(gymMembershipDTO.getMembershipPlanId())
                .orElseThrow(() -> new RuntimeException("Membership Plan not found"));

        // GymMembership 엔티티 생성
        GymMembership gymMembership = new GymMembership();
        gymMembership.setUser(user);
        gymMembership.setMileage(mileage);
        gymMembership.setMembershipPlan(membershipPlan);
        gymMembership.setStartDate(gymMembershipDTO.getStartDate());
        gymMembership.setEndDate(gymMembershipDTO.getEndDate());
//        gymMembership.setOnHold(gymMembershipDTO.isOnHold());

        return gymMembership;
    }
    //관리자가 이용권 생성하는 메서드
    @Override
    public MembershipPlan createGymMembershipPlan (String membershipType, int durationMonths, int price) {
        //이용권 계획 생성
        MembershipPlan membershipPlan = MembershipPlan.builder()
                .membershipType(membershipType)
                .durationMonths(durationMonths)
                .price(price)
                .build();

        membershipPlanRepository.save(membershipPlan);

        return  membershipPlan;
    }


    @Override
    //( 관리자가 등록한 이용권을 사용자에게 연결해줌)
    public GymMembership createGymMembership(User user, Mileage mileage, MembershipPlan plan) {
        // 사용자가 이용권을 구매한 시점인 현재 날짜를 시작 날짜로 설정
        LocalDate startDate = LocalDate.now();

        // 이용권의 기간을 기준으로 종료 날짜를 계산 (관리자가 설정한 기간을 사용)
        LocalDate endDate = startDate.plusMonths(plan.getDurationMonths());

        GymMembership gymMembership = GymMembership.builder()
                .user(user)
                .mileage(mileage)
                .membershipPlan(plan) // 선택한 이용권 계획
                .startDate(startDate)
                .endDate(endDate)
                .build(); // GymMembership 객체 생성

        // 데이터베이스에 저장
        gymMembershipRepository.save(gymMembership);

        return gymMembership;
    }
    //삭제된 이용권 제외하고 조회
    @Override
    public List<MembershipPlan> getAllMembershipPlans() {
        // 모든 이용권 목록을 가져와서 반환
        return membershipPlanRepository.findByDelFlagFalse();
    }



    @Override
    public void deleteMembership(Long membershipPlanId) {
        MembershipPlan plan = membershipPlanRepository.findById(membershipPlanId)
                .orElseThrow(()-> new EntityNotFoundException("Membership plan not found"));
        plan.setDelFlag(true);
        membershipPlanRepository.save(plan);
        // 로그 추가
        log.info("Membership plan with ID {} has been logically deleted.", membershipPlanId);
    }


    @Override
    public MembershipPlan toEntityMembership(MembershipPlanDTO membershipPlanDTO) {
        MembershipPlan membershipPlan = membershipPlanRepository.findById(membershipPlanDTO.getMembershipPlanId())
                .orElseThrow(() -> new EntityNotFoundException("Membership Plan not found"));

        membershipPlan.setDelFlag(membershipPlanDTO.isDelFlag()); // 논리적 삭제 플래그 설정
        membershipPlan.setMembershipType(membershipPlanDTO.getMembershipType());
        membershipPlan.setDurationMonths(membershipPlanDTO.getDurationMonths());
        membershipPlan.setPrice(membershipPlanDTO.getPrice());

        return membershipPlan;
    }



    //관리자 삭제된 데이터도 확인 조회 필요시 사용
//    @Override
//    public List<MembershipPlan> getAllMembershipPlans(boolean includeDeleted) {
//        if (includeDeleted) {
//            return membershipPlanRepository.findAll();
//        } else {
//            return membershipPlanRepository.findByIsDeletedFalse();
//        }
//    }


}