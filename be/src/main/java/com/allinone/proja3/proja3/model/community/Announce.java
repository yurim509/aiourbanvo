package com.allinone.proja3.proja3.model.community;

import com.allinone.proja3.proja3.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_announce")
@Data
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Announce {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long pno; // 공지사항 작성 번호

    private String title; // 제목

    private String content; // 내용

    @CreationTimestamp
    private LocalDateTime createdAt; // 작성일

    @UpdateTimestamp
    private LocalDateTime updatedAt; // 수정일

    @ManyToOne
    @JoinColumn(name = "uno", referencedColumnName = "uno", nullable = false)
    private User user; // 작성자 (관리자 권한의 User)

    @PrePersist
    public void prePersist() {
        System.out.println("CreatedAt: " + createdAt);  // 엔티티가 생성될 때 로그 출력
    }

    @PreUpdate
    public void preUpdate() {
        System.out.println("UpdatedAt: " + updatedAt);  // 엔티티가 수정될 때 로그 출력
    }
}
