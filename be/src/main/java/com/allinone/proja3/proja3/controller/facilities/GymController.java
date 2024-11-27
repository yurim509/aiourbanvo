package com.allinone.proja3.proja3.controller.facilities;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.SearchPageRequestDTO;
import com.allinone.proja3.proja3.dto.SearchPageResponseDTO;
import com.allinone.proja3.proja3.dto.facilities.GymDTO;
import com.allinone.proja3.proja3.dto.user.UserDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.facilities.Gym;
import com.allinone.proja3.proja3.repository.UserRepository;
import com.allinone.proja3.proja3.service.facilities.GymService;
import com.allinone.proja3.proja3.service.mileage.PaymentService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@Log4j2
@RestController
@RequestMapping("/api/facilities/gym")
//@CrossOrigin(origins = "http://localhost:3000")
public class GymController {

    @Autowired
    private GymService service;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentService paymentService;

    // 마이페이지에서 사용자가 신청한 프로그램 목록 조회
//    @GetMapping("/user/programs")
//    public ResponseEntity<List<GymDTO>> getProgramsByUser(@AuthenticationPrincipal User user) {
//        // 로그인한 사용자가 신청한 프로그램 목록을 조회
//        List<GymDTO> programs = service.getProgramsByUser(user);
//        return ResponseEntity.ok(programs);
//    }

//    @GetMapping("/myPage/{uno}")
//    public ResponseEntity<PageResponseDTO<GymDTO>> getProgramsByUser(
//            @PathVariable Long uno,
//            @RequestParam(defaultValue = "1") int page,  // 기본값 1
//            @RequestParam(defaultValue = "10") int size) {  // 기본값 10
//        PageRequestDTO pageRequestDTO = new PageRequestDTO(page, size);
//        PageResponseDTO<GymDTO> result = service.getProgramsByUser(uno, pageRequestDTO);
//        System.out.println("1212: "+result);
//        return ResponseEntity.ok(result);
//    }

//    @GetMapping("/myPage/{uno}")
//    public ResponseEntity<PageResponseDTO<GymDTO>> getProgramsByUser(
//            @PathVariable Long uno,
//            @ModelAttribute PageRequestDTO pageRequestDTO) {
//        // 사용자 uno로 등록된 프로그램 목록 조회
//        PageResponseDTO<GymDTO> result = service.getProgramsByUser(uno, pageRequestDTO);
//
//        return ResponseEntity.ok(result);
//    }
    //등록
    @PostMapping("/add")
    public ResponseEntity<GymDTO> newProgramPost (@RequestBody Gym gym) {
        System.out.println("gym: "+gym);
        Gym newPost = service.newProgramPost(gym);
        GymDTO response = service.entityToDto(newPost);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //조회
    @GetMapping("/list")
    public SearchPageResponseDTO<GymDTO> getList(SearchPageRequestDTO pageRequestDTO) {
        System.out.println("get list controller: " + pageRequestDTO);
        SearchPageResponseDTO<GymDTO> list = service.getNonDeletedPrograms(pageRequestDTO);
        System.out.println("after service list 120) : " +list);
        return  list;
    }


    //검색
    @GetMapping("/list/search")
    public ResponseEntity<SearchPageResponseDTO<GymDTO>> searchGymPrograms(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "searchType", required = false) String searchType,
            @RequestParam(value = "searchKeyWord", required = false) String searchKeyWord) {

        // 디버깅을 위한 출력
        System.out.println("searchType 1: " + searchType);
        System.out.println("searchKeyWord 2: " + searchKeyWord);

        // Pageable 객체 생성
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("programId").ascending());

        // 서비스 호출
        SearchPageRequestDTO requestDTO = SearchPageRequestDTO.builder()
                .page(page)
                .size(size)
                .type(searchType)
                .keyword(searchKeyWord)
                .build();

        SearchPageResponseDTO<GymDTO> pageResponseDTO = service.searchList(requestDTO);

        // 결과 반환
        return ResponseEntity.ok(pageResponseDTO);
    }


    //특정 게시물 조회 메서드
    @GetMapping("/detail/{programId}")
    public GymDTO getProgramPost(@PathVariable Long programId) {
        System.out.println("gym detail controller : " +programId);
        return service.getProgramPost(programId);
    }

    //수정
    @PutMapping("/detail/modify/{programId}")
    public Map<String, String> modify(
            @PathVariable(name="programId") Long programId,
            @RequestBody GymDTO gymDTO){
        gymDTO.setProgramId(programId);
        System.out.println("Modify : " + gymDTO);

        service.modify(gymDTO);
        return Map.of("RESULT", "SUCCESS");
    }

    //수정 버튼 클릭시 이전 데이터 내용 불러오기
    @GetMapping({"/detail/modify/{programId}"})
    public GymDTO readBeforePost(@PathVariable(name = "programId") Long programId) {
        System.out.println("데이터 조회" + programId);
        return service.findDataByProgramId(programId);
    }


    //삭제
    @PostMapping("/delete")
    public void deletePost(@RequestBody Long programId) {
        System.out.println("programId" + programId);
            service.remove(programId);
    }

    //검색


    //-------------참가 메서드 ----------------
    //참가자 등록
    @PostMapping("/detail/register/{programId}")
    public ResponseEntity<String> registerParticipant(@PathVariable Long programId,  @RequestBody User user) {
        String response = service.registerParticipant(programId, user);
        if(response.equals("Already"))   return new ResponseEntity<>("A001",HttpStatus.OK);
        else if(response.equals("Done"))   return new ResponseEntity<>("A002",HttpStatus.OK);
        else return new ResponseEntity<>("A003",HttpStatus.OK);
    }

    // 대기자 등록
    @PostMapping("/detail/waitlist/{programId}")
    public ResponseEntity<String> registerWaitlist(@PathVariable Long programId, @RequestBody User user) {
        String response = service.registerWaitlist(programId, user);

        switch (response) {
            case "Already registered":
                return new ResponseEntity<>("B000", HttpStatus.OK); // 이미 정식 참가자인 경우
            case "Already on waitlist":
                return new ResponseEntity<>("B001", HttpStatus.OK); // 이미 대기자인 경우
            case "Added to waitlist":
                return new ResponseEntity<>("B002", HttpStatus.OK); // 대기자 등록 성공
            default:
                return new ResponseEntity<>("B003", HttpStatus.INTERNAL_SERVER_ERROR); // 기타 에러
        }
    }
    //-------------취소 메서드 ----------------
    //참가취소
    @DeleteMapping("/detail/register/cancel/{programId}")
    public ResponseEntity<String> cancelParticipant(@PathVariable Long programId, @RequestBody User user) {
        String response = service.cancelParticipant(programId, user);
        if(response.equals("Not Registered")) {
            return new ResponseEntity<>("C001", HttpStatus.OK); // 등록되지 않은 사용자
        } else if(response.equals("Canceled")) {

            return new ResponseEntity<>("C002", HttpStatus.OK);
        }else if (response.equals("Canceled and updated")) {
            return new ResponseEntity<>("C003", HttpStatus.OK); // 성공적으로 취소 및 대기자 참가자 등록
        } else {
            return new ResponseEntity<>("C004", HttpStatus.INTERNAL_SERVER_ERROR); // 서버 오류
        }
    }
//    @DeleteMapping("/detail/register/cancel/{programId}")
//    public ResponseEntity<String> cancelParticipant(@PathVariable Long programId, @RequestBody User user) {
//        String response = service.cancelParticipant(programId, user);
//        if(response.equals("Not Registered")) {
//            return new ResponseEntity<>("C001", HttpStatus.OK); // 등록되지 않은 사용자
//        } else if(response.equals("Canceled")) {
//            return new ResponseEntity<>("C002", HttpStatus.OK);
//        }else if (response.equals("Canceled and updated")) {
//            return new ResponseEntity<>("C003", HttpStatus.OK); // 성공적으로 취소 및 대기자 참가자 등록
//        } else {
//            return new ResponseEntity<>("C004", HttpStatus.INTERNAL_SERVER_ERROR); // 서버 오류
//        }
//    }
    //대기자 취소
    @DeleteMapping("/detail/waitlist/cancel/{programId}")
    public ResponseEntity<String> cancelWaitlist(@PathVariable Long programId, @RequestBody User user){
        String response = service.cancelWaitlist(programId,user);
        if(response.equals("Not on Waitlist")) {
            return new ResponseEntity<>("D001", HttpStatus.OK);// 대기자 명단에 없는 경우
        } else if (response.equals("Waitlist Canceled")) {
            return new ResponseEntity<>("D002", HttpStatus.OK); // 대기자 취소 성공
        }else{
            return new ResponseEntity<>("D003", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    //참가 신청한 명단 불러오기
    @GetMapping("/{programId}/participants")
    public ResponseEntity<List<UserDTO>> getRegisterdUsers(@PathVariable Long programId) {
        List<UserDTO> participants = service.getRegisterdUsers(programId);
        System.out.println("participants1105 " + participants);
        return ResponseEntity.ok(participants);
    }
    //대기자 명단 불러오기
    @GetMapping("/{programId}/waitlist")
    public ResponseEntity<List<UserDTO>> getWaitlistUsers(@PathVariable Long programId) {
        List<UserDTO> waitlist = service.getWaitlistUsers(programId);
        System.out.println("waitlists1105 " + waitlist);
        return ResponseEntity.ok(waitlist);
    }

    //유저에 따른 참가 프로그램 조회
    @GetMapping("/myPage/program/{uno}")
    public  ResponseEntity<List<GymDTO>> getProgramsByUser (@PathVariable Long uno) {
        List<GymDTO> programs = service.getProgramsByUser(uno);
        System.out.println("program1121 " + programs);
        return ResponseEntity.ok(programs);
    }

    //유저에 따른 대기 프로그램 조회
    @GetMapping("/myPage/waitlist/{uno}")
    public  ResponseEntity<List<GymDTO>> getWaitlistByUser (@PathVariable Long uno) {
        List<GymDTO> programs = service.getWaitlistByUser(uno);
        System.out.println("program1121 " + programs);
        return ResponseEntity.ok(programs);
    }
//    @GetMapping("/myPage/program/{uno}/{programId}")
//    public ResponseEntity<List<GymDTO>> getProgramsByUser(@PathVariable Long uno, @PathVariable Long programId) {
//        List<GymDTO> programs = service.getProgramsByUserAndProgramId(uno, programId);
//        System.out.println("program1121 " + programs);
//        return ResponseEntity.ok(programs);
//    }


}
