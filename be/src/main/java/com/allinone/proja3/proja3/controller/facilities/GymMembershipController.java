package com.allinone.proja3.proja3.controller.facilities;

import com.allinone.proja3.proja3.dto.facilities.GymDTO;
import com.allinone.proja3.proja3.dto.facilities.GymMembershipDTO;
import com.allinone.proja3.proja3.dto.facilities.MembershipPlanDTO;
import com.allinone.proja3.proja3.dto.user.UserDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.facilities.GymMembership;
import com.allinone.proja3.proja3.model.facilities.MembershipPlan;
import com.allinone.proja3.proja3.model.mileage.Mileage;
import com.allinone.proja3.proja3.repository.UserRepository;
import com.allinone.proja3.proja3.repository.mileage.MileageRepository;
import com.allinone.proja3.proja3.service.UserService;
import com.allinone.proja3.proja3.service.facilities.GymMembershipService;
import com.allinone.proja3.proja3.service.mileage.PaymentService;
import com.allinone.proja3.proja3.service.mileage.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Make sure frontend is running on port 3000
@RequestMapping("/api/facilities/gym")
@Log4j2
public class GymMembershipController {

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private  GymMembershipService gymMembershipService;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MileageRepository mileageRepository;


    //관리자가 이용권 등록하는 로직
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/membership/create/admin")
    public ResponseEntity<MembershipPlan> createGymMembership (
            @RequestBody MembershipPlanDTO membershipPlanDTO) {  // RequestBody 사용
        try {
            MembershipPlan newPlan = gymMembershipService.createGymMembershipPlan(
                    membershipPlanDTO.getMembershipType(),
                    membershipPlanDTO.getDurationMonths(),
                    membershipPlanDTO.getPrice()
            );
            System.out.println("101010:" + newPlan);
            return ResponseEntity.ok(newPlan);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    //관리자가 등록한 이용권 삭제
//    @PostMapping("/membership/delete/{membershipPlanId}")
    @DeleteMapping("/membership/delete/{membershipPlanId}")
    public ResponseEntity<String> deleteMembership(@PathVariable Long membershipPlanId) {
        try {
            gymMembershipService.deleteMembership(membershipPlanId); // 서비스 호출
            return ResponseEntity.ok("이용권이 삭제되었습니다.");
        } catch (Exception e) {
            System.out.println("121212:"+ e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 중 오류가 발생했습니다.");
        }
    }

//     사용자가 이용권을 구매하는 API
//    @PostMapping("/membership/purchase")
//    public ResponseEntity<GymMembership> purchaseGymMembership(
//            @RequestBody GymMembershipDTO gymMembershipDTO){
//        try {
//            System.out.println("sss"+gymMembershipDTO);
//            GymMembership gymMembership = gymMembershipService.purchaseMembership(gymMembershipDTO);
//            return ResponseEntity.ok(gymMembership);
//        }catch (Exception e) {
//            System.out.println("sss"+gymMembershipDTO);
//            return ResponseEntity.status(500).body(null);
//        }
//    }
    @PostMapping("/membership/purchase")
    public ResponseEntity<String> purchaseGymMembership(
            @RequestBody GymMembershipDTO gymMembershipDTO){
        try {
            System.out.println("sss" + gymMembershipDTO);
            GymMembership gymMembership = gymMembershipService.purchaseMembership(gymMembershipDTO);
            return new ResponseEntity<>("M001",HttpStatus.OK);
        }catch (IllegalStateException e) {
            return new ResponseEntity<>("M002", HttpStatus.OK);
        }catch (Exception e) {
            // 예기치 않은 오류 발생 시 500 상태 코드와 메시지 반환
            return new ResponseEntity<>("M003", HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
    //등록한 이용권 반환하기(조회)
    @GetMapping("/membership/plans")
    public ResponseEntity<List<MembershipPlan>> getAllMembershipPlans() {
        List<MembershipPlan> plans = gymMembershipService.getAllMembershipPlans(); // 모든 이용권 가져오기
        return ResponseEntity.ok(plans); // JSON 응답 반환
    }

    //사용자의 멤버쉽 조회하기
    @GetMapping("/myPage/membership/{uno}")
    public ResponseEntity<List<GymMembershipDTO>> getUserMemberships(@PathVariable Long uno) {
        System.out.println("membership 1121"+uno);
        List<GymMembershipDTO> memberships = gymMembershipService.getUserMemberships(uno);
        return ResponseEntity.ok(memberships);
    }


    //삭제한 이용권 반환 (조회) 관리자용 필요시 사용
//    @GetMapping("/membership/plans/admin")
//    public ResponseEntity<List<MembershipPlan>> getAllMembershipPlansForAdmin(@RequestParam(defaultValue = "false") boolean includeDeleted) {
//        List<MembershipPlan> plans = gymMembershipService.getAllMembershipPlans(includeDeleted);
//        return ResponseEntity.ok(plans);
//    }


}
