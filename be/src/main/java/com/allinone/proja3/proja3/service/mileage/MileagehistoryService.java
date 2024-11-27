package com.allinone.proja3.proja3.service.mileage;

import com.allinone.proja3.proja3.dto.mileage.MileageHistoryDTO;
import com.allinone.proja3.proja3.dto.mileage.MileagePageRequestDTO;
import com.allinone.proja3.proja3.dto.mileage.MileagePageResultDTO;
import com.allinone.proja3.proja3.model.mileage.CardInfo;
import com.allinone.proja3.proja3.model.mileage.Mileage;
import com.allinone.proja3.proja3.model.mileage.MileageHistory;
import com.allinone.proja3.proja3.model.mileage.MileageHistoryId;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface MileagehistoryService {

    MileagePageResultDTO<MileageHistoryDTO,MileageHistory> getMileageHistoryList(String dong, String ho , MileagePageRequestDTO pageRequest);



    void deleteMileageHistory(MileageHistoryId id);

    void savehistory(Mileage mileage , Long uno ,
                     int amount , String type , String description);
}
