package com.allinone.proja3.proja3.service.parking;

import com.allinone.proja3.proja3.dto.parking.HouseholdDTO;
import com.allinone.proja3.proja3.model.parking.Household;
import com.allinone.proja3.proja3.model.parking.HouseholdPK;

public interface HouseholdService {
    HouseholdPK register(HouseholdDTO householdDTO);
    Household getHousehold(HouseholdDTO householdDTO);
    HouseholdDTO getHouseholdDTO(Household household);
}
