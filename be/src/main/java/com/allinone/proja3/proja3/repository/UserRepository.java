package com.allinone.proja3.proja3.repository;

import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    // delFlag
    Page<User> findByDelFlag(boolean delFlag, Pageable pageable);

    // role(전달값) 이 아닌 유저만 필터링
    Page<User> findByUserRoleListNotContainingAndDelFlagFalse(UserRole role, Pageable pageable);

    // role(전달값) 유저만 필터링
    Page<User> findByUserRoleListContainingAndDelFlagFalse(UserRole role, Pageable pageable);
    Page<User> findByUserRoleListContaining(UserRole role, Pageable pageable);

    // delFlag 업데이트
    @Modifying
    @Query("update User u set u.delFlag = :flag where u.uno = :uno")
    void updateToDelete(@Param("uno") Long uno, @Param("flag") boolean flag);

    // phone 으로 조회 (즉시 with role)
    @EntityGraph(attributePaths = {"userRoleList"})
    User findByPhone(String phone);
    // dong ho 로 조회
    @EntityGraph(attributePaths = {"userRoleList"})
    List<User> findAllByDongAndHo(String dong, String ho);

    // search method
    @EntityGraph(attributePaths = {"userRoleList"})
    Page<User> findByDongContainingAndHoContainingAndDelFlagFalse(String dong, String ho, Pageable pageable);
    @EntityGraph(attributePaths = {"userRoleList"})
    Page<User> findByDongContainingAndHoContaining(String dong, String ho, Pageable pageable);

    @EntityGraph(attributePaths = {"userRoleList"})
    Page<User> findByDongContainingAndDelFlagFalse(String dong, Pageable pageable);
    @EntityGraph(attributePaths = {"userRoleList"})
    Page<User> findByDongContaining(String dong, Pageable pageable);

    @EntityGraph(attributePaths = {"userRoleList"})
    Page<User> findByHoContainingAndDelFlagFalse(String ho, Pageable pageable);
    @EntityGraph(attributePaths = {"userRoleList"})
    Page<User> findByHoContaining(String ho, Pageable pageable);

    @EntityGraph(attributePaths = {"userRoleList"})
    Page<User> findByUserNameContainingAndDelFlagFalse(String userName, Pageable pageable);
    @EntityGraph(attributePaths = {"userRoleList"})
    Page<User> findByUserNameContaining(String userName, Pageable pageable);

    @EntityGraph(attributePaths = {"userRoleList"})
    Page<User> findByPhoneContainingAndDelFlagFalse(String phone, Pageable pageable);
    @EntityGraph(attributePaths = {"userRoleList"})
    Page<User> findByPhoneContaining(String phone, Pageable pageable);

}
