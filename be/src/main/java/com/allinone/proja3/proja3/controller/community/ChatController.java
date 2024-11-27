package com.allinone.proja3.proja3.controller.community;

import com.allinone.proja3.proja3.dto.community.ChatDTO;
import com.allinone.proja3.proja3.dto.community.MarketDTO;

import com.allinone.proja3.proja3.service.community.Chatservice;
import com.allinone.proja3.proja3.service.community.MarketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities/market/chat")
public class ChatController {

    @Autowired
    private Chatservice chatService;

    @Autowired
    private MarketService marketService;

    // 메시지 전송
    @PostMapping("/send")
    public ResponseEntity<Void> sendMessage(@RequestBody ChatDTO chatDTO) {
        chatService.saveMessage(chatDTO);
        return ResponseEntity.ok().build();
    }

    // 특정 상품 ID(mno)에 대한 모든 메시지 조회
    @GetMapping("/{productId}")
    public ResponseEntity<List<ChatDTO>> getMessages(@PathVariable Long productId) {
        List<ChatDTO> messages = chatService.getMessagesByProductId(productId);
        return ResponseEntity.ok(messages);
    }

    // 특정 상품 ID(mno)를 사용하여 게시물 정보 조회
    @GetMapping("/post/{mno}")
    public ResponseEntity<MarketDTO> getProductById(@PathVariable Long mno) {
        MarketDTO marketDTO = marketService.findByMno(mno);
        return marketDTO != null ? ResponseEntity.ok(marketDTO) : ResponseEntity.notFound().build();
    }
}
