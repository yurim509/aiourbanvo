package com.allinone.proja3.proja3.model.facilities;

import com.allinone.proja3.proja3.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "tbl_study")
@Data
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Study {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean delFlag;
    private int seatNum; // 독서실 시설 특성

    @ManyToOne // User와의 관계
    @JoinColumn(name = "uno", referencedColumnName = "uno") // Community 테이블의 uno 외래 키 설정
    private User user; // 작성자 (User 엔티티의 uno)

    //데이터 수정에 대한 메서드
    public void changeDate(LocalDate date) {
        this.date = date;
    }
    public void changeStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }
    public void changeEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
    public void changeSeatNum(int seatNum) {
        this.seatNum = seatNum;
    }
    public void changeState(boolean delFlag) {
        this.delFlag = delFlag;
    }

}
