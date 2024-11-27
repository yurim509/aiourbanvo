package com.allinone.proja3.proja3.controller.community;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.community.AnnounceDTO;
import com.allinone.proja3.proja3.dto.community.CommunityDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.community.Announce;
import com.allinone.proja3.proja3.repository.UserRepository;
import com.allinone.proja3.proja3.service.community.AnnounceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities/announce")
public class AnnounceController {
    @Autowired
    private AnnounceService service;
    @Autowired
    private UserRepository repository;

    @GetMapping("/list")
    public ResponseEntity<PageResponseDTO<AnnounceDTO>> getAnnouncement(PageRequestDTO pageRequestDTO) {
        PageResponseDTO<AnnounceDTO> response = service.findAllAnnouncements(pageRequestDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<AnnounceDTO> createPost(@RequestBody Announce announce, @RequestParam Long uno) {
        User user = repository.findById(uno)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        announce.setUser(user); // 게시물에 사용자 정보를 설정
        Announce newPost = service.createPost(user, announce);

        // entitytoDto 메서드를 호출하여 AnnounceDTO를 생성
        AnnounceDTO response = service.entityDto(newPost); // newPost를 사용하여 DTO 생성
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @GetMapping("/modify/{pno}")
    public ResponseEntity<AnnounceDTO> modifyAnnounce(@PathVariable Long pno) {
        System.out.println("Request received for post ID: " + pno);

        AnnounceDTO announceDTO = service.getPno(pno, new User());
        if (announceDTO != null) {
            System.out.println("Post found: " + announceDTO);
            return ResponseEntity.ok(announceDTO);
        } else {
            System.out.println("No post found for ID: " + pno);
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{uno}")
    public List<AnnounceDTO> read(@PathVariable(name = "uno") Long uno) {
        User user = repository.findById(uno)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        System.out.println("Retrieved communities for uno: " + uno);
        return service.findDataByUno(uno);
    }


    @DeleteMapping("/{pno}")
    public ResponseEntity<String> deletePost(
            @PathVariable("pno") Long pno,
            @RequestParam(value = "uno", required = false) Long uno, // 관리자는 uno 필요 없음
            @RequestParam("role") String role) {

        if ("root".equalsIgnoreCase(role) || "admin".equalsIgnoreCase(role)) {
            // 관리자 권한으로 바로 삭제
            service.deletePostByAdmin(pno);
            return new ResponseEntity<>("관리자 권한으로 게시글이 삭제되었습니다.", HttpStatus.OK);
        }

        // 일반 사용자 검증 후 삭제
        if (uno == null) {
            throw new IllegalArgumentException("일반 사용자의 경우 uno 값이 필요합니다.");
        }
        service.deletePost(pno, uno);
        return new ResponseEntity<>("게시글이 삭제되었습니다.", HttpStatus.OK);
    }



    @PutMapping("/modify/{pno}")
    public ResponseEntity<String> modify(
            @PathVariable(name = "pno") Long pno,
            @RequestParam(name = "uno") Long uno,
            @RequestBody AnnounceDTO announceDTO) {

        // 입력된 값 출력 (디버깅용)
        System.out.println("Received pno123: " + pno);
        System.out.println("Received uno123: " + uno);
        System.out.println("CommunityDTO123: " + announceDTO);

        // CommunityDTO에 pno와 uno 값 설정
        announceDTO.setUserId(uno);
        announceDTO.setPno(pno);

        try {
            // 서비스 레이어 호출 (수정 로직 처리)
            boolean isModified = service.modify(announceDTO);

            if (isModified) {
                // 성공적으로 수정되었을 경우 200 OK 응답
                return ResponseEntity.ok("업데이트 성공123!");
            } else {
                // 수정 실패 시 400 Bad Request 응답
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("업데이트 실패123");
            }
        } catch (Exception e) {
            // 예외 발생 시 500 Internal Server Error 응답
            System.err.println("수정 중 오류 발생123: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생123");
        }
    }

}
