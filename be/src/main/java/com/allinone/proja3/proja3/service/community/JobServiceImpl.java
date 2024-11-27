package com.allinone.proja3.proja3.service.community;

import com.allinone.proja3.proja3.dto.community.JobDTO;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.method.AuthorizeReturnObject;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class JobServiceImpl implements JobService {

    @Value("${saramin.api.key}")
    private String saraminApiKey;

    @Value("${kakao.api.key}")
    private String kakaoApiKey;

    @Autowired
    private  RestTemplate restTemplate;

    @Override
    public List<JobDTO> fetchJobsFromSaraminAndSave(String keyword) {
       // keyword="java";
        ResponseEntity<String> response = null;
        try {
            String apiUrl = "https://oapi.saramin.co.kr/job-search?access-key=" + saraminApiKey + "&keywords=" +keyword;
            System.out.println("100)" +apiUrl);
            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            // 사람인 API 호출
            response = restTemplate.exchange(apiUrl, HttpMethod.GET, entity, String.class);
            System.out.println("200)" +apiUrl);
            if (response.getStatusCode().is2xxSuccessful()) {
                String responseBody = response.getBody();
                if (responseBody != null && !responseBody.trim().isEmpty()) {
                    // JSON 문자열을 DTO로 변환
                    ObjectMapper objectMapper = new ObjectMapper();
                    JsonNode rootNode = objectMapper.readTree(responseBody);
                    JsonNode jobsNode = rootNode.path("jobs").path("job"); // "job" 배열을 추출

                    // JSON 배열을 JobDTO 리스트로 변환
                    List<JobDTO> jobs = StreamSupport.stream(jobsNode.spliterator(), false)
                            .map(this::parseJobNode)  // 각 요소를 JobDTO로 변환
                            .collect(Collectors.toList());

                    System.out.println("list job saramin 777)" +jobs);
                    return jobs;  // 변환된 JobDTO 리스트 반환
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("사람인 API 호출 중 오류 발생: " + e.getMessage());
        }
        return List.of();  // 빈 리스트 반환
    }

    private JobDTO parseJobNode(JsonNode jobNode) {
        JobDTO jobDTO = new JobDTO();

        // 공고 정보
        jobDTO.setId(jobNode.path("id").asText());  // 공고 번호
        jobDTO.setUrl(jobNode.path("url").asText());  // 채용공고 표준 URL
        jobDTO.setActive(jobNode.path("active").asInt() == 1);  // 공고 진행 여부 (1: 진행중, 0: 마감)
        jobDTO.setPostingTimestamp(jobNode.path("posting-timestamp").asLong());  // 게시일 Unix timestamp
        jobDTO.setModificationTimestamp(jobNode.path("modification-timestamp").asLong());  // 수정일 Unix timestamp
        jobDTO.setOpeningTimestamp(jobNode.path("opening-timestamp").asLong());  // 접수 시작일 Unix timestamp
        jobDTO.setExpirationTimestamp(jobNode.path("expiration-timestamp").asLong());  // 마감일 Unix timestamp
        jobDTO.setCloseType(jobNode.path("close-type").path("name").asText());  // 마감일 형식

        // 기업 정보
        jobDTO.setCompanyName(jobNode.path("company").path("detail").path("name").asText());  // 기업명
        jobDTO.setCompanyUrl(jobNode.path("company").path("detail").path("href").asText());  // 기업정보 페이지 URL

        // 공고 정보
        jobDTO.setTitle(jobNode.path("position").path("title").asText());  // 공고 제목
        jobDTO.setLocation(jobNode.path("position").path("location").path("name").asText());  // 근무지
        jobDTO.setJobType(jobNode.path("position").path("job-type").path("name").asText());  // 근무형태
        jobDTO.setIndustry(jobNode.path("position").path("industry").path("name").asText());  // 업종

        // 직무 코드 및 상위 직무 코드
        jobDTO.setJobMidCode(jobNode.path("position").path("job-mid-code").path("name").asText());  // 상위 직무 코드
        jobDTO.setJobCode(jobNode.path("position").path("job-code").path("name").asText());  // 직무 코드

        // 경력 및 학력 요구 사항
        jobDTO.setExperienceLevel(jobNode.path("position").path("experience-level").path("name").asText());  // 경력
        jobDTO.setRequiredEducationLevel(jobNode.path("position").path("required-education-level").path("name").asText());  // 학력 요구 사항

        // 키워드
        jobDTO.setKeyword(jobNode.path("keyword").asText());  // 키워드

        // 조회수 및 지원자수
        jobDTO.setReadCnt(jobNode.path("read-cnt").asInt());  // 조회수
        jobDTO.setApplyCnt(jobNode.path("apply-cnt").asInt());  // 지원자수

        // 연봉
        jobDTO.setSalary(jobNode.path("salary").path("name").asText());  // 연봉

        // 경도/위도는 null로 들어올 수 있으므로, null 체크 후 처리
        jobDTO.setLatitude(jobNode.path("latitude").asDouble());
        jobDTO.setLongitude(jobNode.path("longitude").asDouble());

        return jobDTO;
    }


}
