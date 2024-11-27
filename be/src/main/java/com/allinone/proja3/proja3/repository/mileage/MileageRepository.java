package com.allinone.proja3.proja3.repository.mileage;

import com.allinone.proja3.proja3.model.mileage.Mileage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MileageRepository extends JpaRepository<Mileage, Long> {

    public Optional<Mileage> findByDongAndHoAndStateTrue(String dong, String ho);
}
