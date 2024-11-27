package com.allinone.proja3.proja3.repository.facilities;

import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.facilities.Golf;
import com.allinone.proja3.proja3.model.facilities.GymMembership;
import com.allinone.proja3.proja3.model.facilities.GymParticipant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface GymMembershipRepository extends JpaRepository<GymMembership,Long> {
    @Query("SELECT gm FROM GymMembership gm WHERE gm.user.uno = :uno")
    List<GymMembership> findByUserUno(@Param("uno") Long uno);

    GymMembership findByUserUnoAndEndDateAfter(Long uno, LocalDate currentDate);
}
