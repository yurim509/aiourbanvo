package com.allinone.proja3.proja3.service.facilities;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.facilities.StudyDTO;
import com.allinone.proja3.proja3.dto.facilities.StudyDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.facilities.Study;
import com.allinone.proja3.proja3.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

//@Transactional
public interface StudyService {

    Long register(StudyDTO studyDTO);
    //    String validateReservation(LocalDate date, LocalTime startTime, LocalTime endTime, int seatNum);
    PageResponseDTO<StudyDTO> getList(PageRequestDTO pageRequestDTO);
    boolean isTimeAvailable(LocalDate date, LocalTime startTime, LocalTime endTime, int seatNum);
    //    String isValidReservation(LocalDate date, LocalTime startTime, LocalTime endTime);
    PageResponseDTO<StudyDTO> getUserReservations(Long uno, PageRequestDTO pageRequestDTO);
    void modify(StudyDTO studyDTO);
    void remove(Long reservationId);
    //    void findStudyBydelFlag(Long reservationId);
    public PageResponseDTO<StudyDTO> getNonDeletedReservations(PageRequestDTO pageRequestDTO);
    public String validateReservationDetails(StudyDTO studyDTO);
    //==========사용자의 uno, 이름, phone 불러오기================
    StudyDTO findDataByUno(Long uno); //list<StudyDTO> 에서 Study로 변경


}
