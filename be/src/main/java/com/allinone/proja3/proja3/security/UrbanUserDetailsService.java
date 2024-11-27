package com.allinone.proja3.proja3.security;

import com.allinone.proja3.proja3.dto.AuthUserDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UrbanUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("loadUserByUserName... : "+username);
        User user = userRepository.findByPhone(username);
        if (user == null){
            throw new UsernameNotFoundException("Not Found");
        }
        AuthUserDTO authUserDTO = new AuthUserDTO(
                user.getUno(),
                user.getDong(),
                user.getHo(),
                user.getUserName(),
                user.getPhone(),
                user.getPw(),
                user.isDelFlag(),
                user.getUserRoleList()
                        .stream()
                        .map(Enum::name)
                        .collect(Collectors.toList()));
        System.out.println("loadUserByUserName...[userDTO] : "+authUserDTO);
        return authUserDTO;
    }
}
