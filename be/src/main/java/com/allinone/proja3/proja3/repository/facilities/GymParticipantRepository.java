package com.allinone.proja3.proja3.repository.facilities;

import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.facilities.Gym;
import com.allinone.proja3.proja3.model.facilities.GymParticipant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.List;
import java.util.Optional;

public interface GymParticipantRepository extends JpaRepository<GymParticipant,Long>  {
    boolean existsByGymAndUser(Gym gym, User user);
    List<GymParticipant> findByGym(Gym gym);
//    List<GymParticipant> findByGymAndParticipant(Gym gym, boolean waitlisted);
    List<GymParticipant> findByGymAndWaitlisted(Gym gym, boolean waitlisted);
    Page <GymParticipant> findByUserUno(Long uno, Pageable pageable);
    // 특정 프로그램과 사용자에 해당하는 참가자 조회
    Optional<GymParticipant> findByGymAndUser(Gym gym, User user);
    // 대기자 중에서 가장 오래된 참가자 조회
    Optional<GymParticipant> findFirstByGymAndWaitlistedOrderByCreatedAtAsc(Gym gym, boolean waitlisted);

    boolean existsByGymAndUserAndWaitlisted(Gym gym, User user,boolean waitlisted);
    // 참가 취소 시 특정 참가자 조회
    Optional<GymParticipant> findByGymAndUserAndWaitlisted(Gym gym,User user,boolean waitlisted);



    List<GymParticipant> findByUserAndWaitlisted(User user,boolean waitlisted);

}
