package com.allinone.proja3.proja3.repository.facilities;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.SearchPageRequestDTO;
import com.allinone.proja3.proja3.model.facilities.Golf;
import com.allinone.proja3.proja3.model.facilities.Gym;
import com.allinone.proja3.proja3.model.facilities.GymParticipant;
import com.allinone.proja3.proja3.model.facilities.QGym;
import com.querydsl.core.BooleanBuilder;
import jdk.swing.interop.SwingInterOpUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GymRepository extends JpaRepository<Gym, Long>, QuerydslPredicateExecutor<Gym> {
    Page<Gym> findAll(Pageable pageable);
    Optional<Gym> findByProgramId(Long programId);
    @Modifying
    @Query("update Gym g set g.delFlag = :flag where g.programId = :programId ")
    void updateToDelete(@Param("programId") Long programId, @Param("flag") boolean flag);

    @Query("SELECT g FROM Gym g WHERE g.delFlag = false ORDER BY g.programId DESC")
    Page<Gym> findNonDeletedPrograms(Pageable pageable);
    List<Gym> findByUserUno(@Param("uno") Long uno);
//    List<GymParticipant> findByUserUno(@Param("uno") Long uno, Pageable pageable);
    //검색
    default Page<Gym> searchPrograms(SearchPageRequestDTO requestDTO, Pageable pageable) {
        QGym gym = QGym.gym;
        BooleanBuilder builder = new BooleanBuilder();
        System.out.println("requestDto getType: 888)"+ requestDTO.getType());
        if(requestDTO.getKeyword() != null && !requestDTO.getKeyword().isEmpty()) {
            String keyword = requestDTO.getKeyword();

            if("title".equals(requestDTO.getType())) {
                builder.and(gym.title.containsIgnoreCase(keyword));
            } else if ("content".equals(requestDTO.getType())) {
                builder.and(gym.content.containsIgnoreCase(keyword));
            } else if ("target".equals(requestDTO.getType())) {
                builder.and(gym.target.containsIgnoreCase(keyword));
            }
            if("titleAndContent".equals(requestDTO.getType())) {
                builder.and(gym.title.containsIgnoreCase(keyword).or(gym.content.containsIgnoreCase(keyword)));
            }
        }
        System.out.println("requestDto getType : 999)" + requestDTO.getType());
        Page<Gym> list = findAll(builder,pageable);
        System.out.println("requestDto getType : 1000)" + list);
        builder.and(gym.delFlag.eq(false));

        return list;
    }




}
