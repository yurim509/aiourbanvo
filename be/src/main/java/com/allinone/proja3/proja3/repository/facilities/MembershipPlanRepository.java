package com.allinone.proja3.proja3.repository.facilities;

import com.allinone.proja3.proja3.model.facilities.MembershipPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MembershipPlanRepository extends JpaRepository<MembershipPlan,Long> {
    List<MembershipPlan> findByDelFlagFalse();

}
