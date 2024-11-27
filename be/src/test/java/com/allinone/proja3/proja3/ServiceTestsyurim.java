package com.allinone.proja3.proja3;
import com.allinone.proja3.proja3.dto.facilities.GymDTO;
import com.allinone.proja3.proja3.dto.mileage.CardInfoDTO;
import com.allinone.proja3.proja3.dto.mileage.ManualRequestDTO;
import com.allinone.proja3.proja3.dto.mileage.MileageHistoryDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.UserRole;
import com.allinone.proja3.proja3.model.facilities.Gym;
import com.allinone.proja3.proja3.model.facilities.MembershipPlan;
import com.allinone.proja3.proja3.model.mileage.Mileage;
import com.allinone.proja3.proja3.repository.UserRepository;
import com.allinone.proja3.proja3.repository.facilities.GymRepository;
import com.allinone.proja3.proja3.repository.facilities.MembershipPlanRepository;
import com.allinone.proja3.proja3.service.UserService;
import com.allinone.proja3.proja3.service.facilities.GolfService;
import com.allinone.proja3.proja3.service.facilities.GymService;
import com.allinone.proja3.proja3.service.facilities.StudyService;
import com.allinone.proja3.proja3.service.mileage.MileageService;
import com.allinone.proja3.proja3.service.mileage.PaymentService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class ServiceTestsyurim {
    @Autowired
    private UserService userService;
    @Autowired
    private GolfService golfService;
    @Autowired
    private StudyService studyService;
    @Autowired
    private GymService gymService;
    @Autowired
    private GymRepository gymRepository;
    @Autowired
    private MembershipPlanRepository membershipPlanRepository;
    @Autowired
    private UserRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private  MileageService mileageService;

//    @Test
//    public void insertTest() {
//        for (int i = 0; i < 130; i++) {
//            int randIdx = (int) (Math.random() * 100) + 1;
//            int randho = (int) (Math.random() * 10) + 1;
//            UserDTO userDTO = UserDTO.builder()
//                    .dong(101 + randIdx)
//                    .ho(101 + randho)
//                    .userName("User" + randIdx)
//                    .phone("0101234" + (1000 + randIdx))
//                    .pw("1111")
//                    .delFlag(false)
//                    .build();
//            userService.register(userDTO);
//        }
//    }

    @Test
    public  void insertGymTest() {
        for(int i = 0; i <15; i++) {
            GymDTO gymDTO = GymDTO.builder()
//                    .programId(1L)
                    .title("title"+i)
                    .content("content" +i)
                    .target("타겟"+i)
                    .participantLimit(3)
                    .programStartDate(LocalDate.of(2024, 11, 16))
                    .programEndDate(LocalDate.of(2024, 12, 16))
                    .programStartTime(LocalTime.of(10,30))
                    .programEndTime(LocalTime.of(12,30))
                    .applicationStartDate(LocalDateTime.of(2024, 10, 16, 10, 30))
                    .applicationEndDate(LocalDateTime.of(2024, 12, 30, 18, 30))
                    //.membershipType("Basic")
                    .delFlag(false) // delFlag 값을 설정
//                    .programState(ProgramState.WAITING)
                    .build();
            Gym gym = gymService.dtoToEntity(gymDTO);
            gymService.newProgramPost(gym);
        }
    }
//    @Test
//    public void oneinsert() {
//
//            GolfDTO golfDTO = GolfDTO.builder()
//                    .date(LocalDate.of(2024, 10, 16))
//                    .startTime(LocalTime.of(11, 55, 0))
//                    .endTime(LocalTime.of(13, 55, 0))
//                    .teeBox(12)
//                    .build();
//            golfService.register(golfDTO);
//        }
//    }



//    @Test
//    public void insertTest2() {
//        for (int i = 0; i < 130; i++) {
////            int randIdx = (int) (Math.random() * 100) + 1;
//            int randId = (int) (Math.random() * 10) + 1;
//            GolfDTO golfDTO = GolfDTO.builder()
//                    .date(LocalDate.of(2024, 10, 16))
//                    .startTime(LocalTime.of(11, 55, 0))
//                    .endTime(LocalTime.of(13, 55, 0))
//                    .teeBox(randId)
//                    .build();
//            Golf golf = gymService.dtoToEntity(golf);
//            golfService.register(golfDTO);
//        }
//    }

//    @Test
//    public void insertTest3() {
//        for (int i = 0; i < 50; i++) {
//            int randIdx = (int) (Math.random() * 100) + 1;
//            int randId = (int) (Math.random() * 10) + 1;
////            StudyDTO studyDTO = StudyDTO.builder()
//            GolfDTO golfDTO = GolfDTO.builder()
//                    .date(LocalDate.of(2024, 10, 16))
//                    .startTime(LocalTime.of(11, 55, 0))
//                    .endTime(LocalTime.of(13, 55, 0))
//                    .teeBox(randId)
//                    .build();
//            golfService.register(golfDTO);
//        }
//    }

//    @Test
//    public void getTest1() {
//        GolfDTO golfDTO = GolfDTO.builder()
//                    .userName("홍길동44")
//                    .date(LocalDate.of(2024, 10, 16))
//                    .startTime(LocalTime.of(11, 55, 0))
//                    .endTime(LocalTime.of(13, 55, 0))
//                    .teeBox(12)
//                    .build();
//            golfService.register(golfDTO);
//    }
//
//}

//    @Test
//    public void getTest(){
//        PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
//                .page(1)
//                .size(10)
//                .build();
//        PageResponseDTO<UserDTO> list = userService.getList(pageRequestDTO);
//        list.getDtoList().forEach(System.out::println);
//    }

    @Test
    public void insertRolesAdmin() {
        User userAdmin = User.builder()
                .userName("짜이")
                .phone("55")
                .pw(passwordEncoder.encode("1"))
                .dong("103")
                .ho("400")
                .build();
        userAdmin.addRole(UserRole.USER);
        repository.save(userAdmin);
    }

    @Test
    public void pro() {
        int amount= 8500;
        CardInfoDTO cardInfoDTO = CardInfoDTO.builder()
                .cardExpiry("123")
                .uno(54L)
                .encryptedCardNumber("1233456778941234")
                .build();
        Mileage mileage = Mileage.builder()
                .autopay(false)
                .ho("102")
                .dong("101")
                .price(amount)
                .build();
        ManualRequestDTO manualRequestDTO = ManualRequestDTO.builder()
                .card(cardInfoDTO)
                .mileage(mileageService.getDTO(mileage))
                .paymentAmount(500000)
                .build();
        paymentService.processManualPayment(manualRequestDTO);
        MileageHistoryDTO mileageHistoryDTO = MileageHistoryDTO.builder()
                .uno(54L)
                .timestamp(LocalDateTime.now())
                .amount(amount)
                .description("헬스장 일일이용권이 결제되었습니다.")
                .build();
        paymentService.processUseMileage("101","102", 54L, amount, "헬스장 일일이용권이 결제되었습니다." );
    }

    @Test
    public void deleteTest() {
        // given
        Long membershipPlanId = 1L;
        MembershipPlan plan = membershipPlanRepository.findById(membershipPlanId)
                .orElseThrow(() -> new EntityNotFoundException("Membership plan not found"));

        // when
        plan.setDelFlag(true); // 논리적 삭제 플래그 설정
        membershipPlanRepository.save(plan); // 변경된 엔티티 저장

//        // then
//        assertTrue(plan.isDelFlag()); // 삭제 플래그가 true로 설정되었는지 확인
    }



}
