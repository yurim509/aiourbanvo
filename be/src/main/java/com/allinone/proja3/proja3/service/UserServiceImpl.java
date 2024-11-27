package com.allinone.proja3.proja3.service;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.mileage.CardInfoDTO;
import com.allinone.proja3.proja3.dto.user.ChangePwReqDTO;
import com.allinone.proja3.proja3.dto.user.UserDTO;
import com.allinone.proja3.proja3.dto.user.UserSearchDataDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.UserRole;
import com.allinone.proja3.proja3.repository.UserRepository;
import com.allinone.proja3.proja3.repository.mileage.CardInfoRepository;
import com.allinone.proja3.proja3.service.facilities.SmsService;
import com.allinone.proja3.proja3.service.mileage.CardInfoService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CardInfoService cardInfoService;
    private final SmsService smsService;

    @Override
    public Long register(UserDTO userDTO) {
        System.out.println("register service : "+userDTO);
        String encodedPassword = passwordEncoder.encode(userDTO.getPw());
        userDTO.setPw(encodedPassword);
        User user = dtoToEntity(userDTO);
        User result = userRepository.save(user);
        System.out.println("register service : "+user);
        return result.getUno();
    }

    @Override
    public PageResponseDTO<UserDTO> getList(PageRequestDTO pageRequestDTO) {
        System.out.println("getList service");
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("uno").descending());

        Page<User> result = userRepository.findByUserRoleListNotContainingAndDelFlagFalse(UserRole.PENDING, pageable);// PENDING 이 아닌 유저만 필터링

        // entityToDto를 사용하여 엔티티 -> DTO 변환
        List<UserDTO> dtoList = result.getContent().stream()
                .map(this::entityToDto)  // entityToDto 메서드를 사용하여 변환
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<UserDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public PageResponseDTO<UserDTO> getAllList(PageRequestDTO pageRequestDTO) {
        System.out.println("getAllList service");
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("uno").descending());

        Page<User> result = userRepository.findAll(pageable);

        // entityToDto를 사용하여 엔티티 -> DTO 변환
        List<UserDTO> dtoList = result.getContent().stream()
                .map(this::entityToDto)  // entityToDto 메서드를 사용하여 변환
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<UserDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public PageResponseDTO<UserDTO> getSearchList(PageRequestDTO pageRequestDTO, UserSearchDataDTO userSearchDataDTO) {
        System.out.println("getSearchList service");
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("uno").descending());

        // 검색 필터
        Page<User> result;
        switch (userSearchDataDTO.getSearchCategory()){
            case "dong-ho": {
                String[] value = userSearchDataDTO.getSearchValue().split("-");
                String dong = value[0];
                String ho = value[1];
                result = userRepository.findByDongContainingAndHoContainingAndDelFlagFalse(dong, ho, pageable);
            } break;
            case "dong": result = userRepository.findByDongContainingAndDelFlagFalse(userSearchDataDTO.getSearchValue(), pageable); break;
            case "ho": result = userRepository.findByHoContainingAndDelFlagFalse(userSearchDataDTO.getSearchValue(), pageable); break;
            case "name": result = userRepository.findByUserNameContainingAndDelFlagFalse(userSearchDataDTO.getSearchValue(), pageable); break;
            case "phone": result = userRepository.findByPhoneContainingAndDelFlagFalse(userSearchDataDTO.getSearchValue(), pageable); break;
            case "role": {
                UserRole userRole = switch (userSearchDataDTO.getSearchValue()) {
                    case "PENDING" -> UserRole.PENDING;
                    case "USER" -> UserRole.USER;
                    case "ADMIN" -> UserRole.ADMIN;
                    case "ROOT" -> UserRole.ROOT;
                    default -> null;
                };
                result = userRepository.findByUserRoleListContainingAndDelFlagFalse(userRole, pageable); break;
            }
            default: result = Page.empty(pageable);
        }

        // entityToDto를 사용하여 엔티티 -> DTO 변환
        List<UserDTO> dtoList = result.getContent().stream()
                .map(this::entityToDto)  // entityToDto 메서드를 사용하여 변환
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<UserDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public PageResponseDTO<UserDTO> getAllSearchList(PageRequestDTO pageRequestDTO, UserSearchDataDTO userSearchDataDTO) {
        System.out.println("getSearchList service");
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("uno").descending());

        // 검색 필터
        Page<User> result;
        switch (userSearchDataDTO.getSearchCategory()){
            case "dong-ho": {
                String[] value = userSearchDataDTO.getSearchValue().split("-");
                String dong = value[0];
                String ho = value[1];
                result = userRepository.findByDongContainingAndHoContaining(dong, ho, pageable);
            } break;
            case "dong": result = userRepository.findByDongContaining(userSearchDataDTO.getSearchValue(), pageable); break;
            case "ho": result = userRepository.findByHoContaining(userSearchDataDTO.getSearchValue(), pageable); break;
            case "name": result = userRepository.findByUserNameContaining(userSearchDataDTO.getSearchValue(), pageable); break;
            case "phone": result = userRepository.findByPhoneContaining(userSearchDataDTO.getSearchValue(), pageable); break;
            case "delFlag": {
                boolean delFlag = userSearchDataDTO.getSearchValue().equals("true");
                result = userRepository.findByDelFlag(delFlag, pageable);
            } break;
            case "role": {
                UserRole userRole = switch (userSearchDataDTO.getSearchValue()) {
                    case "PENDING" -> UserRole.PENDING;
                    case "USER" -> UserRole.USER;
                    case "ADMIN" -> UserRole.ADMIN;
                    case "ROOT" -> UserRole.ROOT;
                    default -> null;
                };
                result = userRepository.findByUserRoleListContaining(userRole, pageable); break;
            }
            default: result = Page.empty(pageable);
        }

        // entityToDto를 사용하여 엔티티 -> DTO 변환
        List<UserDTO> dtoList = result.getContent().stream()
                .map(this::entityToDto)  // entityToDto 메서드를 사용하여 변환
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<UserDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public PageResponseDTO<UserDTO> getApprovalList(PageRequestDTO pageRequestDTO) {
        System.out.println("getApprovalList service");
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("uno").descending());

        Page<User> result = userRepository.findByUserRoleListContainingAndDelFlagFalse(UserRole.PENDING, pageable); // PENDING 유저만 필터링

        // entityToDto를 사용하여 엔티티 -> DTO 변환
        List<UserDTO> dtoList = result.getContent().stream()
                .map(this::entityToDto)  // entityToDto 메서드를 사용하여 변환
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        return PageResponseDTO.<UserDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public UserDTO getOne(Long uno) {
        System.out.println("getOne service : "+uno);
        Optional<User> result = userRepository.findById(uno);
        User user = result.orElseThrow();
        System.out.println("getOne service : "+user);
        return entityToDto(user);
    }

    @Override
    public void putOne(UserDTO userDTO) {
        System.out.println("putOne service : "+userDTO);
        String encodedPassword = passwordEncoder.encode(userDTO.getPw());
        userDTO.setPw(encodedPassword);
        User user = dtoToEntity(userDTO);
        userRepository.save(user);
    }

    @Override
    public void remove(Long uno) {
        System.out.println("remove service : "+uno);
        userRepository.updateToDelete(uno, true);
    }

    @Override
    public void hardRemove(Long uno) {
        System.out.println("hard remove service : "+uno);
        cardInfoService.deleteCardByUserId(uno);
        userRepository.deleteById(uno);
    }

    @Override
    public boolean approvalStatus(Long uno) {
        System.out.println("approvalStatus service : "+uno);
        Optional<User> result = userRepository.findById(uno);
        User user = result.orElseThrow();
        return user.getUserRoleList().contains(UserRole.PENDING);
    }

    @Override
    public Long addRole(Long uno, UserRole role) {
        System.out.println("addRoleUser service : "+uno);
        Optional<User> result = userRepository.findById(uno);
        User user = result.orElseThrow();
        user.clearRole();
        user.addRole(role);
        userRepository.save(user);
        return uno;
    }

    @Override
    public void clearRole(Long uno) {
        System.out.println("clearRole service : "+uno);
        Optional<User> result = userRepository.findById(uno);
        User user = result.orElseThrow();
        user.clearRole();
    }

    @Override
    public String verify(String phone) {
        // 랜덤 인증번호 생성
        SecureRandom rand = new SecureRandom(); // 보안을 위해 SecureRandom 사용
        String verifyNum = String.format("%06d", rand.nextInt(1000000));
        String sendStr = "Urban 인증번호 전송\n"+"["+verifyNum+"]";

        // 전화번호 국가코드 변환
        String newPhone = "+82"+phone.substring(1);
//        smsService.sendConfirmationMessage(newPhone, sendStr);
        log.info(newPhone);
        return verifyNum;
    }

    @Override
    public Long findPw(String phone) {
        User user = userRepository.findByPhone(phone);
        log.info("findPw service (P): {}", phone);
        log.info("findPw service (U): {}", user);
        if (user == null){
            throw new NullPointerException("해당 번호로 가입된 사용자가 없습니다");
        } else {
            return user.getUno();
        }
    }

    private User dtoToEntity(UserDTO userDTO) {
        return User.builder()
                .uno(userDTO.getUno())
                .dong(userDTO.getDong())
                .ho(userDTO.getHo())
                .userName(userDTO.getUserName())
                .phone(userDTO.getPhone())
                .pw(userDTO.getPw())
                .delFlag(userDTO.isDelFlag())
                .userRoleList(userDTO.getUserRoleList())
                .build();
    }

    private UserDTO entityToDto(User user) {
        return UserDTO.builder()
                .uno(user.getUno())
                .dong(user.getDong())
                .ho(user.getHo())
                .userName(user.getUserName())
                .phone(user.getPhone())
                .pw(user.getPw())
                .delFlag(user.isDelFlag())
                .userRoleList(user.getUserRoleList())
                .build();
    }
}
