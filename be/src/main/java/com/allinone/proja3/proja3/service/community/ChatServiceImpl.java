package com.allinone.proja3.proja3.service.community;

import com.allinone.proja3.proja3.dto.community.ChatDTO;
import com.allinone.proja3.proja3.model.community.Chat;
import com.allinone.proja3.proja3.model.community.Market;

import com.allinone.proja3.proja3.repository.community.CommunityChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements Chatservice {

    @Autowired
    private CommunityChatRepository chatRepository; // 채팅 메시지를 저장할 리포지토리

    @Override
    public void saveMessage(ChatDTO chatDTO) {
        // ChatDTO를 Chat 엔티티로 변환하여 저장
        Chat chat = Chat.builder()
                .market(new Market() {{ setMno(chatDTO.getProductId()); }}) // 관련 상품 ID로 설정
                .senderId(chatDTO.getSenderId())
                .recipientId(chatDTO.getRecipientId())
                .recipientName(chatDTO.getRecipientName())
                .senderName(chatDTO.getSenderName())
                .message(chatDTO.getMessage())
                .timestamp(LocalDateTime.now()) // 현재 시간 설정
                .build();

        chatRepository.save(chat); // 메시지 저장
    }

    @Override
    public List<ChatDTO> getMessagesByProductId(Long productId) {
        // 상품 ID로 메시지 조회
        List<Chat> messages = chatRepository.findByMarket_Mno(productId);
        return messages.stream().map(message -> ChatDTO.builder()
                .productId(message.getMarket().getMno()) // 상품 ID
                .senderId(message.getSenderId()) // 발신자 ID
                .recipientId(message.getRecipientId()) // 수신자 ID
                .senderName(message.getSenderName())
                .recipientName(message.getRecipientName())
                .message(message.getMessage()) // 메시지 내용
                .timestamp(message.getTimestamp()) // 전송 시간
                .build()).collect(Collectors.toList());
    }
}
