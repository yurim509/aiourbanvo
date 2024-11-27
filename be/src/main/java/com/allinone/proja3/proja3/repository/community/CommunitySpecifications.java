package com.allinone.proja3.proja3.repository.community;

import org.springframework.data.jpa.domain.Specification;

public class CommunitySpecifications {

    public static <T> Specification<T> searchByType(String type, String keyword, String category) {
        return (root, query, criteriaBuilder) -> {
            String likeKeyword = "%" + keyword.toLowerCase() + "%";

            switch (category) {
                case "board": // 게시판 검색
                case "announce": // 공지사항 검색
                case "market": // 마켓 검색
                    if ("title".equals(type)) { // 제목 검색
                        return criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), likeKeyword);
                    } else if ("content".equals(type)) { // 내용 검색
                        return criteriaBuilder.like(criteriaBuilder.lower(root.get("content")), likeKeyword);
                    } else if ("titleAndContent".equals(type)) { // 제목 + 내용 검색
                        return criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), likeKeyword),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("content")), likeKeyword)
                        );
                    } else if ("target".equals(type)) { // 작성자 검색
                        // 작성자 필드를 참조하기 위해 root.join() 사용
                        return criteriaBuilder.like(
                                criteriaBuilder.lower(root.join("user").get("userName")), likeKeyword
                        );
                    }
                    break;
                default:
                    throw new IllegalArgumentException("Invalid category: " + category);
            }

            return criteriaBuilder.conjunction(); // 기본 조건 반환 (항상 true)
        };
    }
}
