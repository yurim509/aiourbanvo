package com.allinone.proja3.proja3.model.parking;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tbl_household")
public class Household {
    @EmbeddedId
    private HouseholdPK householdPK;
}
