package com.allinone.proja3.proja3.dto.community;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MarketDTO {

    private Long mno; // 상품게시번호
    private String title; // 상품명
    private String content; // 상품의 내용 설명
    private String thumbnailUrl; // 썸네일 이미지
    private List<String> imageUrls; // 상품 이미지 리스트
    private int price; // 가격

    private Long userId; // 사용자 ID
    private String userName; // 사용자 이름 추가
    private Long uno;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isAdmin; // 관리자 권한 여부 (옵션)

    public MarketDTO(Long mno, String title, String content, List<String> imageUrls, String thumbnailUrl, int price) {
        this.mno = mno;
        this.title = title;
        this.content = content;
        this.imageUrls = imageUrls;
        this.thumbnailUrl = thumbnailUrl;
        this.price = price;
    }
}
