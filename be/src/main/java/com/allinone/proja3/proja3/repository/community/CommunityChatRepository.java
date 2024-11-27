package com.allinone.proja3.proja3.repository.community;

import com.allinone.proja3.proja3.model.community.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityChatRepository extends JpaRepository<Chat,Long> {
    List<Chat> findByMarket_Mno(Long mno); // 상품 ID로 메시지 조회
}
