package com.allinone.proja3.proja3.service.mileage;

import com.allinone.proja3.proja3.dto.mileage.MileageDTO;
import com.allinone.proja3.proja3.model.mileage.CardInfo;
import com.allinone.proja3.proja3.model.mileage.Mileage;
import com.allinone.proja3.proja3.repository.mileage.CardInfoRepository;
import com.allinone.proja3.proja3.repository.mileage.MileageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Log4j2
@Service
@RequiredArgsConstructor
public class MileageServiceImpl implements MileageService {

    private final MileageRepository mileageRepository;
    private final CardInfoRepository cardInfoRepository;
    @Override
    public MileageDTO getDTO(Mileage entity) {
        return  MileageDTO.builder()
                .mileageId(entity.getMileageId())
                .ho(entity.getHo())
                .dong(entity.getDong())
                .price(entity.getPrice())
                .cardId(entity.getCardInfo() != null ? entity.getCardInfo().getCardId() : null)
                .autopay(entity.isAutopay())
                .state(entity.isActive())
                .build();
    }

    private Mileage getEntity(MileageDTO dto) {

        Optional<CardInfo> card = cardInfoRepository.findById(dto.getCardId());
        Mileage entity =  Mileage.builder()
                .mileageId(dto.getMileageId())
                .ho(dto.getHo())
                .dong(dto.getDong())
                .price(dto.getPrice())
                .autopay(dto.isAutopay())
                .state(dto.isState())
                .build();
        //card가 있으면 set 추가 하는 로직.
        if(card.isPresent()) {
            entity.setCardInfo(card.get());
        }
        return entity;
    }

    private Mileage getorCreateEntity(MileageDTO dto){
        Optional<Mileage> mileage = mileageRepository.findByDongAndHoAndStateTrue(dto.getDong(),dto.getHo());

        Mileage responseEntity;

        if(mileage.isPresent()) {
            responseEntity = mileage.get();
        }else{
            responseEntity = Mileage.builder()
                    .mileageId(dto.getMileageId())
                    .ho(dto.getHo())
                    .dong(dto.getDong())
                    .price(dto.getPrice())
                    .autopay(dto.isAutopay())
                    .state(dto.isState())
                    .build();
        }
        Optional<CardInfo> card = cardInfoRepository.findById(dto.getCardId());
        if(card.isPresent()) {
            responseEntity.setCardInfo(card.get());
        }
        return saveEntity(responseEntity);
    }



    //동 호를 입력하여 마일리지 찾기 (Entity 반환)
    @Override
    public Mileage findByDongHoentity(String dong, String ho) {
        Optional<Mileage> entity = mileageRepository.findByDongAndHoAndStateTrue(dong,ho);
        if(entity.isPresent()) {
            return entity.get();
        }else return null;
    }

    //동 호를 입력하여 마일리지 찾기 (DTO 반환)
    @Override
    public MileageDTO findByDongHoDTO(String dong, String ho) {
        Optional<Mileage> entity = mileageRepository.findByDongAndHoAndStateTrue(dong, ho);
        return entity.map(this::getDTO).orElse(null);
    }
    @Override
    public Mileage saveEntity(Mileage mileage) {
        return mileageRepository.save(mileage);

    }


    @Override
    public Mileage saveDto(MileageDTO dto) {
        Mileage entity = getEntity(dto);
        return mileageRepository.save(entity);
    }

    //-수동 충전 로직 사용 ,- 결제시 자동결제될때 추가적으로 사용됨.
    public Mileage duplicate(MileageDTO dto , int paymetAmount ) {
        Mileage entity =findByDongHoentity(dto.getDong(), dto.getHo());
        CardInfo cardInfo = cardInfoRepository.findById(dto.getCardId()).orElse(null);

        //1. 해당 마일리지가 있으면 충전된 금액을 추가
        //결제시 자동결제될때는 마일리지가 있는 상황이기 때문에 else로 빠지지 않음.
        if(entity != null) {
            entity.setPrice(entity.getPrice()+paymetAmount);
        //2. 해당 마일리지가 없으면 충전된 금액을 담아 새로 생성
        }else{
            entity = Mileage.builder()
                    .dong(dto.getDong())
                    .ho(dto.getHo())
                    .state(true)
                    .cardInfo(cardInfo)
                    // 수동 충전 :이부분은 카드를 만들고나면 , 마일리지 DTO에 card를 set해서 보내기 때문에
                    //해당하는 카드를 꺼낼 수 있음.
                    .autopay(dto.isAutopay())
                    .price(paymetAmount)
                    .build();
        }
        //3. 저장된 엔터티 반환
        return mileageRepository.save(entity);
    }

    //자동 충전 로직
    @Override
    public Mileage autoState(MileageDTO dto,CardInfo card){
        Mileage entity = getorCreateEntity(dto);

            entity.setState(true);//안전하게 상태 유지
            entity.setAutopay(true);// 있을때의 autopay 를 수동으로 변경


        // 기존의 CardInfo 관계 해제
        if (entity.getCardInfo() != null) {
            entity.setCardInfo(null); // 기존 카드 정보 제거
        }
            entity.setCardInfo(card);//카드 변경
        log.info("autoPayService find new Mileage : {}", entity);
        return mileageRepository.save(entity);
    }

    //자동 충전 해지 : dto의 AutoPay가 있어야 함
    @Override
    public MileageDTO fatchAutoPay(MileageDTO dto){
        Mileage entity = findByDongHoentity(dto.getDong(),dto.getHo());
        entity.setAutopay(dto.isAutopay());
        entity = mileageRepository.save(entity);
        return getDTO(entity);
    }

    //해당하는 동호수의 상태 비활성화 : 관리자가 사용하면 좋을 것 같아요
    @Override
    public void deleteMileageActive(String dong , String ho) {
        Mileage entity = findByDongHoentity(dong,ho);
        if(entity != null) {
            entity.setState(false);
            entity = mileageRepository.save(entity);
        }
    }


}
