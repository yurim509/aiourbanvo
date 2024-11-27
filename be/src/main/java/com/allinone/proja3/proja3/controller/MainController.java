package com.allinone.proja3.proja3.controller;

import com.allinone.proja3.proja3.dto.user.ChangePwReqDTO;
import com.allinone.proja3.proja3.dto.user.UserDTO;
import com.allinone.proja3.proja3.model.UserRole;
import com.allinone.proja3.proja3.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/main")
public class MainController {
    private static final Logger log = LoggerFactory.getLogger(MainController.class);
    private final UserService userService;

    @PostMapping("/join")
    public void register(@RequestBody UserDTO userDTO){
        System.out.println("register : "+userDTO);
        Long uno = userService.register(userDTO);
        userService.addRole(uno, UserRole.PENDING);
    }

    @PostMapping("/verify")
    public String verifyPhone(@RequestParam String phone){
        System.out.println("verify : "+ phone);
        return userService.verify(phone);
    }

    @PostMapping("/findPw")
    public Long findPw(@RequestParam String phone){
        System.out.println("findPw : "+ phone);
        return userService.findPw(phone);
    }

    @PostMapping("/changePw")
    public void changePw(@RequestBody ChangePwReqDTO changePwReqDTO){
        System.out.println("changePw : "+ changePwReqDTO);
        UserDTO userDTO = userService.getOne(changePwReqDTO.getUno());
        userDTO.setPw(changePwReqDTO.getPw());
        userService.putOne(userDTO);
    }
}
