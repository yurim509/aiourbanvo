package com.allinone.proja3.proja3.dto.community;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnnounceDTO {

    private Long pno;
    private String title;
    private String content;
    private String author;
    private Long userId; // 사용자 ID
    private String userName; // 사용자 이름 추가
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isAdmin; // 관리자 권한 여부 (옵션)

    public AnnounceDTO(Long pno, String title, String content) {
        this.pno = pno;
        this.title = title;
        this.content = content;



    }

}
