package com.allinone.proja3.proja3.model.parking;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tbl_entry_car")
public class EntryExitCar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eeno;

    private String carNum;
    private boolean isExit;
    private String dong;
    private String ho;
    private LocalDate entryDate;
    private LocalDate exitDate;
}