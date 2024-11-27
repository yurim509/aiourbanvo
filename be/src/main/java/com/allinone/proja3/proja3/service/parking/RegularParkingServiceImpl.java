package com.allinone.proja3.proja3.service.parking;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.mileage.MileageDTO;
import com.allinone.proja3.proja3.dto.parking.*;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.parking.Household;
import com.allinone.proja3.proja3.model.parking.HouseholdPK;
import com.allinone.proja3.proja3.model.parking.RegularParking;
import com.allinone.proja3.proja3.repository.UserRepository;
import com.allinone.proja3.proja3.repository.parking.HouseholdRepository;
import com.allinone.proja3.proja3.repository.parking.RegularParkingRepository;
import com.allinone.proja3.proja3.service.mileage.MileageService;
import com.allinone.proja3.proja3.service.mileage.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
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
@Log4j2
public class RegularParkingServiceImpl implements RegularParkingService{
    private final RegularParkingRepository regularParkingRepository;
    private final HouseholdRepository householdRepository;
    private final MileageService mileageService;
    private final PaymentService paymentService;
    private final UserRepository userRepository;

    @Override
    public Long register(RegularParkingDTO regularParkingDTO) {
        System.out.println("RegularParking register service" + regularParkingDTO);
        householdReg(regularParkingDTO);
//        regularParkingDTO.setRegDate(LocalDate.parse("2024-09-01")); // 등록 날짜 Test 용도
        regularParkingDTO.setRegDate(LocalDate.now());
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
                Sort.by("rpno").descending());

        Page<RegularParking> result = regularParkingRepository.findAll(pageable);

        List<RegularParkingDTO> dtoList = result.getContent().stream()
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
                Sort.by("rpno").descending());

        Household household = Household.builder()
                .householdPK(HouseholdPK.builder()
                        .dong(householdDTO.getDong())
                        .ho(householdDTO.getHo())
                        .build())
                .build();

        Page<RegularParking> result = regularParkingRepository.findAllByHousehold(household, pageable);
        System.out.println(result);
        List<RegularParkingDTO> dtoList = result.getContent().stream()
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
    public PageResponseDTO<RegularParkingDTO> getSearchList(PageRequestDTO pageRequestDTO, RegularSearchDataDTO regularSearchDataDTO) {
        System.out.println("getSearchList service");
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("rpno").descending());

        // 검색 필터
        Page<RegularParking> result;
        switch (regularSearchDataDTO.getSearchCategory()){
            case "dong-ho": {
                String[] value = regularSearchDataDTO.getSearchValue().split("-");
                String dong = value[0];
                String ho = value[1];
                result = regularParkingRepository.findByDongHo(dong, ho, pageable);
            } break;
            case "dong": result = regularParkingRepository.findByDong(regularSearchDataDTO.getSearchValue(), pageable); break;
            case "ho": result = regularParkingRepository.findByHo(regularSearchDataDTO.getSearchValue(), pageable); break;
            case "name": result = regularParkingRepository.findByName(regularSearchDataDTO.getSearchValue(), pageable); break;
            case "phone": result = regularParkingRepository.findByPhone(regularSearchDataDTO.getSearchValue(), pageable); break;
            case "regDate" : {
                LocalDate start = regularSearchDataDTO.getRegDateStart();
                LocalDate end = regularSearchDataDTO.getRegDateEnd();
                result = regularParkingRepository.findByRegDate(start, end, pageable);
            } break;
            default: result = Page.empty(pageable);
        }

        // entityToDto를 사용하여 엔티티 -> DTO 변환
        List<RegularParkingDTO> dtoList = result.getContent().stream()
                .map(this::entityToDto)  // entityToDto 메서드를 사용하여 변환
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<RegularParkingDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    // 정기권 차량 마일리지 차감
    @Override
    public void monthlyRegularPayment() {
        List<RegularParking> regularList = regularParkingRepository.findAll();
        for (RegularParking regular : regularList) {
            LocalDate regDate = regular.getRegDate();
            LocalDate now = LocalDate.now();
            LocalDate lastPaymentDate = regular.getLastPaymentDate();
            if (lastPaymentDate == null) lastPaymentDate = regDate;

            // 결제일이 한달 이상 지났을 경우 누적 처리
            while (now.isAfter(lastPaymentDate.plusMonths(1)) || now.isEqual(lastPaymentDate)) {
                try {
                    mileagePayment(regular);
                    lastPaymentDate = lastPaymentDate.plusMonths(1);
                    regular.setLastPaymentDate(lastPaymentDate);
                    regularParkingRepository.save(regular);
                } catch (Exception e) {
                    log.error("Failed monthlyRegularPayment, rpno : {}", regular.getRpno());
                    break;
                }
            }
        }
    }

    // 마일리지 차감 로직
    private void mileagePayment(RegularParking regularParking){
        int amount = 5000; // 정기권 결제 금액(추후 금액 설정 기능 추가)
        String description = "정기권 차량 결제 "+amount+"원";
        String dong = regularParking.getHousehold().getHouseholdPK().getDong();
        String ho = regularParking.getHousehold().getHouseholdPK().getHo();
        MileageDTO mileageDTO = mileageService.findByDongHoDTO(dong, ho);
        List<User> userList = userRepository.findAllByDongAndHo(dong, ho);
        // 가장 먼저 등록한 유저를 결제할 유저로 판단 (추후 세대주 속성을 추가하여 판단)
        Long uno = userList.stream().min(Comparator.comparingLong(User::getUno)).get().getUno();
        if (mileageDTO == null) {
            log.error("mileageDTO is null");
            throw new RuntimeException("mileageDTO is null");
        }
        paymentService.processUseMileage(dong, ho, uno, amount, description);
        log.info("Regular Payment / dong:{}, ho:{}, amount:{}", dong, ho, amount);
    }

    @Override
    public void remove(Long rpno) {
        System.out.println("RegularParking remove service : "+rpno);
        regularParkingRepository.deleteById(rpno);
    }

    @Override
    public RegularParkingDTO getOne(Long rpno) {
        System.out.println("RegularParking getOne service : "+rpno);
        Optional<RegularParking> result = regularParkingRepository.findById(rpno);
        RegularParking regularParking = result.orElseThrow();
        return entityToDto(regularParking);
    }

    @Override
    public void putOne(RegularParkingDTO regularParkingDTO, Long rpno) {
        System.out.println("RegularParking putOne service : "+regularParkingDTO);

        Household household = householdReg(regularParkingDTO);

        Optional<RegularParking> result = regularParkingRepository.findById(rpno);

        RegularParking updateRegular = result.orElseThrow();
        RegularParking regularParking = dtoToEntity(regularParkingDTO);

        updateRegular.setHousehold(household);
        updateRegular.setCarNum(regularParking.getCarNum());
        updateRegular.setName(regularParking.getName());
        updateRegular.setPhone(regularParking.getPhone());
        updateRegular.setRegDate(regularParking.getRegDate());

        regularParkingRepository.save(updateRegular);
    }

    private RegularParking dtoToEntity(RegularParkingDTO regularParkingDTO) {
        return RegularParking.builder()
                .rpno(regularParkingDTO.getRpno())
                .household(regularParkingDTO.getHousehold())
                .carNum(regularParkingDTO.getCarNum())
                .name(regularParkingDTO.getName())
                .phone(regularParkingDTO.getPhone())
                .regDate(regularParkingDTO.getRegDate())
                .lastPaymentDate(regularParkingDTO.getLastPaymentDate())
                .build();
    }

    private RegularParkingDTO entityToDto(RegularParking regularParking) {
        return RegularParkingDTO.builder()
                .rpno(regularParking.getRpno())
                .household(regularParking.getHousehold())
                .carNum(regularParking.getCarNum())
                .name(regularParking.getName())
                .phone(regularParking.getPhone())
                .regDate(regularParking.getRegDate())
                .lastPaymentDate(regularParking.getLastPaymentDate())
                .build();
    }

    private Household householdReg(RegularParkingDTO regularParkingDTO) {
        HouseholdPK householdPK = HouseholdPK.builder()
                .dong(regularParkingDTO.getHouseholdDTO().getDong())
                .ho(regularParkingDTO.getHouseholdDTO().getHo())
                .build();
        Household household = Household.builder()
                .householdPK(householdPK)
                .build();
        return householdRepository.save(household);
    }
}
