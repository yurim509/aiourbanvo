package com.allinone.proja3.proja3.service.mileage;

import com.allinone.proja3.proja3.dto.mileage.MileagePageRequestDTO;
import com.allinone.proja3.proja3.dto.mileage.MileagePageResultDTO;
import com.allinone.proja3.proja3.dto.mileage.PaymentHistoryDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.mileage.PaymentHistory;
import com.allinone.proja3.proja3.repository.UserRepository;
import com.allinone.proja3.proja3.repository.mileage.PaymentHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Log4j2
@Service
public class PaymentHistoryServiceImpl implements PaymentHistoryService {

    private final PaymentHistoryRepository paymentHistoryRepository;
    private final MileageService mileageService;
    private final MileagehistoryService mileagehistoryService;
    private final CardInfoService cardInfoService;
    private final UserRepository userRepository;

    private PaymentHistory getEntity(PaymentHistoryDTO dto){
        PaymentHistory entity = PaymentHistory.builder()
                .paymentId(dto.getPaymentId())
                .uno(dto.getUno())
                .price(dto.getPrice())
                .dong(dto.getDong())
                .ho(dto.getHo())
                .cardId(dto.getCardId())

                .build();
        return entity;
    }

    private PaymentHistoryDTO getDto(PaymentHistory entity){
        Optional<User> user =userRepository.findById(entity.getUno());

        PaymentHistoryDTO dto = PaymentHistoryDTO.builder()
                .paymentId(entity.getPaymentId())
                .price(entity.getPrice())
                .uno(entity.getUno())
                .userName(user.isPresent()?user.get().getUserName():null)
                .dong(entity.getDong())
                .ho(entity.getHo())
                .timestamp(entity.getTimestamp())
                .build();
        return dto;
    }

    @Override
    public List<PaymentHistoryDTO> getAllPaymentHistory(String dong, String ho) {
        return paymentHistoryRepository.findByDongAndHo(dong, ho).stream()
                .map(this::getDto)
                .collect(Collectors.toList());
    }

    @Override
    public MileagePageResultDTO<PaymentHistoryDTO, PaymentHistory> getPaymentList(Long userId, MileagePageRequestDTO pageRequest) {

        Page newResult = paymentHistoryRepository.complexhistorySearch(userId ,pageRequest.getStartDate(),pageRequest.getEndDate(),pageRequest.getPageable());
        return new MileagePageResultDTO<>(newResult,  this::getDto);
    }


    @Override
    public PaymentHistory savePaymentHistoryDTO(PaymentHistoryDTO dto) {
        PaymentHistory entity = getEntity(dto);
        return paymentHistoryRepository.save(entity);
    }

    @Override
    public PaymentHistory savePaymentHistoryEntity(PaymentHistory entity) {
        return paymentHistoryRepository.save(entity);
    }

    @Override
    public void deletePaymentHistory(PaymentHistoryDTO dto) {
        paymentHistoryRepository.delete(getEntity(dto));
    }






}
