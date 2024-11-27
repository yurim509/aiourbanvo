package com.allinone.proja3.proja3.controller.parking;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.UserDTO;
import com.allinone.proja3.proja3.dto.parking.HouseholdDTO;
import com.allinone.proja3.proja3.dto.parking.RegularParkingDTO;
import com.allinone.proja3.proja3.model.UserRole;
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
    public PageResponseDTO<RegularParkingDTO> getList(PageRequestDTO pageRequestDTO){
        System.out.println("RegularParking getList controller : " + pageRequestDTO);
        return regularParkingService.getList(pageRequestDTO);
    }
    @GetMapping("/user_list")
    public PageResponseDTO<RegularParkingDTO> getUserList(PageRequestDTO pageRequestDTO, @RequestBody HouseholdDTO householdDTO){
        System.out.println("RegularParking getList controller : " + pageRequestDTO);
        return regularParkingService.getList(pageRequestDTO);
    }

    @PostMapping("/delete")
    public void deleteChecked(@RequestBody List<Long> checkedRpno){
        System.out.println("RegularParking getList controller : " + checkedRpno);
        checkedRpno.forEach(regularParkingService::remove);
    }

    @PostMapping("/")
    public void register(@RequestBody RegularParkingDTO regularParkingDTO){
        System.out.println("register : "+regularParkingDTO);
        regularParkingService.register(regularParkingDTO);
    }
}
