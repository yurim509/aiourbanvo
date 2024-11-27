package com.allinone.proja3.proja3.repository.facilities;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.facilities.GolfDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.facilities.Golf;
import com.allinone.proja3.proja3.model.facilities.Study;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface GolfRepository extends JpaRepository<Golf, Long> {
    //날짜 ,시간으로 예약 목록 중복 조회 메서드
    @Query("select g from Golf g where g.date = :date AND g.startTime < :endTime AND g.endTime > :startTime AND g.teeBox = :teeBox")
    List<Golf> findByDateAndTime(@Param("date") LocalDate date,
                                 @Param("startTime")LocalTime startTime,
                                 @Param("endTime") LocalTime endTime,
                                 @Param("teeBox") int teeBox);

//    @Query("select new com.allinone.proja3.proja3.dto.facilities.GolfDTO(g.reservationId, g.date, g.startTime, g.endTime, g.delFlag, g.teeBox, g.Uno, g.userName, g.Phone) " +
//             "FROM Golf g WHERE g.user.uno = :uno")
//    List<Golf> findByUserUno(Long uno, Pageable pageable);


    @Query("select count(g) from Golf g WHERE g.user.uno = :uno")
    long countByUserUno(@Param("uno") Long uno);

    //특정 날짜에 대한 예약 조회
    @Query("select g from Golf g where g.date =:date")
    List<Golf> findByDate(@Param("date")LocalDate date);

    //전체 예약 조회 (페이징)
    // JpaRepository에서 기본 제공하는 findAll 메서드를 사용

    //특정 uno 사용자에 대한 예약 조회
//    @Query("select g from Golf g where g.userName = :userName")
//    List<Golf> findByUserName(@Param("reservationId") Long reservationId);


    //예약 삭제(delFlag방식 사용시)
    @Modifying
    @Query("update Golf g set g.delFlag = :flag where g.reservationId = :reservationId ")
    void updateToDelete(@Param("reservationId") Long reservationId, @Param("flag") boolean flag);

    // 예약 등록 메서드는 JpaRepository에 의해 자동으로 제공되므로 별도로 작성할 필요 없음
//    List<Golf> findGolfBydelFlag(Boolean delflag);

    @Query("SELECT g FROM Golf g WHERE g.delFlag = false ORDER BY g.date DESC")
    Page<Golf> findNonDeletedReservations(Pageable pageable);

    List<Golf> findByUser(User user);

    //==========사용자의 uno, 이름, phone 불러오기================
    @Query("select g from Golf g where g.user.uno = :uno")
//    List<Golf> findByUserUno(@Param("uno") Long uno, Pageable pageable);
    Page <Golf> findByUserUno(@Param("uno") Long uno, Pageable pageable);

    @Query("SELECT g FROM Golf g WHERE g.user.uno = :uno AND g.delFlag = false")
    Page<Golf> findNonDeletedReservationsByUserUno(@Param("uno") Long uno, Pageable pageable);


//    @Query("select g from Golf g where g.user.userName = :userName")
//    List<Golf> findByUserName(@Param("userName") String userName, Pageable pageable);
//    @Query("select g from Golf g where g.user.phone = :phone")
//    List<Golf> findByPhone(@Param("phone") String phone, Pageable pageable);


}
