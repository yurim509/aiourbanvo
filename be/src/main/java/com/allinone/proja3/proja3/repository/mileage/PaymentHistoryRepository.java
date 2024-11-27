package com.allinone.proja3.proja3.repository.mileage;

import com.allinone.proja3.proja3.model.mileage.MileageHistory;
import com.allinone.proja3.proja3.model.mileage.PaymentHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {

    List<PaymentHistory> findByDongAndHo(String dong , String ho);

    @Query("SELECT p FROM PaymentHistory p WHERE " +
            "p.uno = :uno AND " +
            "(:startDate IS NULL OR p.timestamp >= :startDate) AND " +
            "(:endDate IS NULL OR p.timestamp <= :endDate)")
    Page<PaymentHistory> complexhistorySearch(
            @Param("uno") Long uno,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);
}
