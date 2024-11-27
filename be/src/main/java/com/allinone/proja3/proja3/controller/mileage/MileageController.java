package com.allinone.proja3.proja3.controller.mileage;


import com.allinone.proja3.proja3.dto.mileage.*;
import com.allinone.proja3.proja3.dto.user.UserDTO;
import com.allinone.proja3.proja3.model.mileage.CardInfo;
import com.allinone.proja3.proja3.model.mileage.Mileage;
import com.allinone.proja3.proja3.model.mileage.MileageHistory;
import com.allinone.proja3.proja3.model.mileage.PaymentHistory;
import com.allinone.proja3.proja3.service.UserService;
import com.allinone.proja3.proja3.service.mileage.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log4j2
@RequiredArgsConstructor
@RestController
@RequestMapping("/mileage")
public class MileageController {

    private final MileageService mileageService;
    private final PaymentService paymentService;
    private final MileagehistoryService mileagehistoryService;
    private final PaymentHistoryService paymentHistoryService;
    private final CardInfoService cardInfoService;
    private final UserService userService;

    @GetMapping("/getmileage")
    public ResponseEntity<?> getMileage(@RequestParam("dong") String dong , @RequestParam("ho") String ho,@RequestParam("uno") Long uno) {

        try {
            log.info("dong : {} , ho : {}",dong,ho);
            Map<String, Object> response = new HashMap<>();
            MileageDTO dto = mileageService.findByDongHoDTO(dong, ho);
            log.info("현재 마일리지 정보 : {}",dto);
            response.put("mileage", dto);
            //CardInfoDTO logincard = cardInfoService.findByUno(uno);// 로그인 유저 카드
            if (dto.isAutopay()==true){
                    String userName = cardInfoService.getCardName(dto.getCardId());
                    response.put("usedCardName",userName);
            }
            log.info(dto);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @PostMapping("/manualpayment")
    public ResponseEntity<?> manualPayment(@RequestBody ManualRequestDTO dto) {
    log.info(dto.getMileage());
    log.info(dto.getCard());
    log.info(dto.getPaymentAmount());
        try {
            MileageDTO mileageDTO = paymentService.processManualPayment(dto);
            return ResponseEntity.ok(mileageDTO);
        }catch (Exception e) {
            log.error(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @PutMapping("/autopay")
    public ResponseEntity<?> fatchAutoPayTure(@RequestBody ManualRequestDTO dto) {
        try {
            MileageDTO mileageDTO = paymentService.processRegisterAutoPay(dto);
            return ResponseEntity.ok(mileageDTO);
        } catch (Exception e) {
            log.error(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @PatchMapping("/autopay")
    public ResponseEntity<?> fatchAutoPayFalse(@RequestBody MileageDTO dto) {
        try {
            MileageDTO mileageDTO = mileageService.fatchAutoPay(dto);
            return ResponseEntity.ok(mileageDTO);
        } catch (Exception e) {
            log.error(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getlist")
    public ResponseEntity<?> getList(@RequestParam("dong") String dong, @RequestParam("ho") String ho, MileagePageRequestDTO pageRequestDTO) {
        try {
            MileagePageResultDTO<MileageHistoryDTO, MileageHistory> resultDTO = mileagehistoryService.getMileageHistoryList(dong, ho, pageRequestDTO);
            Map<String, Object> response = new HashMap<>();
            List<MileageHistoryDTO> list = resultDTO.getDtoList();
            response.put("list", list);
            response.put("pageMaker", resultDTO);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getpaylist")
    public ResponseEntity<?> getpaylist(@RequestParam("uno") Long uno, MileagePageRequestDTO pageRequestDTO) {
        try {
            MileagePageResultDTO<PaymentHistoryDTO, PaymentHistory> resultDTO = paymentHistoryService.getPaymentList(uno,pageRequestDTO);
            Map<String, Object> response = new HashMap<>();
            List<PaymentHistoryDTO> list = resultDTO.getDtoList();
            response.put("list", list);
            response.put("pageMaker", resultDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }




}
