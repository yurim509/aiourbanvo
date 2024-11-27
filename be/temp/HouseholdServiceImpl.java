package com.allinone.proja3.proja3.service.parking;

import com.allinone.proja3.proja3.dto.parking.HouseholdDTO;
import com.allinone.proja3.proja3.dto.parking.RegularParkingDTO;
import com.allinone.proja3.proja3.model.parking.Household;
import com.allinone.proja3.proja3.model.parking.HouseholdPK;
import com.allinone.proja3.proja3.model.parking.RegularParking;
import com.allinone.proja3.proja3.repository.parking.HouseholdRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HouseholdServiceImpl implements HouseholdService {
    private final HouseholdRepository householdRepository;

    @Override
    public HouseholdPK register(HouseholdDTO householdDTO) {
        System.out.println("Household register service : "+householdDTO);
        Household household = dtoToEntity(householdDTO);
        Household result = householdRepository.save(household);
        return result.getHouseholdPK();
    }

    @Override
    public Household getHousehold(HouseholdDTO householdDTO) {
        return Household.builder()
                .householdPK(HouseholdPK.builder()
                        .dong(householdDTO.getDong())
                        .ho(householdDTO.getHo())
                        .build())
                .build();
    }

    @Override
    public HouseholdDTO getHouseholdDTO(Household household) {
        return entityToDto(household);
    }

    private Household dtoToEntity(HouseholdDTO householdDTO) {
        return Household.builder()
                .householdPK(HouseholdPK.builder()
                        .dong(householdDTO.getDong())
                        .ho(householdDTO.getHo())
                        .build())
                .build();
    }

    private HouseholdDTO entityToDto(Household household) {
        return HouseholdDTO.builder()
                .dong(household.getHouseholdPK().getDong())
                .ho(household.getHouseholdPK().getHo())
                .build();
    }
}
