package com.allinone.proja3.proja3.service.community;

import com.allinone.proja3.proja3.dto.community.CommunityDTO;
import com.allinone.proja3.proja3.model.community.Community;
import com.allinone.proja3.proja3.repository.community.CommunityAnnounceRepository;
import com.allinone.proja3.proja3.repository.community.CommunityMarketRepository;
import com.allinone.proja3.proja3.repository.community.CommunityRepository;
import com.allinone.proja3.proja3.repository.community.CommunitySpecifications;
import com.allinone.proja3.proja3.service.community.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.allinone.proja3.proja3.model.community.QCommunity.community;


@Service
    @RequiredArgsConstructor
    public class SearchServiceImpl implements SearchService {

        private final CommunityRepository communityRepository;
        private final CommunityAnnounceRepository announceRepository;
        private final CommunityMarketRepository marketRepository;

        @Override
        public Map<String, Object> search(String type, String keyword, int page, int size, String category) {
            if (keyword == null || keyword.isEmpty()) {
                throw new IllegalArgumentException("Keyword must not be null or empty");
            }

            String searchKeyword = "%" + keyword.toLowerCase() + "%";
            Pageable pageable = PageRequest.of(page - 1, size);

            Page<?> results;

            switch (category) {
                case "board":
                    results = communityRepository.findAll(
                            CommunitySpecifications.searchByType(type, searchKeyword, category),
                            pageable
                    );
                    break;

                case "announce":
                    results = announceRepository.findAll(
                            CommunitySpecifications.searchByType(type, searchKeyword, category),
                            pageable
                    );
                    break;

                case "market":
                    results = marketRepository.findAll(
                            CommunitySpecifications.searchByType(type, searchKeyword, category),
                            pageable
                    );
                    break;

                default:
                    throw new IllegalArgumentException("Invalid category: " + category);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("dtoList", results.getContent());
            response.put("totalCount", results.getTotalElements());
            response.put("totalPage", results.getTotalPages());
            response.put("pageNumList", IntStream.rangeClosed(1, results.getTotalPages()).boxed().collect(Collectors.toList()));
            response.put("prev", results.hasPrevious());
            response.put("next", results.hasNext());
            response.put("current", results.getNumber() + 1);

            return response;
        }
    }
