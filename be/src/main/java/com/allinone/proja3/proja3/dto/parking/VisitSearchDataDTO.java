package com.allinone.proja3.proja3.dto.parking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VisitSearchDataDTO {
    private String searchCategory;
    private String searchValue;
    private LocalDate expectedDateStart;
    private LocalDate expectedDateEnd;
}
