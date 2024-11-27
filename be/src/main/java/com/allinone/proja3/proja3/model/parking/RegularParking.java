package com.allinone.proja3.proja3.model.parking;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_regular_parking")
public class RegularParking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rpno;

    // 외래키로 참조
    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "household_dong", referencedColumnName = "dong"),
            @JoinColumn(name = "household_ho", referencedColumnName = "ho")
    })
    private Household household;

    private String carNum;
    private String name;
    private String phone;
    private LocalDate regDate;
    private LocalDate lastPaymentDate;
}