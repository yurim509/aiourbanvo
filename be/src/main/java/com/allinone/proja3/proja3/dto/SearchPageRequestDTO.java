package com.allinone.proja3.proja3.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchPageRequestDTO {
    @Builder.Default
    private int page = 1;//페이지 번호

    @Builder.Default
    private int size = 10;//한페이지에 표시할 항목 수

    private String keyword; //검색어
    private String type; // 검색 유형 (t: 제목, c: 내용, w: 대상)

}
