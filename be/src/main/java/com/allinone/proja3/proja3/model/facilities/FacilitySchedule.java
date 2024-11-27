package com.allinone.proja3.proja3.model.facilities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;


@Entity
@Table(name = "tbl_schedule")
@Data
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FacilitySchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    private String facilityName;
    private LocalTime startTime;
    private LocalTime endTime;

}
