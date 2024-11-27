package com.allinone.proja3.proja3.controller.superAdmin;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.superAdmin.AddRoleReqDTO;
import com.allinone.proja3.proja3.dto.user.UserDTO;
import com.allinone.proja3.proja3.dto.user.UserSearchDataDTO;
import com.allinone.proja3.proja3.dto.user.UserSearchReqDTO;
import com.allinone.proja3.proja3.model.UserRole;
import com.allinone.proja3.proja3.service.UserService;
import com.allinone.proja3.proja3.service.mileage.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/superAdmin")
public class SuperAdminController {
    private final UserService userService;
    private final PaymentService paymentService;

    @GetMapping("/list")
    public PageResponseDTO<UserDTO> getAllList(PageRequestDTO pageRequestDTO){
        System.out.println("superAdmin getList controller : "+ pageRequestDTO);
        return userService.getAllList(pageRequestDTO);
    }

    @PostMapping("/search")
    public PageResponseDTO<UserDTO> getAllSearchList(@RequestBody UserSearchReqDTO userSearchReqDTO){
        PageRequestDTO pageRequestDTO = userSearchReqDTO.getPageRequestDTO();
        UserSearchDataDTO userSearchDataDTO = userSearchReqDTO.getUserSearchDataDTO();
        System.out.println("User getSearchList controller P : "+pageRequestDTO);
        System.out.println("User getSearchList controller U : "+userSearchDataDTO);
        return userService.getAllSearchList(pageRequestDTO,userSearchDataDTO);
    }

    @PostMapping("/addRole")
    public Long addRole(@RequestBody AddRoleReqDTO addRoleReqDTO){
        Long uno = addRoleReqDTO.getUno();
        String roleStr = addRoleReqDTO.getRole();
        UserRole role;
        switch (roleStr){
            case ("PENDING") : role = UserRole.PENDING; break;
            case ("USER") : role = UserRole.USER; break;
            case ("ADMIN") : role = UserRole.ADMIN; break;
            case ("ROOT") : role = UserRole.ROOT; break;
            default: {
                userService.clearRole(uno);
                return uno;
            }
        }
        System.out.println("superAdmin addRole controller U : "+ uno);
        System.out.println("superAdmin addRole controller R : "+ roleStr);
        return userService.addRole(uno, role);
    }

    @PostMapping("/delete")
    public void deleteChecked(@RequestBody List<Long> checkedUno){
        checkedUno.forEach(userService::hardRemove);
    }
}
