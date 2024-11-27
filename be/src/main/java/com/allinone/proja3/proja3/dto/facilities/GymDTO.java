package com.allinone.proja3.proja3.dto.facilities;

import com.allinone.proja3.proja3.dto.user.UserDTO;
import com.allinone.proja3.proja3.model.facilities.ProgramState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GymDTO {
    private long programId;
    private LocalDate programStartDate;
    private LocalDate programEndDate;
    private LocalTime programStartTime; //프로그램 시작 시간
    private LocalTime programEndTime;//프로그램 종료 시간
    private LocalDateTime applicationEndDate; //접수기간 종료일
    private LocalDateTime applicationStartDate; //접수기간 시작일
    private int participantLimit; //모집정원
    private int currentParticipants; // 현재 참가 인원
    private List<UserDTO> participants;

    private String title;
    private String target;
    private String content;
    private boolean delFlag;
    private ProgramState programState;

    public GymDTO(String title, String target, String content){
        this.title =title;
        this.target=target;
        this.content=content;
    }
//    private int point;

    //user에서 가져올데이터
//    private Long uno; // 사용자 ID
//    private String userName; // 사용자 이름 추가
//    private String phone;

}
