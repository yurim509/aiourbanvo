package com.allinone.proja3.proja3.service.mileage;

import com.allinone.proja3.proja3.dto.mileage.CardInfoDTO;
import com.allinone.proja3.proja3.dto.mileage.ManualRequestDTO;
import com.allinone.proja3.proja3.dto.mileage.MileageDTO;
import com.allinone.proja3.proja3.model.mileage.CardInfo;

public interface PaymentService {
    //수동 충전 결제 메서드
    MileageDTO processManualPayment(ManualRequestDTO dto);
    
    //자동 결제 시스템 등록 메서드
    MileageDTO processRegisterAutoPay(ManualRequestDTO requestDTO);

    //마일리지 사용 메서드
    MileageDTO processUseMileage(String dong , String ho ,Long userId, int amount , String description );

    //카드 와 마일리지 비활성화 메서드
    String deleteCardAndMileageStateFalse(String dong , String ho , Long uno);

}
