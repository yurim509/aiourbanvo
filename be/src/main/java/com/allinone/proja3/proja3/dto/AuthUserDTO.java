package com.allinone.proja3.proja3.dto;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class AuthUserDTO extends User {
    private Long uno;
    private String dong;
    private String ho;
    private String userName;
    private String phone;
    private String pw;
    private boolean delFlag;
    private List<String> roleNames = new ArrayList<>();

    public AuthUserDTO(
            Long uno,
            String dong,
            String ho,
            String userName,
            String phone,
            String pw,
            boolean delFlag,
            List<String> roleNames
    ) {
        super(
                phone,
                pw,
                roleNames.stream().map(str ->
                                new SimpleGrantedAuthority("ROLE_" + str))
                        .collect(Collectors.toList())
        );
        this.uno = uno;
        this.dong = dong;
        this.ho = ho;
        this.userName = userName;
        this.phone = phone;
        this.pw = pw;
        this.delFlag = delFlag;
        this.roleNames = roleNames;
    }

    public Map<String, Object> getClaims(){
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("uno",uno);
        dataMap.put("dong",dong);
        dataMap.put("ho",ho);
        dataMap.put("userName",userName);
        dataMap.put("phone",phone);
        dataMap.put("pw",pw);
        dataMap.put("delFlag",delFlag);
        dataMap.put("roleNames",roleNames);
        return dataMap;
    }
}
