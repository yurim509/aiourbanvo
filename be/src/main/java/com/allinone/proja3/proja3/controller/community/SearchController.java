package com.allinone.proja3.proja3.controller.community;

import com.allinone.proja3.proja3.service.community.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/communities")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/board/search")
    public ResponseEntity<?> searchBoard(
            @RequestParam String type,
            @RequestParam String keyword,
            @RequestParam int page,
            @RequestParam int size
    ) {
        System.out.println("[SearchController] Board 검색 호출됨");
        Map<String, Object> response = searchService.search(type, keyword, page, size, "board");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/announce/search")
    public ResponseEntity<?> searchAnnounce(
            @RequestParam String type,
            @RequestParam String keyword,
            @RequestParam int page,
            @RequestParam int size
    ) {
        System.out.println("[SearchController] Announce 검색 호출됨");
        Map<String, Object> response = searchService.search(type, keyword, page, size, "announce");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/market/search")
    public ResponseEntity<?> searchMarket(
            @RequestParam String type,
            @RequestParam String keyword,
            @RequestParam int page,
            @RequestParam int size
    ) {
        System.out.println("[SearchController] Market 검색 호출됨");
        Map<String, Object> response = searchService.search(type, keyword, page, size, "market");
        return ResponseEntity.ok(response);
    }
}
