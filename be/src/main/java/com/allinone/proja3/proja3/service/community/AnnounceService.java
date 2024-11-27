package com.allinone.proja3.proja3.service.community;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.community.AnnounceDTO;
import com.allinone.proja3.proja3.dto.community.CommunityDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.community.Announce;

import java.util.List;


public interface AnnounceService {
    List<AnnounceDTO> findDataByUno(Long uno);
    PageResponseDTO<AnnounceDTO> findAllAnnouncements(PageRequestDTO pageRequestDTO);
    Announce createPost (User user, Announce announce);
    AnnounceDTO entityDto(Announce announce);
    AnnounceDTO getPno(Long pno ,User user);
    void deletePost(Long pno, Long uno);
    void deletePostByAdmin(Long pno);
    boolean modify(AnnounceDTO announceDTO);
}
