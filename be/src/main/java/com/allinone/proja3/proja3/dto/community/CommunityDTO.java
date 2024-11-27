package com.allinone.proja3.proja3.dto.community;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor


public class CommunityDTO {
    private long pno; // 게시글 번호
    private String title; // 제목
    private String content; // 내용
    private Long userId; // 사용자 ID
    private String userName; // 사용자 이름 추가
    private LocalDateTime createdAt; // 생성일
    private LocalDateTime updatedAt; // 수정일

    public CommunityDTO(Long pno, String title, String content) {
        this.pno = pno;
        this.title = title;
        this.content = content;




    }

}



