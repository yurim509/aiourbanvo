package com.allinone.proja3.proja3.service.parking;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.parking.*;
import com.allinone.proja3.proja3.model.parking.EntryExitCar;
import com.allinone.proja3.proja3.model.parking.Household;
import com.allinone.proja3.proja3.model.parking.HouseholdPK;
import com.allinone.proja3.proja3.model.parking.VisitParking;
import com.allinone.proja3.proja3.repository.parking.EntryExitCarRepository;
import com.allinone.proja3.proja3.repository.parking.HouseholdRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EntryExitCarServiceImpl implements EntryExitCarService{
    private final EntryExitCarRepository entryExitCarRepository;
    private final HouseholdRepository householdRepository;

    @Override
    public Long entry(EntryExitCarDTO entryExitCarDTO) {
        System.out.println("EntryExitCar entry service" + entryExitCarDTO);
        EntryExitCar entryExitCar = dtoToEntity(entryExitCarDTO);
//        entryExitCar.setEntryDate(LocalDate.parse("2024-01-01")); // Date test
        entryExitCar.setEntryDate(LocalDate.now());
        EntryExitCar result = entryExitCarRepository.save(entryExitCar);
        return result.getEeno();
    }

    @Override
    public void exit(EntryExitCarDTO entryExitCarDTO) {
        System.out.println("EntryExitCar exit service" + entryExitCarDTO);
        List<EntryExitCar> exitList = entryExitCarRepository.findAllByCarNum(entryExitCarDTO.getCarNum());
        // 가장 최근에 입차한 차량의 isExit 를 true 로 설정 ... 이하

        // eeno 가 가장 큰 값을 최근에 입차한 차량으로 판단
        // 최근 입차 차량의 exitDate 를 현재 시간으로 설정
        exitList.stream()
                .max(Comparator.comparingLong(EntryExitCar::getEeno))
                .filter(exit -> !exit.isExit()) //
//                .ifPresent(exit -> exit.setExitDate(LocalDate.parse("2024-01-05"))); // Date test
                .ifPresent(exit -> exit.setExitDate(LocalDate.now()));

        // 중복 입차된 동일 차량의 isExit 를 true 로 하여 출차 처리
        exitList.forEach(exit ->{
            exit.setExit(true);
        });
        entryExitCarRepository.saveAll(exitList);
    }

    @Override
    public void remove(Long eeno) {
        entryExitCarRepository.deleteById(eeno);
    }

    @Override
    public PageResponseDTO<EntryExitCarDTO> getList(PageRequestDTO pageRequestDTO) {
        System.out.println("EntryExitCar getList service");
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("eeno").descending());

        Page<EntryExitCar> result = entryExitCarRepository.findAll(pageable);

        List<EntryExitCarDTO> dtoList = result.getContent().stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<EntryExitCarDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public PageResponseDTO<EntryExitCarDTO> getUserList(PageRequestDTO pageRequestDTO, HouseholdDTO householdDTO) {
        System.out.println("EntryExitCar getUserList service");
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("eeno").descending());

        Page<EntryExitCar> result = entryExitCarRepository
                .findAllByDongAndHo(householdDTO.getDong(), householdDTO.getHo(), pageable);

        List<EntryExitCarDTO> dtoList = result.getContent().stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<EntryExitCarDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public PageResponseDTO<EntryExitCarDTO> getSearchList(PageRequestDTO pageRequestDTO, EntryExitSearchDataDTO entryExitSearchDataDTO) {
        System.out.println("EntryExitCar getSearchList service");
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("eeno").descending());

        // 검색 필터
        Page<EntryExitCar> result;
        switch (entryExitSearchDataDTO.getSearchCategory()) {
            case "dong-ho": {
                String[] value = entryExitSearchDataDTO.getSearchValue().split("-");
                String dong = value[0];
                String ho = value[1];
                result = entryExitCarRepository.findByDongContainingAndHoContaining(dong, ho, pageable);
            }
            break;
            case "dong":
                result = entryExitCarRepository.findByDongContaining(entryExitSearchDataDTO.getSearchValue(), pageable);
                break;
            case "ho":
                result = entryExitCarRepository.findByHoContaining(entryExitSearchDataDTO.getSearchValue(), pageable);
                break;
            case "carNum":
                result = entryExitCarRepository.findByCarNumContaining(entryExitSearchDataDTO.getSearchValue(), pageable);
                break;
            case "isExit":
                boolean isExit = entryExitSearchDataDTO.getSearchValue().equals("exit");
                result = entryExitCarRepository.findAllByIsExit(isExit, pageable);
                break;
            case "entryDate": {
                LocalDate start = entryExitSearchDataDTO.getEntryExitDateStart();
                LocalDate end = entryExitSearchDataDTO.getEntryExitDateEnd();
                result = entryExitCarRepository.findByEntryDateBetween(start, end, pageable);
            }
            break;
            case "exitDate": {
                LocalDate start = entryExitSearchDataDTO.getEntryExitDateStart();
                LocalDate end = entryExitSearchDataDTO.getEntryExitDateEnd();
                result = entryExitCarRepository.findByExitDateBetween(start, end, pageable);
            }
            break;
            default:
                result = Page.empty(pageable);
        }

        // entityToDto를 사용하여 엔티티 -> DTO 변환
        List<EntryExitCarDTO> dtoList = result.getContent().stream()
                .map(this::entityToDto)  // entityToDto 메서드를 사용하여 변환
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<EntryExitCarDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    private EntryExitCar dtoToEntity(EntryExitCarDTO entryExitCarDTO) {
        return EntryExitCar.builder()
                .eeno(entryExitCarDTO.getEeno())
                .carNum(entryExitCarDTO.getCarNum())
                .dong(entryExitCarDTO.getDong())
                .ho(entryExitCarDTO.getHo())
                .isExit(entryExitCarDTO.isExit())
                .entryDate(entryExitCarDTO.getEntryDate())
                .exitDate(entryExitCarDTO.getExitDate())
                .build();
    }

    private EntryExitCarDTO entityToDto(EntryExitCar entryExitCar) {
        return EntryExitCarDTO.builder()
                .eeno(entryExitCar.getEeno())
                .carNum(entryExitCar.getCarNum())
                .dong(entryExitCar.getDong())
                .ho(entryExitCar.getHo())
                .isExit(entryExitCar.isExit())
                .entryDate(entryExitCar.getEntryDate())
                .exitDate(entryExitCar.getExitDate())
                .build();
    }

    private Household householdReg(EntryExitCarDTO entryExitCarDTO) {
        HouseholdPK householdPK = HouseholdPK.builder()
                .dong(entryExitCarDTO.getDong())
                .ho(entryExitCarDTO.getHo())
                .build();
        Household household = Household.builder()
                .householdPK(householdPK)
                .build();
        return householdRepository.save(household);
    }
}
