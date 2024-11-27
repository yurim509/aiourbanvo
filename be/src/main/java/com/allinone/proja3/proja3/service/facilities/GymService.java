package com.allinone.proja3.proja3.service.facilities;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.SearchPageRequestDTO;
import com.allinone.proja3.proja3.dto.SearchPageResponseDTO;
import com.allinone.proja3.proja3.dto.facilities.GymDTO;
import com.allinone.proja3.proja3.dto.user.UserDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.facilities.Gym;
import com.querydsl.core.BooleanBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface GymService {
    Gym newProgramPost(Gym gym);
    GymDTO getProgramPost(Long programId);
    public SearchPageResponseDTO<GymDTO> getNonDeletedPrograms(SearchPageRequestDTO pageRequestDTO);
    void remove(Long programId);
    void modify(GymDTO gymDTO);
    public GymDTO findDataByProgramId(Long programId);
    GymDTO entityToDto(Gym gym);
    Gym dtoToEntity(GymDTO gymDTO);
   ;    //프로그램 접수관련
     String registerParticipant(Long programId, User user);
     // 대기자 접수
     String registerWaitlist(Long programId, User user);
    public List<UserDTO> getRegisterdUsers(Long programId);
    public List<UserDTO> getWaitlistUsers(Long programId);
    // 참가취소
    String cancelParticipant(Long programId, User user);
    //대기 취소
    String cancelWaitlist(Long programId, User user);
    //검색관련
    public SearchPageResponseDTO<GymDTO> searchList (SearchPageRequestDTO requestDTO);



    public List<GymDTO> getProgramsByUser(Long uno);
    public List<GymDTO> getWaitlistByUser(Long uno);

//    public List<GymDTO> getProgramsByUserAndProgramId(Long uno, Long programId);

//    public List<GymDTO> getProgramsByUser(User user);
//    public List<UserDTO> getRegisteredUsers(Long programId);
}

