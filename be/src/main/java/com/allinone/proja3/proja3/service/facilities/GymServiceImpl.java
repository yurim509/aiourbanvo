package com.allinone.proja3.proja3.service.facilities;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.SearchPageRequestDTO;
import com.allinone.proja3.proja3.dto.SearchPageResponseDTO;
import com.allinone.proja3.proja3.dto.facilities.GymDTO;
import com.allinone.proja3.proja3.dto.user.UserDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.facilities.*;
import com.allinone.proja3.proja3.repository.UserRepository;
import com.allinone.proja3.proja3.repository.facilities.GymParticipantRepository;
import com.allinone.proja3.proja3.repository.facilities.GymRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.allinone.proja3.proja3.model.facilities.QGym.gym;

@Log4j2
@Service
@RequiredArgsConstructor
public class GymServiceImpl implements GymService {

    private final GymRepository gymRepository;
    private final UserRepository userRepository;
    private final GymParticipantRepository gymParticipantRepository;
    private final SmsService smsService;

//    @Autowired
//    public GymServiceImpl(SmsService smsService) {
//        this.smsService = smsService;
//    }


    @PersistenceContext
    private EntityManager entityManager;

    //게시글 등록 메서드
    @Override
    public Gym newProgramPost(Gym gym) {
        gym.setCurrentParticipants(0);  //프로그램 등록 시 기본 참가 인원수를 0으로 설정
        System.out.println("service gym: " + gym);
        return gymRepository.save(gym);
    }

    //선택한 게시글 상세조회 메서드
    @Override
    public GymDTO getProgramPost(Long programId) {
        Gym gym = gymRepository.findByProgramId(programId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + programId));
        return entityToDto(gym);
    }

    //조회 리스트
    @Override
    public SearchPageResponseDTO<GymDTO> getNonDeletedPrograms(SearchPageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize());
        Page<Gym> result = gymRepository.findNonDeletedPrograms(pageable);


        List<GymDTO> dtoList = result.getContent().stream()
                .map(e -> entityToDto(e))
                .collect(Collectors.toList());
        return SearchPageResponseDTO.<GymDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(result.getTotalElements())
                .build();

    }

    //게시글 삭제
    @Transactional  //프로그램 조회와 프로그램상세내용이 묶여있으므로 transactional을 넣어야만 두개가 세트로 묶여 삭제가 정상처리됨
    @Override
    public void remove(Long programId) {
        System.out.println("remove service: " + programId);
        gymRepository.updateToDelete(programId, true);
    }

    //게시글 수정
    @Override
    public void modify(GymDTO gymDTO) {
        System.out.println("gym modify !!!!");
        Optional<Gym> result = gymRepository.findById(gymDTO.getProgramId());
        Gym gym = result.orElseThrow();
        gym.changeTitle(gymDTO.getTitle());
        gym.changeContent(gymDTO.getContent());
        gym.changeTarget(gymDTO.getTarget());
        gym.changeProgramStartDate(gymDTO.getProgramStartDate());
        gym.changeProgramEndDate(gymDTO.getProgramEndDate());
        gym.changeApplicationStartDate(gymDTO.getApplicationStartDate());
        gym.changeApplicationEndDate(gymDTO.getApplicationEndDate());
        gym.changeProgramStartTime(gymDTO.getProgramStartTime());
        gym.changeProgramEndTime(gymDTO.getProgramEndTime());
        gym.changeParticipantLimit(gymDTO.getParticipantLimit());
        gym.changeProgramState(gymDTO.getProgramState());
        gymRepository.save(gym);

    }

    //수정시 기존내용 유지 로직
    @Override
    public GymDTO findDataByProgramId(Long programId) {
        System.out.println("gym service" + programId);
        Gym gym = gymRepository.findById(programId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        GymDTO dto = this.entityToDto(gym);
        return dto;
    }

    //참가자 등록 메서드
    @Override
    public String registerParticipant(Long programId, User user) {
        Gym gym = gymRepository.findById(programId)
                .orElseThrow(() -> new EntityNotFoundException("post not found with Id: " + programId));
        boolean isAlreadyRegistered = gymParticipantRepository.existsByGymAndUser(gym, user);
        if (isAlreadyRegistered) {
            return "Already";
        }

        //모집인원 확인 및 참가자 등록처리
        if (gym.getCurrentParticipants() < gym.getParticipantLimit()) {
            gym.setCurrentParticipants(gym.getCurrentParticipants() + 1);

            GymParticipant participant = new GymParticipant();
            participant.setGym(gym);
            participant.setUser(user);
            participant.setWaitlisted(false); //정식참가자로 등록

            gymParticipantRepository.save(participant);  // 중간 엔티티 저장
            gym.updateProgramState();  // 상태 업데이트
            gymRepository.save(gym);

            if(participant.isWaitlisted()) {
                //프로그램 이름과 상세 정보를 포함한 메시지 생성
                String messageText = user.getUserName() + "님, 프로그램: [" + gym.getTitle() + "] 신청이 완료되었습니다.";
                System.out.println(messageText);
                // 참가 신청 완료 후 알림 메시지 전송
//                boolean isSent = smsService.sendConfirmationMessage(user.getPhone(), messageText);
//                System.out.println("1212" + user + " " + isSent);
//                if (isSent) {
//                    System.out.println("메시지가 성공적으로 전송되었습니다.");
//                } else {
//                    System.out.println("메시지 전송에 실패했습니다.");
//                }
            }

            return "Done";
        } else {
            return "Over";

        }
    }

    //대기자 등록 로직
    @Override
    public String registerWaitlist(Long programId, User user) {
        Gym gym = gymRepository.findById(programId)
                .orElseThrow(() -> new EntityNotFoundException("Program not found with Id: " + programId));

        // 이미 정식 참가자로 등록된 경우 확인
        boolean isAlreadyRegistered = gymParticipantRepository.existsByGymAndUserAndWaitlisted(gym, user, false);
        if (isAlreadyRegistered) {
            return "Already registered"; // 이미 정식 참가자로 등록된 경우
        }

        // 이미 대기자로 등록된 경우 확인
        boolean isAlreadyWaitlisted = gymParticipantRepository.existsByGymAndUserAndWaitlisted(gym, user, true);
        if (isAlreadyWaitlisted) {
            return "Already on waitlist"; // 이미 대기자에 등록되어 있는 경우
        }

        // 정식 참가자가 인원이 다 찼을 때 대기자 등록 로직 수행
        GymParticipant waitlistParticipant = new GymParticipant();
        waitlistParticipant.setGym(gym);
        waitlistParticipant.setUser(user);
        waitlistParticipant.setWaitlisted(true);

        gymParticipantRepository.save(waitlistParticipant);
        return "Added to waitlist"; // 대기자 등록 성공
    }


    //취소 로직
    //1)참가취소 메서드

    @Override
    public String cancelParticipant(Long programId, User user) {
        Gym gym = gymRepository.findById(programId)
                .orElseThrow(()-> new EntityNotFoundException("Program not found with Id: " + programId));
        //참가자 여부 확인
        GymParticipant participant = gymParticipantRepository.findByGymAndUserAndWaitlisted(gym, user, false)
                .orElseThrow(()-> new EntityNotFoundException("Participant not found for this program"));

        //참가자 취소 및 인원 감소
        gym.setCurrentParticipants(gym.getCurrentParticipants() -1);
        gymParticipantRepository.delete(participant);

        //대기자 목록에서 가장 오래된 대기자를 참가자로 등록
        Optional<GymParticipant> oldestWaitlistedParticipant = gymParticipantRepository.findFirstByGymAndWaitlistedOrderByCreatedAtAsc(gym, true);

        if(oldestWaitlistedParticipant.isPresent()) {
            GymParticipant waitlistParticipant = oldestWaitlistedParticipant.get();
            waitlistParticipant.setWaitlisted(false); //대기자에서 정식참가자로 변경
            gym.setCurrentParticipants(gym.getCurrentParticipants()+1); // 참가자 수 증가
            gymParticipantRepository.save(waitlistParticipant);
            log.info("Oldest waitlist participant registered as official participant: {}", waitlistParticipant);



            //프로그램 이름과 상세 정보를 포함한 메시지 생성
//            String messageText ="안녕하세요! " + waitlistParticipant.getUser().getUserName()+"님, 귀하께서 대기 중이던 프로그램: ["+gym.getTitle() +"]에 참가자로 등록되어 상태가 변경되었음을 알려드립니다. 감사합니다! ";
//            System.out.println("1212"+messageText);
//            smsService.sendConfirmationMessage(waitlistParticipant.getUser().getPhone(), messageText);


        }else {
            log.info("No waitlisted participants. Just canceled.");
            return "Canceled";
        }
        gym.updateProgramState();
        gymRepository.save(gym);

        return "Canceled and updated";
    }
    //2) 대기자 취소 메서드
    @Override
    public String cancelWaitlist(Long programId, User user) {
        Gym gym = gymRepository.findById(programId)
                .orElseThrow(() -> new EntityNotFoundException("Program not found with Id: " + programId));
        //대기자 여부 확인 및 삭제
        GymParticipant waitlistParticipant = gymParticipantRepository.findByGymAndUserAndWaitlisted(gym, user, true)
                .orElseThrow(() -> new EntityNotFoundException("Waitlist entry not found for this program"));
        gymParticipantRepository.delete(waitlistParticipant);
        return "Waitlist Canceled";
    }
    //유저에 따른 참가 프로그램 조회(마이페이지)
    @Override
    public List<GymDTO> getProgramsByUser(Long uno) {
        User user = userRepository.findById(uno)
                .orElseThrow(()-> new EntityNotFoundException("User not found with id: " + uno));
        // 해당 사용자의 참가 정보 조회
        List<GymParticipant> participants  =  gymParticipantRepository.findByUserAndWaitlisted(user,false);
        return participants.stream()
                .map(participant -> {
                    Gym gym = participant.getGym();
                    // 해당 프로그램에 등록된 사용자 정보 가져오기
                    List<UserDTO> userDTOS = gymParticipantRepository.findByGym(gym).stream()
                            .filter(p -> p.getUser().getUno().equals(uno)) //참가자중 해당 유저의 정보만가져오기
                            .map(p-> {
                                User userInGym = p.getUser();
                                return UserDTO.builder() //프로그램 신청한 유저정보가져오기
                                        .uno(userInGym.getUno())
                                        .userName(userInGym.getUserName())
                                        .phone(userInGym.getPhone())
                                        .build();
                            })
                            .collect(Collectors.toList());
                    return GymDTO.builder()  //프로그램 정보가져오기
                            .programState(gym.getProgramState())
                            .programId(gym.getProgramId())
                            .title(gym.getTitle())
                            .content(gym.getContent())
                            .programStartDate(gym.getProgramStartDate())
                            .programEndDate(gym.getProgramEndDate())
                            .participants(userDTOS)
                            .build();
                })
                .collect(Collectors.toList());

    }
    //유저에 따른 대기중인 프로그램 조회(마이페이지)
    @Override
    public List<GymDTO> getWaitlistByUser(Long uno) {
        User user = userRepository.findById(uno)
                .orElseThrow(()-> new EntityNotFoundException("User not found with id: " + uno));
        // 해당 사용자의 참가 정보 조회
        List<GymParticipant> participants  =  gymParticipantRepository.findByUserAndWaitlisted(user,true);
        return participants.stream()
                .map(participant -> {
                    Gym gym = participant.getGym();
                    // 해당 프로그램에 등록된 사용자 정보 가져오기
                    List<UserDTO> userDTOS = gymParticipantRepository.findByGym(gym).stream()
                            .filter(p -> p.getUser().getUno().equals(uno)) //참가자중 해당 유저의 정보만가져오기
                            .map(p-> {
                                User userInGym = p.getUser();
                                return UserDTO.builder() //프로그램 신청한 유저정보가져오기
                                        .uno(userInGym.getUno())
                                        .userName(userInGym.getUserName())
                                        .phone(userInGym.getPhone())
                                        .build();
                            })
                            .collect(Collectors.toList());
                    return GymDTO.builder()  //프로그램 정보가져오기
                            .programState(gym.getProgramState())
                            .programId(gym.getProgramId())
                            .title(gym.getTitle())
                            .content(gym.getContent())
                            .programStartDate(gym.getProgramStartDate())
                            .programEndDate(gym.getProgramEndDate())
                            .participants(userDTOS)
                            .build();
                })
                .collect(Collectors.toList());

    }

    //프로그램 ID별로 등록된 참가자 User 조회 메서드
    @Override
    public List<UserDTO> getRegisterdUsers(Long programId) {
        Gym gym = gymRepository.findById(programId)
                .orElseThrow(() -> new EntityNotFoundException("Gym program not found with id: " + programId));
        List<GymParticipant> participants = gymParticipantRepository.findByGymAndWaitlisted(gym, false);
        return participants.stream()
                .map(participant -> {
                    User user = participant.getUser();
                    return UserDTO.builder()
                            .uno(user.getUno())
                            .userName(user.getUserName())
                            .phone(user.getPhone())
                            .build();
                })
                .collect(Collectors.toList());
    }
    //프로그램 id별 대기자 user 조회 메서드
    @Override
    public List<UserDTO> getWaitlistUsers(Long programId) {
        Gym gym = gymRepository.findById(programId)
                .orElseThrow(() -> new EntityNotFoundException("Gym program not found with id: " + programId));
        List<GymParticipant> waitlist = gymParticipantRepository.findByGymAndWaitlisted(gym, true);
        return waitlist.stream()
                .map(participant -> {
                    User user = participant.getUser();
                    return UserDTO.builder()
                            .uno(user.getUno())
                            .userName(user.getUserName())
                            .phone(user.getPhone())
                            .build();
                })
                .collect(Collectors.toList());
    }

    //검색
    @Override
    public SearchPageResponseDTO<GymDTO> searchList(SearchPageRequestDTO requestDTO) {
        Pageable pageable = PageRequest.of(requestDTO.getPage() -1, requestDTO.getSize());
        Page<Gym> resultPage = gymRepository.searchPrograms(requestDTO, pageable);
        List<GymDTO> dtoList = resultPage.stream()
                .map(i->entityToDto(i))
                .collect(Collectors.toList());
        return SearchPageResponseDTO.<GymDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(requestDTO)
                .totalCount(resultPage.getTotalElements())
                .build();
    }



    public  Gym dtoToEntity (GymDTO gymDTO) {
        return Gym.builder()
                .programId(gymDTO.getProgramId())
                .content(gymDTO.getContent())
                .title(gymDTO.getTitle())
                .target(gymDTO.getTarget())
                .participantLimit(gymDTO.getParticipantLimit())
                .programStartDate(gymDTO.getProgramStartDate())
                .programEndDate(gymDTO.getProgramEndDate())
                .programStartTime(gymDTO.getProgramStartTime())
                .programEndTime(gymDTO.getProgramEndTime())
                .applicationStartDate(gymDTO.getApplicationStartDate())
                .applicationEndDate(gymDTO.getApplicationEndDate())
                .currentParticipants(gymDTO.getCurrentParticipants())

               // .membershipType(gymDTO.getMembershipType())
                .build();
    }




    public GymDTO entityToDto(Gym gym) {
        return GymDTO.builder()
                .content(gym.getContent())
                .programId(gym.getProgramId())
                .title(gym.getTitle())
                .target(gym.getTarget())
                .programStartDate(gym.getProgramStartDate())
                .programEndDate(gym.getProgramEndDate())
                .programStartTime(gym.getProgramStartTime())
                .programEndTime(gym.getProgramEndTime())
                .applicationStartDate(gym.getApplicationStartDate())
                .applicationEndDate(gym.getApplicationEndDate())
                .participantLimit(gym.getParticipantLimit())
                .currentParticipants((gym.getCurrentParticipants()))
                .programState(gym.getProgramState())//null 값 처리 해주기위해서는 entityToDto로 해줘야함
                .build();



    }
}
