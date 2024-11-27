package com.allinone.proja3.proja3.service.facilities;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.facilities.GolfDTO;
import com.allinone.proja3.proja3.dto.facilities.StudyDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.facilities.Golf;
import com.allinone.proja3.proja3.model.facilities.Study;
import com.allinone.proja3.proja3.repository.UserRepository;
import com.allinone.proja3.proja3.repository.facilities.GolfRepository;
import jakarta.persistence.Id;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GolfServiceImpl implements GolfService {

    private final GolfRepository golfRepository;
    private final UserRepository userRepository;

    @Override
    public Long register(GolfDTO golfDTO) {

//        // 예약 유효성 검증
        String validationMessage = validateReservationDetails(golfDTO);
        if(!"valid".equals(validationMessage)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, validationMessage);
        }


        Golf golf = dtoToEntity(golfDTO);
        Golf result = golfRepository.save(golf);
        return result.getReservationId();
    }

    @Override
    public PageResponseDTO<GolfDTO> getList(PageRequestDTO pageRequestDTO) {
        System.out.println("getList....");
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("reservationId").descending());

        Page<Golf> result = golfRepository.findAll(pageable);

        List<GolfDTO> dtoList = result.getContent() // getContent()로 실제 내용 가져오기
                .stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<GolfDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();

    }
    //예약시 오류처리
//    @Override
//    public String validateReservation(LocalDate date, LocalTime startTime, LocalTime endTime, int teeBox) {
//        //시간 유효성 체크
//        String timeValidationResult = isValidReservation(date, startTime, endTime);
//        if(!timeValidationResult.equals("valid")) {
//            return timeValidationResult;
//        }
//        //중복예약 체크
//        if(!isTimeAvailable(date, startTime, endTime,teeBox)) {
//            return "이미 예약된 시간입니다. 다른 시간을 선택해주세요.";
//        }
//        return "예약 가능합니다.";
//    }
    //중복 예약 확인 메서드 구현
    @Override
    public boolean isTimeAvailable(LocalDate date, LocalTime startTime, LocalTime endTime, int teeBox) {
        List<Golf> existingReservations = golfRepository.findByDateAndTime(date, startTime,endTime,teeBox);

        return existingReservations.isEmpty(); //예약이 없다면 true 반환
    }
    //시간 유효성 체크 로직
    @Override
    public String validateReservationDetails(GolfDTO golfDTO) {
        LocalDate today = LocalDate.now();

        if(golfDTO.getDate().isBefore(today)) {
            return "예약 날짜는 오늘 이후여야 합니다. ";
        }
        //시작시간이 현재보다 이전인 경우 검사 (오늘 예약에 한해서)
        if(golfDTO.getDate().isEqual(today)&& golfDTO.getStartTime().isBefore(LocalTime.now())){
            return  "예약 시작 시간은 현재 시간 이후여야 합니다.";
        }

        //시작시간이 종료시간보다 이후인 경우검사
        if(golfDTO.getStartTime().isAfter(golfDTO.getEndTime())) {
            return "예약 시작 시간은 종료 시간보다 이전이어야 합니다.";
        }
        return "valid";

    }


    //나의 예약 조회
    @Override
    public PageResponseDTO<GolfDTO> getUserReservations(Long uno, PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage()-1, pageRequestDTO.getSize(),
                Sort.by("reservationId").descending());

        // 엔티티를 조회
//        List<Golf> reservations = golfRepository.findByUserUno(uno, pageable);
//        Page<Golf> result = golfRepository.findByUserUno(uno, pageable);
        Page<Golf> result = golfRepository.findNonDeletedReservationsByUserUno(uno, pageable);
        // 엔티티를 DTO로 변환
        List<GolfDTO> dtoList = result.getContent()
                .stream()
                .map(this::entityToDto)  // 엔티티 -> DTO 변환
                .collect(Collectors.toList());

        // 총 예약 수
        long totalCount = result.getTotalElements();

        // DTO 리스트와 PageRequestDTO를 사용해 PageResponseDTO를 생성하여 반환
        return PageResponseDTO.<GolfDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }


    //===========삭제메서드==========
    @Transactional
    @Override
    public void remove(Long reservationId) {
        System.out.println("remove service: " + reservationId);
        golfRepository.updateToDelete(reservationId, true);
    }

    @Override
    public PageResponseDTO<GolfDTO> getNonDeletedReservations(PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize());
        Page<Golf> result = golfRepository.findNonDeletedReservations(pageable);

        List<GolfDTO> dtoList = result.getContent().stream()
                .map(e->entityToDto(e))
                .collect(Collectors.toList());

        return PageResponseDTO.<GolfDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(result.getTotalElements())
                .build();
    }

    //=========수정메서드==========
    @Override
    public void modify(GolfDTO golfDTO) {
        // 예약 유효성 검증
        String validationMessage = validateReservationDetails(golfDTO);
        if(!"valid".equals(validationMessage)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, validationMessage);
        }
        System.out.println("golf modify !!!!");
        Optional<Golf> result = golfRepository.findById(golfDTO.getReservationId());
        Golf golf = result.orElseThrow();
        golf.changeDate(golfDTO.getDate());
        golf.changeStartTime(golfDTO.getStartTime());
        golf.changeEndTime(golfDTO.getEndTime());
        golf.changeTeeBox(golfDTO.getTeeBox());
        golf.changeState(golfDTO.isDelFlag());
        golfRepository.save(golf);
    }


    //==========사용자의 uno, 이름, phone 불러오기================


    @Override
    public GolfDTO findDataByUno(Long uno) {
        System.out.println("golf service : " + uno );
        Golf golf = golfRepository.findById(uno)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        GolfDTO dto = this.entityToDto(golf);
        return dto;
    }


    //레시피 → 요리 (dtoToEntity)
    // 클라이언트로부터 받은 정보를 바탕으로 실제 데이터베이스에 저장할 수 있는 형식으로 변환합니다.
    private Golf dtoToEntity(GolfDTO golfDTO) {
        //dtoList에 user 데이터 연동
        User user = userRepository.findById(golfDTO.getUno())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return Golf.builder()
                .reservationId(golfDTO.getReservationId())
                .date(golfDTO.getDate())
                .startTime(golfDTO.getStartTime())
                .endTime(golfDTO.getEndTime())
                .teeBox(golfDTO.getTeeBox())
                //dtoList에 user 데이터 연동
                .user(user)
                .build();
    }

    //요리 → 레시피 (entityToDto)
    // 데이터베이스에서 가져온 정보를 클라이언트에게 전달하기 위해 필요한 형태로 정리합니다.
    private GolfDTO entityToDto(Golf golf) {
        return GolfDTO.builder()
                .reservationId(golf.getReservationId())
                .date(golf.getDate())
                .teeBox(golf.getTeeBox())
                .startTime(golf.getStartTime())
                .endTime(golf.getEndTime())
                //dtoList에 user 데이터 연동
                .uno(golf.getUser() != null ? golf.getUser().getUno() : null) // 사용자 ID
                .userName(golf.getUser() != null ? golf.getUser().getUserName() : null) // 사용자 이름
                .phone(golf.getUser() != null ? golf.getUser().getPhone() : null) // 사용자 전화번호
                .build();
    }

}
