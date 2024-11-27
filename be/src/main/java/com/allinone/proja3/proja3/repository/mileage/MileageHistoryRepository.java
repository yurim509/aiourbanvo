package com.allinone.proja3.proja3.repository.mileage;

import com.allinone.proja3.proja3.model.mileage.Mileage;
import com.allinone.proja3.proja3.model.mileage.MileageHistory;
import com.allinone.proja3.proja3.model.mileage.MileageHistoryId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface MileageHistoryRepository extends JpaRepository<MileageHistory, MileageHistoryId> {
    Page<MileageHistory> findByMileage_MileageId(Long mileageId, Pageable pageable);
    //List<MileageHistory> findByMileageId(Long mileageId);

    @Query("SELECT m FROM MileageHistory m WHERE " +
            "m.mileage.mileageId = :mileageId AND " +
            "(COALESCE(:description, '') = '' OR m.description LIKE %:description%) AND " +
            "(:startDate IS NULL OR m.id.timestamp >= :startDate) AND " +
            "(:endDate IS NULL OR m.id.timestamp <= :endDate)")
    Page<MileageHistory> complexmileageSearch(
                                @Param("mileageId") Long mileageId,
                                @Param("description") String description,
                                 @Param("startDate") LocalDateTime startDate,
                                 @Param("endDate") LocalDateTime endDate,
                                 Pageable pageable);
}
