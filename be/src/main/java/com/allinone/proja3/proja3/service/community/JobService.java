package com.allinone.proja3.proja3.service.community;

import com.allinone.proja3.proja3.dto.community.JobDTO;

import java.util.List;

public interface JobService {

    List<JobDTO> fetchJobsFromSaraminAndSave(String keyword);  // 사람인 API에서 채용공고를 가져와 저장

}
