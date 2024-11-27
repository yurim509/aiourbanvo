package com.allinone.proja3.proja3.service.parking;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.parking.HouseholdDTO;
import com.allinone.proja3.proja3.dto.parking.VisitParkingDTO;
import com.allinone.proja3.proja3.dto.parking.VisitReqDTO;
import com.allinone.proja3.proja3.dto.parking.VisitSearchDataDTO;
import com.allinone.proja3.proja3.model.parking.Household;
import com.allinone.proja3.proja3.model.parking.HouseholdPK;
import com.allinone.proja3.proja3.model.parking.VisitParking;
import com.allinone.proja3.proja3.repository.parking.HouseholdRepository;
import com.allinone.proja3.proja3.repository.parking.VisitParkingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisitParkingServiceImpl implements VisitParkingService {
    private final VisitParkingRepository visitParkingRepository;
    private final HouseholdRepository householdRepository;

    @Override
    public Long register(VisitParkingDTO visitParkingDTO) {
        System.out.println("VisitParking register service" + visitParkingDTO);
        householdReg(visitParkingDTO);
        VisitParking visitParking = dtoToEntity(visitParkingDTO);
        VisitParking result = visitParkingRepository.save(visitParking);
        return result.getVpno();
    }

    @Override
    public PageResponseDTO<VisitParkingDTO> getList(PageRequestDTO pageRequestDTO) {
        System.out.println("VisitParking getList service");
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("vpno").descending());

        Page<VisitParking> result = visitParkingRepository.findAll(pageable);

        List<VisitParkingDTO> dtoList = result.getContent().stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<VisitParkingDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public PageResponseDTO<VisitParkingDTO> getUserList(PageRequestDTO pageRequestDTO, HouseholdDTO householdDTO) {
        System.out.println("VisitParking getUserList service");
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("vpno").descending());

        Household household = Household.builder()
                .householdPK(HouseholdPK.builder()
                        .dong(householdDTO.getDong())
                        .ho(householdDTO.getHo())
                        .build())
                .build();

        Page<VisitParking> result = visitParkingRepository.findAllByHousehold(household, pageable);
        System.out.println("getUserList-------------------------"+result);
        List<VisitParkingDTO> dtoList = result.getContent().stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<VisitParkingDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public PageResponseDTO<VisitParkingDTO> getSearchList(PageRequestDTO pageRequestDTO, VisitSearchDataDTO visitSearchDataDTO) {
        System.out.println("getSearchList service");
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("vpno").descending());

        // 검색 필터
        Page<VisitParking> result;
        switch (visitSearchDataDTO.getSearchCategory()) {
            case "dong-ho": {
                String[] value = visitSearchDataDTO.getSearchValue().split("-");
                String dong = value[0];
                String ho = value[1];
                result = visitParkingRepository.findByDongHo(dong, ho, pageable);
            }
            break;
            case "dong":
                result = visitParkingRepository.findByDong(visitSearchDataDTO.getSearchValue(), pageable);
                break;
            case "ho":
                result = visitParkingRepository.findByHo(visitSearchDataDTO.getSearchValue(), pageable);
                break;
            case "name":
                result = visitParkingRepository.findByName(visitSearchDataDTO.getSearchValue(), pageable);
                break;
            case "phone":
                result = visitParkingRepository.findByPhone(visitSearchDataDTO.getSearchValue(), pageable);
                break;
            case "expectedDate": {
                LocalDate start = visitSearchDataDTO.getExpectedDateStart();
                LocalDate end = visitSearchDataDTO.getExpectedDateEnd();
                result = visitParkingRepository.findByExpectedDate(start, end, pageable);
            }
            break;
            default:
                result = Page.empty(pageable);
        }

        // entityToDto를 사용하여 엔티티 -> DTO 변환
        List<VisitParkingDTO> dtoList = result.getContent().stream()
                .map(this::entityToDto)  // entityToDto 메서드를 사용하여 변환
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<VisitParkingDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public void remove(Long vpno) {
        System.out.println("VisitParking remove service : " + vpno);
        visitParkingRepository.deleteById(vpno);
    }

    @Override
    public VisitParkingDTO getOne(Long vpno) {
        System.out.println("VisitParking getOne service : " + vpno);
        Optional<VisitParking> result = visitParkingRepository.findById(vpno);
        VisitParking visitParking = result.orElseThrow();
        return entityToDto(visitParking);
    }

    @Override
    public void putOne(VisitParkingDTO visitParkingDTO, Long vpno) {
        System.out.println("VisitParking putOne service : " + visitParkingDTO);

        Household household = householdReg(visitParkingDTO);

        Optional<VisitParking> result = visitParkingRepository.findById(vpno);

        VisitParking updateVisit = result.orElseThrow();
        VisitParking visitParking = dtoToEntity(visitParkingDTO);

        updateVisit.setHousehold(household);
        updateVisit.setCarNum(visitParking.getCarNum());
        updateVisit.setName(visitParking.getName());
        updateVisit.setPhone(visitParking.getPhone());
        updateVisit.setExpectedDate(visitParking.getExpectedDate());

        visitParkingRepository.save(updateVisit);
    }

    private VisitParking dtoToEntity(VisitParkingDTO visitParkingDTO) {
        return VisitParking.builder()
                .vpno(visitParkingDTO.getVpno())
                .household(visitParkingDTO.getHousehold())
                .carNum(visitParkingDTO.getCarNum())
                .name(visitParkingDTO.getName())
                .phone(visitParkingDTO.getPhone())
                .expectedDate(visitParkingDTO.getExpectedDate())
                .build();
    }

    private VisitParkingDTO entityToDto(VisitParking visitParking) {
        return VisitParkingDTO.builder()
                .vpno(visitParking.getVpno())
                .household(visitParking.getHousehold())
                .carNum(visitParking.getCarNum())
                .name(visitParking.getName())
                .phone(visitParking.getPhone())
                .expectedDate(visitParking.getExpectedDate())
                .build();
    }

    private Household householdReg(VisitParkingDTO visitParkingDTO) {
        HouseholdPK householdPK = HouseholdPK.builder()
                .dong(visitParkingDTO.getHouseholdDTO().getDong())
                .ho(visitParkingDTO.getHouseholdDTO().getHo())
                .build();
        Household household = Household.builder()
                .householdPK(householdPK)
                .build();
        return householdRepository.save(household);
    }
}
