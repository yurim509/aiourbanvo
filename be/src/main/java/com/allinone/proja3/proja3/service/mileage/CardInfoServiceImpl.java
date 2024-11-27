package com.allinone.proja3.proja3.service.mileage;

import com.allinone.proja3.proja3.dto.mileage.CardInfoDTO;
import com.allinone.proja3.proja3.dto.user.UserDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.mileage.CardInfo;
import com.allinone.proja3.proja3.repository.UserRepository;
import com.allinone.proja3.proja3.repository.mileage.CardInfoRepository;
import com.allinone.proja3.proja3.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Log4j2
@Service
@RequiredArgsConstructor
public class CardInfoServiceImpl implements CardInfoService {

    private final CardInfoRepository cardInfoRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public CardInfoDTO getCardInfo(Long cardId) {
        Optional<CardInfo> card = cardInfoRepository.findById(cardId);
        if (card.isPresent()) {
            return getDTO(card.get());
        }else{
            return null;
        }
    }

    private CardInfoDTO getDTO(CardInfo entity) {
        CardInfoDTO dto = CardInfoDTO.builder()
                .cardId(entity.getCardId())
                .cardExpiry(entity.getCardExpiry())
                .encryptedCardNumber(entity.getEncryptedCardNumber())
                .uno(entity.getUser()!=null ? entity.getUser().getUno() : null)
                .build();

        return dto;
    }

    private CardInfo getEntity(CardInfoDTO dto) {

        Optional<User> user = userRepository.findById(dto.getUno());
        CardInfo entity = CardInfo.builder()
                .cardId(dto.getCardId())
                .cardExpiry(dto.getCardExpiry())
                .encryptedCardNumber(dto.getEncryptedCardNumber())
                .build();

        if(user.isPresent()) {
            entity.setUser(user.get());
        }
        return entity;
    }


    @Override
    public CardInfoDTO findByUno(long uno) {
        Optional<CardInfo> card = cardInfoRepository.findByUserUno(uno);
        return card.map(this::getDTO).orElse(null);
    }

    //수동 결제 및 자동결제 중 제일먼저 하는 로직.
    //카드번호를 업데이트할거야.
    //카드가 없으면 카드를 만들고 , 있으면
    @Override
    public CardInfo saveCardInfo(CardInfoDTO dto) {
        //CardDTO의 uno를 통해 카드가 있는지 찾는다.
        CardInfoDTO selectDTO = findByUno(dto.getUno());
        //카드가 있다면 dto에 없는 정보인 cardId를 세팅마치고
        if (selectDTO != null) {
            dto.setCardId(selectDTO.getCardId());
        }

        //업데이트 또는 저장 !
        return cardInfoRepository.save(getEntity(dto));
    }

    @Override
    public void deleteCardInfo(CardInfoDTO dto) {
        cardInfoRepository.delete(getEntity(dto))
        ;
    }

    //카드 정보 삭제 : 존재하면 삭제하고 아니면 삭제안함. String으로 결과 전송
    @Override
    public String deleteCardByUserId(Long uno){
        Optional<CardInfo> card = cardInfoRepository.findByUserUno(uno);
        if(card.isPresent()) {
            cardInfoRepository.delete(card.get());
            return "Card 가 존재 deleted 완료";
        }else{
            return "Card 가 존재하지않아 , 삭제되지 않았습니다.";
        }
    }

    public String getCardName (Long cardId){
        CardInfoDTO mileageCard = getCardInfo(cardId);
        if (mileageCard != null) {
            log.info("mileage card 찾음 : {}",mileageCard);
            Optional<User> user = userRepository.findById(mileageCard.getUno());
            if(user.isPresent()) {
                log.info("카드 사용자: {}",user.get().getUserName());
                return user.get().getUserName();
            }else{
                return null;
            }
        }else{
            return null;
        }
    }
}
