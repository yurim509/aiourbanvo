package com.allinone.proja3.proja3.dto.facilities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GolfDTO {
    private long reservationId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean delFlag;
    private int teeBox; //골프장 시설 특성

    //user에서 가져올데이터
    private Long uno; // 사용자 ID
    private String userName; // 사용자 이름 추가
    private String phone;
}
