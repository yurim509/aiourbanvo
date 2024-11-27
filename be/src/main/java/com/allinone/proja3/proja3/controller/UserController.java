package com.allinone.proja3.proja3.controller;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.user.UserDTO;
import com.allinone.proja3.proja3.dto.user.UserSearchDataDTO;
import com.allinone.proja3.proja3.dto.user.UserSearchReqDTO;
import com.allinone.proja3.proja3.model.UserRole;
import com.allinone.proja3.proja3.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    @GetMapping("/list")
    public PageResponseDTO<UserDTO> getList(PageRequestDTO pageRequestDTO){
        System.out.println("User getList controller : "+ pageRequestDTO);
        return userService.getList(pageRequestDTO);
    }

    @PostMapping("/search")
    public PageResponseDTO<UserDTO> getSearchList(@RequestBody UserSearchReqDTO userSearchReqDTO){
        PageRequestDTO pageRequestDTO = userSearchReqDTO.getPageRequestDTO();
        UserSearchDataDTO userSearchDataDTO = userSearchReqDTO.getUserSearchDataDTO();
        System.out.println("User getSearchList controller P : "+pageRequestDTO);
        System.out.println("User getSearchList controller U : "+userSearchDataDTO);
        return userService.getSearchList(pageRequestDTO,userSearchDataDTO);
    }

    @GetMapping("/approval_list")
    public PageResponseDTO<UserDTO> getApprovalList(PageRequestDTO pageRequestDTO){
        System.out.println("User approval_list controller : "+ pageRequestDTO);
        return userService.getApprovalList(pageRequestDTO);
    }

    @GetMapping("/approval")
    public boolean getApprovalStatus(Long uno){
        System.out.println("User get approval controller : "+uno);
        return userService.approvalStatus(uno);
    }

    @PostMapping("/approval")
    public void PostApproval(@RequestBody Map<String, Long> request){
        Long uno = request.get("uno");
        System.out.println("User post approval controller : "+uno);
        userService.clearRole(uno);
        userService.addRole(uno, UserRole.USER);
    }

    @PostMapping("/")
    public void register(@RequestBody UserDTO userDTO){
        System.out.println("User register controller : "+userDTO);
        userService.register(userDTO);
    }

    @GetMapping("/{uno}")
    public UserDTO getOne(@PathVariable(name = "uno") Long uno){
        System.out.println("User getOne controller : "+uno);
        return userService.getOne(uno);
    }

    @PutMapping("/{uno}")
    public void putOne(@PathVariable(name = "uno") Long uno, @RequestBody UserDTO userDTO){
        System.out.println("User putOne controller : "+userDTO);
        userService.putOne(userDTO);
    }

    @PostMapping("/delete")
    public void deleteChecked(@RequestBody List<Long> checkedUno){
        checkedUno.forEach(uno ->{
            userService.clearRole(uno);
            userService.remove(uno);
        });
    }
}
