package com.allinone.proja3.proja3.service.mileage;

import com.allinone.proja3.proja3.dto.mileage.MileageDTO;
import com.allinone.proja3.proja3.model.mileage.CardInfo;
import com.allinone.proja3.proja3.model.mileage.Mileage;

public interface MileageService {

    MileageDTO getDTO(Mileage entity);
    Mileage findByDongHoentity(String dong , String ho);
    MileageDTO findByDongHoDTO(String dong , String ho);
    Mileage saveDto(MileageDTO dto);
    Mileage saveEntity(Mileage mileage);
    //수동 충전 로직
    Mileage duplicate(MileageDTO dto , int paymetAmont );
    //자동 결제 로직
    Mileage autoState(MileageDTO dto, CardInfo card);
    // 자동 결제 변경 로직
    MileageDTO fatchAutoPay(MileageDTO dto);
    void deleteMileageActive(String dong , String ho);
}
