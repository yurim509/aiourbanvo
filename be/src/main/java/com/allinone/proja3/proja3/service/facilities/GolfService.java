package com.allinone.proja3.proja3.service.facilities;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.facilities.GolfDTO;
import com.allinone.proja3.proja3.dto.facilities.StudyDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.facilities.Golf;
import com.allinone.proja3.proja3.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

//@Transactional
public interface GolfService {

    Long register(GolfDTO golfDTO);
//    String validateReservation(LocalDate date, LocalTime startTime, LocalTime endTime, int teeBox);
    PageResponseDTO<GolfDTO> getList(PageRequestDTO pageRequestDTO);
    boolean isTimeAvailable(LocalDate date, LocalTime startTime, LocalTime endTime, int teeBox);
//    String isValidReservation(LocalDate date, LocalTime startTime, LocalTime endTime);
    PageResponseDTO<GolfDTO> getUserReservations(Long uno, PageRequestDTO pageRequestDTO);
    void modify(GolfDTO golfDTO);
    void remove(Long reservationId);
//    void findGolfBydelFlag(Long reservationId);
    public PageResponseDTO<GolfDTO> getNonDeletedReservations(PageRequestDTO pageRequestDTO);
    public String validateReservationDetails(GolfDTO golfDTO);
    //==========사용자의 uno, 이름, phone 불러오기================
    GolfDTO findDataByUno(Long uno); //list<GolfDTO> 에서 Golf로 변경


}
