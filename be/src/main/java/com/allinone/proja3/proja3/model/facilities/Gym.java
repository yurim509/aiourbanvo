package com.allinone.proja3.proja3.model.facilities;

import com.allinone.proja3.proja3.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_gym")
@Data
@ToString(exclude = "participants")
@Builder
@AllArgsConstructor
@NoArgsConstructor
//관리자 헬스장 프로그램 등록(헬스장과 별도)
public class Gym {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long programId;
    private LocalDate programStartDate; //프로그램 시작일
    private LocalDate programEndDate; //프로그램 종료일
    private LocalTime programStartTime; //프로그램 시작 시간
    private LocalTime programEndTime;//프로그램 종료 시간
    private LocalDateTime applicationEndDate; //접수기간 종료일
    private LocalDateTime applicationStartDate; //접수기간 시작일
    private int participantLimit; //모집정원
    private int currentParticipants; // 현재 참가 인원
    private String title;
    private String target;
    private String content;
    private boolean delFlag;
    private ProgramState programState;//프로그램등록 상태 접수마감(:대기)/접수중/접수전/프로그램종료

    @PostLoad
    @PrePersist
    @PreUpdate
    public void updateProgramState() {
        LocalDateTime now = LocalDateTime.now();///현재 시간으로 기준으로 사용하려는 로직으로 변경하고 이 함수 호출
        if(now.isBefore(applicationStartDate)) {
            this.programState = ProgramState.NOT_STARTED;
        } else if (now.isAfter(applicationEndDate)) {
            this.programState = ProgramState.CLOSED;
        }else if (currentParticipants >= participantLimit) {
            this.programState = ProgramState.WAITLIST;
        } else {
            this.programState = ProgramState.AVAILABLE;
        }
    }

    @ManyToOne // User와의 관계
    @JoinColumn(name = "uno", referencedColumnName = "uno") // Community 테이블의 uno 외래 키 설정
    private User user; // 작성자 (User 엔티티의 uno)

    @OneToMany(mappedBy = "gym", cascade = CascadeType.ALL)
    private List<GymParticipant> participants;
    //참가 신청 메서드
    public boolean registerParticipant(){
        System.out.println("registerParticipant !!!! 111 ");
        if(currentParticipants < participantLimit) {
            currentParticipants++; // 현재 참가 인원 증가
            updateProgramState(); // 프로그램 상태 업데이트
            return true;//성공적으로 등록
    } else {
        //모집정원이 다 찼을때 대기자 처리 로직
        return false; // 등록 실패
        }
    }


    //데이터 수정에 대한 메서드
    public void changeProgramStartDate (LocalDate programStartDate) {this.programStartDate = programStartDate;}
    public void changeProgramEndDate (LocalDate programEndDate) { this.programEndDate = programEndDate;}
    public void changeProgramStartTime (LocalTime programStartTime) {this.programStartTime = programStartTime;}
    public void changeProgramEndTime (LocalTime programEndTime) {this.programEndTime = programEndTime;}
    public void changeTitle (String title) { this.title = title;}
    public void changeTarget (String target) { this.target = target;}
    public void changeContent (String content) {this.content = content; }
    public void changeApplicationStartDate (LocalDateTime applicationStartDate) {this.applicationStartDate = applicationStartDate; }
    public void changeApplicationEndDate (LocalDateTime applicationEndDate) {this.applicationEndDate = applicationEndDate; }
    public void changeParticipantLimit (int participantLimit) {this.participantLimit = participantLimit; }
    public void changeProgramState (ProgramState programState) {this.programState = programState; }


}
