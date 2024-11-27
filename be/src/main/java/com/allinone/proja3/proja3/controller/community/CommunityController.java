package com.allinone.proja3.proja3.controller.community;

import com.allinone.proja3.proja3.dto.community.CommunityDTO;
import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.model.community.Community;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.repository.UserRepository;
import com.allinone.proja3.proja3.service.community.CommunityService;
import com.allinone.proja3.proja3.service.community.CommunityServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities/board")
public class CommunityController {

    @Autowired
    private CommunityService service;
    @Autowired
    private CommunityServiceImpl service2;
    @Autowired
    private UserRepository userRepository;
    // 특정 사용자의 게시물 조회
    @GetMapping("/{uno}")
    public List<CommunityDTO> read(@PathVariable(name = "uno") Long uno) {
        User user = userRepository.findById(uno)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        System.out.println("Retrieved communities for uno: " + uno);
        return service.findDataByUno(uno);
    }

    @GetMapping("/modify/{pno}")
    public ResponseEntity<CommunityDTO> modifyCommunity(@PathVariable Long pno) {
        System.out.println("Request received for post ID: " + pno);
        CommunityDTO communityDTO = service.getCommunityByPno(pno,new User()); // 데이터 조회
        if (communityDTO != null) {
            System.out.println("Post found: " + communityDTO);
            return ResponseEntity.ok(communityDTO);
        } else {
            System.out.println("No post found for ID: " + pno);
            return ResponseEntity.notFound().build();
        }
    }

    // 게시물 생성
    @PostMapping("/add")
    public ResponseEntity<CommunityDTO> createPost(@RequestBody Community community, @RequestParam Long uno) {
        User user = userRepository.findById(uno)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        community.setUser(user); // 게시물에 사용자 정보를 설정
        Community newPost = service.createPost(community, user);
        CommunityDTO response = service.entityToDto(newPost);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/list")
    public ResponseEntity<PageResponseDTO<CommunityDTO>> getPosts(PageRequestDTO pageRequestDTO) {
        PageResponseDTO<CommunityDTO> response = service.findAllPosts(pageRequestDTO);

        return ResponseEntity.ok(response);
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

    @PutMapping("/{pno}")
    public ResponseEntity<String> modify(
            @PathVariable(name = "pno") Long pno,
            @RequestParam(name = "uno") Long uno,
            @RequestBody CommunityDTO communityDTO) {
        // CommunityDTO에 pno와 uno 값 설정
        communityDTO.setUserId(uno);
        communityDTO.setPno(pno);
        try {
            // 서비스 레이어 호출 (수정 로직 처리)
            boolean isModified = service.modify(communityDTO);
            if (isModified) {
                // 성공적으로 수정되었을 경우 200 OK 응답
                return ResponseEntity.ok("업데이트 성공!");
            } else {
                // 수정 실패 시 400 Bad Request 응답
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("업데이트 실패");
            }
        } catch (Exception e) {
            // 예외 발생 시 500 Internal Server Error 응답
            System.err.println("수정 중 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }

}
