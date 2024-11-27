package com.allinone.proja3.proja3.controller.community;

import com.allinone.proja3.proja3.dto.community.JobDTO;
import com.allinone.proja3.proja3.service.community.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/communities/info")
@CrossOrigin("http://localhost:3000")
public class JobController {

    @Autowired
    private JobService jobService;

    // Saramin API에서 채용공고 데이터를 조회하고 DB에 저장
    @GetMapping("/jobs/search/{keyword}")
    public ResponseEntity<List<JobDTO>> getJobsFromSaramin(@PathVariable String keyword) {
        System.out.println("Saramin 검색 키워드: " + keyword);
        List<JobDTO> jobData = jobService.fetchJobsFromSaraminAndSave(keyword);
        System.out.println("조회된 채용공고 데이터: " + jobData);
        return ResponseEntity.ok(jobData);
    }

}
