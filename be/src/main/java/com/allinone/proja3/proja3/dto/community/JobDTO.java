package com.allinone.proja3.proja3.dto.community;

import lombok.Data;
import java.time.LocalDate;

@Data
public class JobDTO {

    private String id;  // 공고 번호
    private String url;  // 채용공고 표준 URL
    private boolean active;  // 공고 진행 여부 (진행 중이면 true, 마감이면 false)
    private Long postingTimestamp;  // 게시일의 Unix timestamp
    private LocalDate postedDate;  // 게시일
    private Long modificationTimestamp;  // 수정일 Unix timestamp
    private Long openingTimestamp;  // 접수 시작일의 Unix timestamp
    private Long expirationTimestamp;  // 마감일의 Unix timestamp
    private LocalDate expirationDate;  // 마감일
    private String closeType;  // 마감일 형식 (1: 접수 마감일, 2: 채용시, 3: 상시, 4: 수시)

    private String companyName;  // 기업명
    private String companyUrl;  // 기업정보 페이지 URL
    private String title;  // 공고 제목
    private String location;  // 근무지
    private String jobType;  // 근무 형태
    private String industry;  // 업종
    private String jobMidCode;  // 상위 직무 코드
    private String jobCode;  // 직무 코드
    private String industryKeywordCode;  // 업종 코드 (키워드)
    private String jobCodeKeywordCode;  // 직무 코드 (키워드)
    private String experienceLevel;  // 경력 (예: 신입, 경력 등)
    private String requiredEducationLevel;  // 학력 요구 사항
    private String keyword;  // 키워드
    private Integer readCnt;  // 조회수
    private Integer applyCnt;  // 지원자 수
    private String salary;  // 연봉

    private Double latitude;  // 위도
    private Double longitude;  // 경도

    private String employmentType;  // 고용 형태
    private String experienceRequired;  // 경력 요구 사항
    private String workHours;  // 근무 시간
    private String jobLevel;  // 직무 수준
}
