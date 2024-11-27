package com.allinone.proja3.proja3.service.parking;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.parking.HouseholdDTO;
import com.allinone.proja3.proja3.dto.parking.VisitParkingDTO;
import com.allinone.proja3.proja3.dto.parking.VisitReqDTO;
import com.allinone.proja3.proja3.dto.parking.VisitSearchDataDTO;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface VisitParkingService {
    Long register(VisitParkingDTO visitParkingDTO);
    PageResponseDTO<VisitParkingDTO> getList(PageRequestDTO pageRequestDTO);
    PageResponseDTO<VisitParkingDTO> getUserList(PageRequestDTO pageRequestDTO, HouseholdDTO householdDTO);
    void remove(Long vpno);
    VisitParkingDTO getOne(Long vpno);
    void putOne(VisitParkingDTO visitParkingDTO, Long vpno);
    PageResponseDTO<VisitParkingDTO> getSearchList(PageRequestDTO pageRequestDTO, VisitSearchDataDTO visitSearchDataDTO);
}
