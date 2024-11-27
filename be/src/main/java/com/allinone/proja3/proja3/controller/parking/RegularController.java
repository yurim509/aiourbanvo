package com.allinone.proja3.proja3.controller.parking;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.mileage.MileageHistoryDTO;
import com.allinone.proja3.proja3.dto.parking.*;
import com.allinone.proja3.proja3.model.parking.Household;
import com.allinone.proja3.proja3.model.parking.HouseholdPK;
import com.allinone.proja3.proja3.service.community.MarketService;
import com.allinone.proja3.proja3.service.mileage.MileageService;
import com.allinone.proja3.proja3.service.mileage.PaymentService;
import com.allinone.proja3.proja3.service.parking.RegularParkingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/parking/regular")
public class RegularController {
    private final RegularParkingService regularParkingService;

    @GetMapping("/list")
    public PageResponseDTO<RegularParkingDTO> getList(PageRequestDTO pageRequestDTO) {
        System.out.println("RegularParking getList controller : " + pageRequestDTO);
        return regularParkingService.getList(pageRequestDTO);
    }

    @PostMapping("/user_list")
    public PageResponseDTO<RegularParkingDTO> getUserList(@RequestBody RegularReqDTO regularReqDTO) {
        PageRequestDTO pageRequestDTO = regularReqDTO.getPageRequestDTO();
        HouseholdDTO householdDTO = regularReqDTO.getHouseholdDTO();
        System.out.println("RegularParking getList controller P : " + pageRequestDTO);
        System.out.println("RegularParking getList controller H : " + householdDTO);
        return regularParkingService.getUserList(pageRequestDTO, householdDTO);
    }

    @PostMapping("/search")
    public PageResponseDTO<RegularParkingDTO> getSearchList(@RequestBody RegularReqDTO regularReqDTO){
        PageRequestDTO pageRequestDTO = regularReqDTO.getPageRequestDTO();
        RegularSearchDataDTO regularSearchDataDTO = regularReqDTO.getRegularSearchDataDTO();
        System.out.println("Regular getSearchList controller P : "+pageRequestDTO);
        System.out.println("Regular getSearchList controller U : "+regularSearchDataDTO);
        return regularParkingService.getSearchList(pageRequestDTO,regularSearchDataDTO);
    }

    @PostMapping("/delete")
    public void deleteChecked(@RequestBody List<Long> checkedRpno) {
        System.out.println("RegularParking getList controller : " + checkedRpno);
        checkedRpno.forEach(regularParkingService::remove);
    }

    @PostMapping("/")
    public void register(@RequestBody RegularParkingDTO regularParkingDTO) {
        System.out.println("RegularParking register : " + regularParkingDTO);
        regularParkingDTO.setHousehold(Household.builder()
                .householdPK(HouseholdPK.builder()
                        .dong(regularParkingDTO.getHouseholdDTO().getDong())
                        .ho(regularParkingDTO.getHouseholdDTO().getHo())
                        .build())
                .build());
        regularParkingService.register(regularParkingDTO);
    }

    @GetMapping("/{rpno}")
    public RegularParkingDTO getOne(@PathVariable(name = "rpno") Long rpno){
        System.out.println("RegularParking getOne rpno : " + rpno);
        return regularParkingService.getOne(rpno);
    }

    @PutMapping("/{rpno}")
    public void putOne(@PathVariable(name = "rpno") Long rpno, @RequestBody RegularParkingDTO regularParkingDTO){
        System.out.println("modify : "+regularParkingDTO);
        regularParkingService.putOne(regularParkingDTO, rpno);
    }
}
