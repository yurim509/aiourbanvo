package com.allinone.proja3.proja3.user;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.user.UserDTO;
import com.allinone.proja3.proja3.dto.user.UserSearchDataDTO;
import com.allinone.proja3.proja3.model.UserRole;
import com.allinone.proja3.proja3.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ServiceTests {
    @Autowired
    private UserService userService;

    @Test
    public void insertTest() {
        for (int i = 0; i < 130; i++) {
            int randIdx = (int) (Math.random() * 100) + 1;
            int randho = (int) (Math.random() * 10) + 1;
            UserDTO userDTO = UserDTO.builder()
                    .dong(""+101+randIdx)
                    .ho(""+101+randho)
                    .userName("User"+randIdx)
                    .phone("0101234"+(1000+randIdx))
                    .pw("1111")
                    .delFlag(false)
                    .build();
            userService.register(userDTO);
        }
    }

    @Test
    public void getTest(){
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
                .page(1)
                .size(10)
                .build();
        PageResponseDTO<UserDTO> list = userService.getList(pageRequestDTO);
        list.getDtoList().forEach(System.out::println);
    }

    @Test
    public void addRoleUserTest(){
        userService.addRole(22L, UserRole.USER);
    }

    @Test
    public void approvalStatusTest(){
        boolean result = userService.approvalStatus(21L);
        System.out.println("--------------------"+result+"--------------------");
    }

    @Test
    public void getSearchListTest(){
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
                .page(1)
                .size(10)
                .build();
        UserSearchDataDTO userSearchDataDTO = UserSearchDataDTO.builder()
                .searchCategory("dong-ho")
                .searchValue("1-1")
                .build();
        PageResponseDTO<UserDTO> list = userService.getSearchList(pageRequestDTO, userSearchDataDTO);
        list.getDtoList().forEach(System.out::println);
    }

    @Test
    public void addRoleTest(){
        userService.addRole(78L, UserRole.USER);
    }

    @Test
    public void findPwTest(){
        Long user = userService.findPw("01011111111");
        System.out.println(user);
    }
}
