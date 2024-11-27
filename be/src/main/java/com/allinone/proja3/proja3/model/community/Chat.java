package com.allinone.proja3.proja3.model.community;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_chat")
@Data
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long crn; // 메시지 ID

    @ManyToOne(fetch = FetchType.LAZY) // Market과의 관계
    @JoinColumn(name = "product_id", referencedColumnName = "mno", nullable = false)
    private Market market; // 관련된 Market 정보

    @Column(name = "sender_id", nullable = false)
    private Long senderId; // 발신자 ID (User의 uno)

    @Column(name = "recipient_id", nullable = false)
    private Long recipientId; // 수신자 ID (User의 uno)

    private String senderName;
    private String recipientName;

    private String message; // 메시지 내용

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp; // 메시지 전송 시간

    @PrePersist
    public void prePersist() {
        this.timestamp = LocalDateTime.now(); // 메시지 전송 시 현재 시간 설정
    }
}
