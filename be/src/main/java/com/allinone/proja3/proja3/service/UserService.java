package com.allinone.proja3.proja3.service;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.user.ChangePwReqDTO;
import com.allinone.proja3.proja3.dto.user.UserDTO;
import com.allinone.proja3.proja3.dto.user.UserSearchDataDTO;
import com.allinone.proja3.proja3.model.UserRole;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface UserService {
    Long register(UserDTO userDTO);
    PageResponseDTO<UserDTO> getList(PageRequestDTO pageRequestDTO);
    PageResponseDTO<UserDTO> getAllList(PageRequestDTO pageRequestDTO);
    PageResponseDTO<UserDTO> getApprovalList(PageRequestDTO pageRequestDTO);
    UserDTO getOne(Long uno);
    void putOne(UserDTO userDTO);
    void remove(Long uno);
    void hardRemove(Long uno);
    boolean approvalStatus(Long uno);
    Long addRole(Long uno, UserRole role);
    void clearRole(Long uno);
    String verify(String phone);
    Long findPw(String phone);
    PageResponseDTO<UserDTO> getSearchList(PageRequestDTO pageRequestDTO, UserSearchDataDTO userSearchData);
    PageResponseDTO<UserDTO> getAllSearchList(PageRequestDTO pageRequestDTO, UserSearchDataDTO userSearchData);
}
