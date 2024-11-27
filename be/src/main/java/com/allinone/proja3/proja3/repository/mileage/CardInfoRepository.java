package com.allinone.proja3.proja3.repository.mileage;

import com.allinone.proja3.proja3.model.mileage.CardInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CardInfoRepository extends JpaRepository<CardInfo, Long> {

    Optional<CardInfo> findByUserUno(Long uno);
}
