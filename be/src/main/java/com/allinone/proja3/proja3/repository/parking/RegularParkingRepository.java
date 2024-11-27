package com.allinone.proja3.proja3.repository.parking;

import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.parking.Household;
import com.allinone.proja3.proja3.model.parking.HouseholdPK;
import com.allinone.proja3.proja3.model.parking.RegularParking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

public interface RegularParkingRepository extends JpaRepository<RegularParking, Long> {
    Page<RegularParking> findAllByHousehold(Household household, Pageable pageable);

    @Query("select p from RegularParking p where p.household.householdPK.dong like %:dong% and p.household.householdPK.ho like %:ho%")
    Page<RegularParking> findByDongHo(@Param("dong") String dong, @Param("ho") String ho, Pageable pageable);

    @Query("select p from RegularParking p where p.household.householdPK.dong like %:value%")
    Page<RegularParking> findByDong(@Param("value") String value, Pageable pageable);

    @Query("select p from RegularParking p where p.household.householdPK.ho like %:value%")
    Page<RegularParking> findByHo(@Param("value") String value, Pageable pageable);

    @Query("select p from RegularParking p where p.name like %:value%")
    Page<RegularParking> findByName(@Param("value") String value, Pageable pageable);

    @Query("select p from RegularParking p where p.phone like %:value%")
    Page<RegularParking> findByPhone(@Param("value") String value, Pageable pageable);

    @Query("select p from RegularParking p where p.regDate between :start and :end")
    Page<RegularParking> findByRegDate(@Param("start") LocalDate start, @Param("end") LocalDate end, Pageable pageable);
}
