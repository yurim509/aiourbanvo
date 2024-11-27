package com.allinone.proja3.proja3.controller.parking;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.parking.*;
import com.allinone.proja3.proja3.model.parking.Household;
import com.allinone.proja3.proja3.model.parking.HouseholdPK;
import com.allinone.proja3.proja3.service.parking.VisitParkingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/parking/visit")
public class VisitController {
    private final VisitParkingService visitParkingService;

    @GetMapping("/list")
    public PageResponseDTO<VisitParkingDTO> getList(PageRequestDTO pageRequestDTO) {
        System.out.println("VisitParking getList controller : " + pageRequestDTO);
        return visitParkingService.getList(pageRequestDTO);
    }

    @PostMapping("/user_list")
    public PageResponseDTO<VisitParkingDTO> getUserList(@RequestBody VisitReqDTO visitReqDTO) {
        PageRequestDTO pageRequestDTO = visitReqDTO.getPageRequestDTO();
        HouseholdDTO householdDTO = visitReqDTO.getHouseholdDTO();
        System.out.println("VisitParking getList controller pageRequestDTO : " + pageRequestDTO);
        System.out.println("VisitParking getList controller householdDTO : " + householdDTO);
        return visitParkingService.getUserList(pageRequestDTO, householdDTO);
    }

    @PostMapping("/search")
    public PageResponseDTO<VisitParkingDTO> getSearchList(@RequestBody VisitReqDTO visitReqDTO){
        PageRequestDTO pageRequestDTO = visitReqDTO.getPageRequestDTO();
        VisitSearchDataDTO visitSearchDataDTO = visitReqDTO.getVisitSearchDataDTO();
        System.out.println("Visit getSearchList controller pageRequestDTO : "+pageRequestDTO);
        System.out.println("Visit getSearchList controller visitSearchDataDTO : "+ visitSearchDataDTO);
        return visitParkingService.getSearchList(pageRequestDTO, visitSearchDataDTO);
    }

    @PostMapping("/delete")
    public void deleteChecked(@RequestBody List<Long> checkedVpno) {
        System.out.println("VisitParking getList controller : " + checkedVpno);
        checkedVpno.forEach(visitParkingService::remove);
    }

    @PostMapping("/")
    public void register(@RequestBody VisitParkingDTO visitParkingDTO) {
        System.out.println("VisitParking register : " + visitParkingDTO);
        visitParkingDTO.setHousehold(Household.builder()
                .householdPK(HouseholdPK.builder()
                        .dong(visitParkingDTO.getHouseholdDTO().getDong())
                        .ho(visitParkingDTO.getHouseholdDTO().getHo())
                        .build())
                .build());
        visitParkingService.register(visitParkingDTO);
    }

    @GetMapping("/{vpno}")
    public VisitParkingDTO getOne(@PathVariable(name = "vpno") Long vpno){
        System.out.println("VisitParking getOne vpno : "+vpno);
        return visitParkingService.getOne(vpno);
    }

    @PutMapping("/{vpno}")
    public void putOne(@PathVariable(name = "vpno") Long vpno, @RequestBody VisitParkingDTO visitParkingDTO){
        System.out.println("VisitParking putOne : "+ visitParkingDTO);
        visitParkingService.putOne(visitParkingDTO, vpno);
    }
}
