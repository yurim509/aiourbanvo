package com.allinone.proja3.proja3.user;

import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.UserRole;
import com.allinone.proja3.proja3.repository.UserRepository;
import com.allinone.proja3.proja3.service.UserService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@SpringBootTest
public class RoleTests {
    @Autowired
    private UserRepository repository;
    @Autowired
    private UserService service;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void insertRolesRoot() {
        User userRoot = User.builder()
                .userName("유저재윤")
                .phone("유저재윤")
                .pw(passwordEncoder.encode("1111"))
                .build();
        userRoot.addRole(UserRole.USER);
        repository.save(userRoot);
    }

    @Test
    public void roleChangeRoot() {
        service.addRole(52L, UserRole.ROOT);
    }

    @Test
    public void insertRolesAdmin() {
        User yr = User.builder()
                .userName("정승균")
                .phone("정승균")
                .pw(passwordEncoder.encode("1111"))
                .build();
        yr.addRole(UserRole.ADMIN);
        repository.save(yr);
        User sg = User.builder()
                .userName("최유림")
                .phone("최유림")
                .pw(passwordEncoder.encode("1111"))
                .build();
        sg.addRole(UserRole.ADMIN);
        repository.save(sg);
        User jy = User.builder()
                .userName("전재윤")
                .phone("전재윤")
                .pw(passwordEncoder.encode("1111"))
                .build();
        jy.addRole(UserRole.ADMIN);
        repository.save(jy);
    }

    @Test
    public void insertRolesUser() {
        User userAdmin = User.builder()
                .userName("user")
                .phone("user")
                .pw(passwordEncoder.encode("1"))
                .dong("201")
                .ho("101")
                .build();
        userAdmin.addRole(UserRole.USER);
        repository.save(userAdmin);
    }

    @Test
    public void insertRolesPending() {
        for (int i = 0; i < 50; i++) {
            User userPending = User.builder()
                    .userName("pending"+(i+10))
                    .phone("pending"+(i+10))
                    .pw(passwordEncoder.encode("1"))
                    .build();
            userPending.addRole(UserRole.PENDING);
            repository.save(userPending);
        }
    }

    @Transactional
    @Test
    public void read() {
        List<String> list = new ArrayList<>();
        list.add("admin");
        list.add("pending");
        list.forEach(s -> System.out.println(repository.findByPhone(s)));
    }
}
