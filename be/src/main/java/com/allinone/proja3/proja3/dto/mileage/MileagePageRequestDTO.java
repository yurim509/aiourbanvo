package com.allinone.proja3.proja3.dto.mileage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
@Log4j2
@NoArgsConstructor
public class MileagePageRequestDTO {
    private int page;
    private int size;
    private String keyword;
    private String sortingColumn;
    private boolean ascending;
    private LocalDateTime startDate; // 검색 시작 날짜
    private LocalDateTime endDate; // 검색 종료 날짜

    public Pageable getPageable() {

        if (sortingColumn != null) {
            Sort sort;
            // 정렬 컬럼이 있는 경우
            log.info("정렬 조건 ? : {}", sortingColumn);
            log.info(ascending ? "asc 오름차순" : "desc 내림차순 ");
            if (ascending) {
                sort = Sort.by( Sort.Order.asc(sortingColumn));
            } else {
                sort = Sort.by(Sort.Order.desc(sortingColumn));
            }
            return PageRequest.of(page-1,size,sort);
        }


        return PageRequest.of(page-1,size);
    }// getPageable

}
