package com.allinone.proja3.proja3.dto.mileage;
import lombok.Data;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Log4j2
@Data
public class MileagePageResultDTO<DTO, EN> {
    List<DTO> dtoList;
    private int totalPage;
    private int currentPage;
    private int size;
    private int startPage, endPage;
    private boolean hasprev, hasnext;
    private List<Integer> pageList;
    private long totalElements;

    public MileagePageResultDTO(Page<EN> result, Function<EN, DTO> fn) {
        dtoList = result.stream().map(fn).collect(Collectors.toList());
        totalPage = result.getTotalPages();
        totalElements = result.getTotalElements();
        log.info("0. 검색결과 갯수 : {}",result.getTotalElements());
        makePageList(result.getPageable());
    }// 생성자

    private void makePageList(Pageable pageable) {

        this.currentPage = pageable.getPageNumber() + 1;
        log.info("1. 현재 페이지 번호 currentPage : {}",currentPage);

        this.size = pageable.getPageSize();
        log.info("2. 한 페이지에 표시할 항목 수 size :  {}",size);


        int tempEnd = (int) (Math.ceil(currentPage / (double) size)) * size;
        log.info("3. 보여줄 페이지 목록의 끝 페이지 계산  tempEnd:  {}",tempEnd);

        startPage = tempEnd - size + 1;

        endPage = Math.min(totalPage, tempEnd);
        log.info("4. 페이지 시작 번호 설정:startPage :  {}",startPage);
        log.info("5. 페이지 끝번호 설정:endPage : {}",endPage);

        hasprev = startPage > 1;
        hasnext = totalPage > endPage;

        pageList = IntStream.rangeClosed(startPage, endPage).boxed().collect(Collectors.toList());
        log.info("6. 페이지 번호 pageList : {}",pageList);

    } // makePageList


}
