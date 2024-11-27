package com.allinone.proja3.proja3.controller.facilities;

import com.allinone.proja3.proja3.model.facilities.FacilitySchedule;
import com.allinone.proja3.proja3.service.facilities.FacilityScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") //host 3000으로변경 1025
@RequestMapping("/api/facilities")
public class FacilityScheduleController {
    private final FacilityScheduleService service;

    @GetMapping
    public List<FacilitySchedule> getSchedule() {
        return service.getAllSchedules();
    }
    @PostMapping
    public FacilitySchedule saveOrUpdateSchedule(@RequestBody FacilitySchedule schedule){
        System.out.println("1124:"+schedule);
        return service.saveOrUpdateSchedule(schedule);
    }
    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable Long id){
        System.out.println("1111: "+id);
        service.deleteSchedule(id);
    }
    @PutMapping
    public FacilitySchedule updateSchedule(@RequestBody FacilitySchedule schedule) {
        return service.saveOrUpdateSchedule(schedule);
    }
}
