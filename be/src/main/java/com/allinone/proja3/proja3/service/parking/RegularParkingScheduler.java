package com.allinone.proja3.proja3.service.parking;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@RequiredArgsConstructor
public class RegularParkingScheduler {
    private final RegularParkingService regularParkingService;

    @Scheduled(cron = "0 0 0 * * *") // 매일 자정 실행
    public void startRegularPayment(){
        log.info("startRegularPayment");
        regularParkingService.monthlyRegularPayment();
    }
}
