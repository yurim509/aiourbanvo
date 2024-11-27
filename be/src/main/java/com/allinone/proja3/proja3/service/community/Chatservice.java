package com.allinone.proja3.proja3.service.community;

import com.allinone.proja3.proja3.dto.community.ChatDTO;

import java.util.List;

public interface Chatservice {
    void saveMessage(ChatDTO chatDTO);
    List<ChatDTO> getMessagesByProductId(Long productId);

}
