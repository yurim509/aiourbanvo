package com.allinone.proja3.proja3.mileage;

import com.allinone.proja3.proja3.dto.mileage.CardInfoDTO;
import com.allinone.proja3.proja3.dto.mileage.ManualRequestDTO;
import com.allinone.proja3.proja3.dto.mileage.MileageDTO;
import com.allinone.proja3.proja3.dto.mileage.MileageHistoryDTO;
import com.allinone.proja3.proja3.dto.parking.HouseholdDTO;
import com.allinone.proja3.proja3.dto.parking.RegularParkingDTO;
import com.allinone.proja3.proja3.dto.user.UserDTO;
import com.allinone.proja3.proja3.model.mileage.CardInfo;
import com.allinone.proja3.proja3.model.mileage.Mileage;
import com.allinone.proja3.proja3.model.parking.Household;
import com.allinone.proja3.proja3.model.parking.HouseholdPK;
import com.allinone.proja3.proja3.repository.UserRepository;
import com.allinone.proja3.proja3.service.UserService;
import com.allinone.proja3.proja3.service.mileage.CardInfoService;
import com.allinone.proja3.proja3.service.mileage.MileageService;
import com.allinone.proja3.proja3.service.mileage.PaymentService;
import com.allinone.proja3.proja3.service.parking.RegularParkingScheduler;
import com.allinone.proja3.proja3.service.parking.RegularParkingService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;

@SpringBootTest
public class PaymentServiceTests {
    private static final Logger log = LoggerFactory.getLogger(PaymentServiceTests.class);
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private MileageService mileageService;
    @Autowired
    private CardInfoService cardInfoService;
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private RegularParkingScheduler regularParkingScheduler;
    @Autowired
    private RegularParkingService regularParkingService;

    @Test
    public void insertUserAndCard(){
        UserDTO userDTO = UserDTO.builder()
                .userName("MileageRegularTest")
                .phone("user100")
                .pw(passwordEncoder.encode("1"))
                .dong("100")
                .ho("100")
                .build();
        Long uno = userService.register(userDTO);
        CardInfoDTO cardInfoDTO = CardInfoDTO.builder()
                .cardExpiry("123")
                .encryptedCardNumber("1234123412341234")
                .uno(uno)
                .build();
        cardInfoService.saveCardInfo(cardInfoDTO);
        Long cardId = cardInfoService.findByUno(uno).getCardId();
        int amount = 5000;
    }

    @Test
    public void processUseMileage(){
        int amount = 5000;
        CardInfoDTO cardInfoDTO = CardInfoDTO.builder()
                .cardExpiry("123")
                .encryptedCardNumber("1234123412341234")
                .uno(81L)
                .build();
        Mileage mileage = Mileage.builder()
                .autopay(false)
                .dong("100")
                .ho("100")
                .price(50000)
                .build();
        ManualRequestDTO manualRequestDTO = ManualRequestDTO.builder()
                .card(cardInfoDTO)
                .mileage(mileageService.getDTO(mileage))
                .paymentAmount(amount*2)
                .build();
        paymentService.processManualPayment(manualRequestDTO);
        MileageHistoryDTO mileageHistoryDTO = MileageHistoryDTO.builder()
                .uno(81L)
                .timestamp(LocalDateTime.now())
                .amount(1000)
                .description("TEST")
                .build();
        //paymentService.processUseMileage(mileageService.getDTO(mileage), 81L, amount, mileageHistoryDTO.getDescription());
//        paymentService.processUseMileage(mileageService.getDTO(mileage), 81L, amount, mileageHistoryDTO.getDescription());
    }

    @Test
    @Transactional
    public void insertRegularAndPaymentTest(){

        HouseholdDTO householdDTO = HouseholdDTO.builder()
                .dong("100")
                .ho("100")
                .build();

        MileageDTO mileageDTO = mileageService.findByDongHoDTO("100", "100");
        System.out.println("------------------"+mileageDTO.getPrice());

        RegularParkingDTO regularParkingDTO = RegularParkingDTO.builder()
                .householdDTO(householdDTO)
                .carNum("11가1111")
                .name("mileage Test")
                .phone("mileage Test") // 등록 날짜 test 는 serviceImpl 에서 변경
                .build();

        regularParkingDTO.setHousehold(Household.builder()
                .householdPK(HouseholdPK.builder()
                        .dong(regularParkingDTO.getHouseholdDTO().getDong())
                        .ho(regularParkingDTO.getHouseholdDTO().getHo())
                        .build())
                .build());
        regularParkingService.register(regularParkingDTO);
        regularParkingScheduler.startRegularPayment();
    }

    @Test
    public void randNumTest(){
        SecureRandom rand = new SecureRandom(); // 보안을 위해 SecureRandom 사용
        String verifyNum = String.format("%06d", rand.nextInt(1000000));
        String sendStr = "인증번호 전송\n"+"["+verifyNum+"]";
        System.out.println(sendStr);
    }
}
