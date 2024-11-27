package com.allinone.proja3.proja3.service.mileage;

import com.allinone.proja3.proja3.dto.mileage.CardInfoDTO;
import com.allinone.proja3.proja3.model.mileage.CardInfo;

public interface CardInfoService {

    CardInfoDTO findByUno(long uno);
    CardInfoDTO getCardInfo(Long cardId);
    String getCardName (Long cardId);
    CardInfo saveCardInfo(CardInfoDTO cardInfo);
    void deleteCardInfo(CardInfoDTO dto);
    String deleteCardByUserId(Long uno);
}
