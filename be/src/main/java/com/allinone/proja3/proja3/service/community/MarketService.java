package com.allinone.proja3.proja3.service.community;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.community.MarketDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.community.Market;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface MarketService {
    List<MarketDTO> findDataByUno(Long uno);
    PageResponseDTO<MarketDTO> findAllmarket(PageRequestDTO pageRequestDTO);
    Market createPost(User user, Market market, MultipartFile thumbnail, List<MultipartFile> images) throws IOException;
    MarketDTO entityDto(Market market);
    MarketDTO getMno(Long mno, User user);
    void deletePost(Long mno, Long uno);//일반삭제
    void deletePostByAdmin(Long mno);//관리자삭제
    User findByUno(Long uno);
    Market findMarketById(Long mno); // 추가된 메서드
    // 여러 개의 이미지에 대한 수정도 지원하도록 변경
    boolean modify(MarketDTO marketDTO, MultipartFile thumbnail, List<MultipartFile> images);

    MarketDTO findByMno(Long mno);
}
