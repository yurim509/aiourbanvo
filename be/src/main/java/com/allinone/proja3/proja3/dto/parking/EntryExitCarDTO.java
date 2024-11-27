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
public class EntryExitCarDTO {
    private Long eeno;
    private String carNum;
    private boolean isExit;
    private String dong;
    private String ho;
    private LocalDate entryDate;
    private LocalDate exitDate;
}
