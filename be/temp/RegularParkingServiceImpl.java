package com.allinone.proja3.proja3.service.parking;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.parking.HouseholdDTO;
import com.allinone.proja3.proja3.dto.parking.RegularParkingDTO;
import com.allinone.proja3.proja3.model.parking.Household;
import com.allinone.proja3.proja3.model.parking.RegularParking;
import com.allinone.proja3.proja3.repository.parking.HouseholdRepository;
import com.allinone.proja3.proja3.repository.parking.RegularParkingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegularParkingServiceImpl implements RegularParkingService{
    private final RegularParkingRepository regularParkingRepository;
    private final HouseholdRepository householdRepository;
    private final HouseholdService householdService;

    @Override
    public Long register(RegularParkingDTO regularParkingDTO) {
        System.out.println("RegularParking register service" + regularParkingDTO);
        regularParkingDTO.setRegDate(LocalDate.now());
        householdService.register(regularParkingDTO.getHouseholdDTO());
        RegularParking regularParking = dtoToEntity(regularParkingDTO);
        RegularParking result = regularParkingRepository.save(regularParking);
        return result.getRpno();
    }

    @Override
    public PageResponseDTO<RegularParkingDTO> getList(PageRequestDTO pageRequestDTO) {
        System.out.println("RegularParking getList service");
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("regDate").descending());

        Page<RegularParking> result = regularParkingRepository.findAll(pageable);

        List<RegularParkingDTO> dtoList = result.get()
                .map(this::entityToDto)
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<RegularParkingDTO>withAll()
                .dtoList(dtoList)

                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public PageResponseDTO<RegularParkingDTO> getUserList(PageRequestDTO pageRequestDTO, HouseholdDTO householdDTO) {
        System.out.println("RegularParking getUserList service");
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("regDate").descending());


        Household household = householdService.getHousehold(householdDTO);
        Page<RegularParking> result = regularParkingRepository.findAllByHousehold(household, pageable);

        List<RegularParkingDTO> dtoList = result.get()
                .map(this::entityToDto)
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<RegularParkingDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public void remove(Long rpno) {
        System.out.println("remove service : "+rpno);
        regularParkingRepository.deleteById(rpno);
    }

    private RegularParking dtoToEntity(RegularParkingDTO regularParkingDTO) {
        Household household = householdService.getHousehold(regularParkingDTO.getHouseholdDTO());
        return RegularParking.builder()
                .rpno(regularParkingDTO.getRpno())
                .household(household)
                .carNum(regularParkingDTO.getCarNum())
                .name(regularParkingDTO.getName())
                .phone(regularParkingDTO.getPhone())
                .regDate(regularParkingDTO.getRegDate())
                .build();
    }

    private RegularParkingDTO entityToDto(RegularParking regularParking) {
        HouseholdDTO householdDTO = householdService.getHouseholdDTO(regularParking.getHousehold());
        return RegularParkingDTO.builder()
                .rpno(regularParking.getRpno())
                .householdDTO(householdDTO)
                .carNum(regularParking.getCarNum())
                .name(regularParking.getName())
                .phone(regularParking.getPhone())
                .regDate(regularParking.getRegDate())
                .build();
    }
}
