package com.allinone.proja3.proja3.service.facilities;

import com.allinone.proja3.proja3.model.facilities.FacilitySchedule;
import com.allinone.proja3.proja3.repository.facilities.FacilityScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FacilityScheduleService {
    private final FacilityScheduleRepository repository;
    // 시설 시간 조회(사용자가 보는 화면)
    public List<FacilitySchedule> getAllSchedules(){
        return repository.findAll();
    }
    public void deleteSchedule(Long id){
        repository.deleteById(id);
    }
    public FacilitySchedule saveOrUpdateSchedule(FacilitySchedule schedule){
        //기존 스케줄 조회(Id 가 null이 아니면 기존 데이터를 수정)
        if(schedule.getId()==null){
            return repository.save(schedule);//새스케줄저장
        }
        //기존 데이터 수정
        FacilitySchedule existingSchedule = repository.findById(schedule.getId()).orElse(null);
        if(existingSchedule != null) {
            existingSchedule.setFacilityName(schedule.getFacilityName());
            existingSchedule.setStartTime(schedule.getStartTime());
            existingSchedule.setEndTime(schedule.getEndTime());
            return repository.save(existingSchedule);

        }
        return repository.save(schedule);
    }

 //    public FacilitySchedule getSchedule() {
//        return repository.findAll()
//                .stream()
//                //첫번째 데이터만 가져옴 (단일데이터 관리)
//                .findFirst()
//                .orElse(new FacilitySchedule());//데이터가 없으면 기본값 반환
//    }
//    //시설 시간 저장 또는 수정(관리자용)
//    public FacilitySchedule saveOrUpdateSchedule(FacilitySchedule schedule){
//        FacilitySchedule existingSchedule = getSchedule();
//        //기존 데이터가 없을 경우 새로 생성
//        if(existingSchedule.getId()== null){
//            return repository.save(schedule);
//        }
//        //기존데이터수정
//        existingSchedule.setFacilityName(schedule.getFacilityName());
//        existingSchedule.setStartTime(schedule.getStartTime());
//        existingSchedule.setEndTime(schedule.getEndTime());
//        return repository.save(existingSchedule);
//    }



}

