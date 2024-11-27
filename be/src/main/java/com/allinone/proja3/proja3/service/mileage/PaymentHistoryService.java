package com.allinone.proja3.proja3.service.mileage;

import com.allinone.proja3.proja3.dto.mileage.MileageHistoryDTO;
import com.allinone.proja3.proja3.dto.mileage.MileagePageRequestDTO;
import com.allinone.proja3.proja3.dto.mileage.MileagePageResultDTO;
import com.allinone.proja3.proja3.dto.mileage.PaymentHistoryDTO;
import com.allinone.proja3.proja3.model.mileage.MileageHistory;
import com.allinone.proja3.proja3.model.mileage.PaymentHistory;

import java.util.List;

public interface PaymentHistoryService {

    List<PaymentHistoryDTO> getAllPaymentHistory(String dong , String ho);
    MileagePageResultDTO<PaymentHistoryDTO, PaymentHistory> getPaymentList(Long userId , MileagePageRequestDTO pageRequest);

    PaymentHistory savePaymentHistoryDTO(PaymentHistoryDTO dto);

    PaymentHistory savePaymentHistoryEntity(PaymentHistory entity);

    void deletePaymentHistory(PaymentHistoryDTO dto);
}
