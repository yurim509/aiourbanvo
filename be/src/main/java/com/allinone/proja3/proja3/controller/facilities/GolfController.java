package com.allinone.proja3.proja3.controller.facilities;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.facilities.GolfDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.facilities.Golf;
import com.allinone.proja3.proja3.repository.UserRepository;
import com.allinone.proja3.proja3.repository.facilities.GolfRepository;
import com.allinone.proja3.proja3.service.facilities.GolfService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Log4j2
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") //host 3000으로변경 1025
@RequestMapping("/api/facilities/golf")
public class GolfController {
    private final GolfService service;
    private final GolfRepository repository;
    private final UserRepository userRepository;



    //예약 조회 페이지를 위한 로직
    @GetMapping("/list")
    public PageResponseDTO<GolfDTO> getList(PageRequestDTO pageRequestDTO) {
        System.out.println("get list controller : " + pageRequestDTO);
        return service.getNonDeletedReservations(pageRequestDTO);
    }

    //관리자를 위한 예약 삭제
    @PostMapping("/delete")
    public void deleteChecked(@RequestBody List<Long> checkedReservationId) {
        System.out.println("checkedReservationId:" + checkedReservationId);
        checkedReservationId.forEach(reservationId -> {
            service.remove(reservationId);
        });

    }

    //예약 수정 메소드
    @PutMapping("/detail/{reservationId}") //detail 추가 1025
    public Map<String, String> modify(
            @PathVariable(name="reservationId") Long reservationId,
            @RequestBody GolfDTO golfDTO){
        golfDTO.setReservationId(reservationId);
        log.info("Modify: " + golfDTO);

        //날짜 ,시간,좌석번호로 예약 목록 중복 조회 메서드
        if(!service.isTimeAvailable(golfDTO.getDate(), golfDTO.getStartTime(), golfDTO.getEndTime(), golfDTO.getTeeBox())){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "해당 시간대는 이미 예약이 있습니다.");
        }
        service.modify(golfDTO);
        return Map.of("RESULT" , "SUCCESS");
    }

    //사용자 마이페이지 예약 조회
    @GetMapping("/myPage/{uno}")
    public ResponseEntity<PageResponseDTO<GolfDTO>> getUserReservations (
            @PathVariable Long uno,
            @ModelAttribute PageRequestDTO pageRequestDTO) {

        PageResponseDTO<GolfDTO> result = service.getUserReservations(uno, pageRequestDTO);
        System.out.println("1122"+result);
        return ResponseEntity.ok(result);
    }



    //예약 등록을 위한 로직

    @PostMapping("/reserve")
    public Long register(@RequestBody GolfDTO golfDTO) {
        System.out.println("golf register...."+golfDTO);

        //날짜 ,시간,좌석번호로 예약 목록 중복 조회 메서드
        if(!service.isTimeAvailable(golfDTO.getDate(), golfDTO.getStartTime(), golfDTO.getEndTime(), golfDTO.getTeeBox())){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "해당 시간대는 이미 예약이 있습니다.");
        }


        Long reservationId =  service.register(golfDTO);
        return reservationId;
    }

    //예약 가능한지 확인하는 메서드
    @GetMapping("/checkAvailability")
    public boolean checkAvailability (@RequestParam LocalDate date,
                                      @RequestParam LocalTime startTime,
                                      @RequestParam LocalTime endTime,
                                      @RequestParam int teeBox){
        return service.isTimeAvailable(date, startTime,endTime,teeBox);
    }



    //==========사용자의 uno, 이름, phone 불러오기================
    //수정 버튼 클릭시 이전 데이터 내용 불러오기
    @GetMapping({"/detail/{uno}"})
    public GolfDTO readUno(@PathVariable(name = "uno") Long uno) {
        System.out.println("데이터 조회: " + uno);
        return service.findDataByUno(uno);
    }
//    @GetMapping({"/detail/{uno}"})
//    public List<GolfDTO> readUno(@PathVariable(name = "uno") Long uno) {
//        User user = userRepository.findById(uno)
//                .orElseThrow(() -> new IllegalArgumentException("User not found"));
//        System.out.println("Retrieved golf for uno: " + user);
//        return service.findDataByUno(uno);
//    }
}
