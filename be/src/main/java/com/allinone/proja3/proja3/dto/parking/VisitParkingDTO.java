package com.allinone.proja3.proja3.dto.parking;

import com.allinone.proja3.proja3.model.parking.Household;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VisitParkingDTO {
    private Long vpno;
    private Household household;
    private HouseholdDTO householdDTO;
    private String carNum;
    private String name;
    private String phone;
    private LocalDate expectedDate;
}
