package com.allinone.proja3.proja3.model.parking;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class HouseholdPK implements Serializable {
    private String dong;
    private String ho;

    // .equals 로 Household 를 PK로 사용하는 다른 자식 테이블에서 비교시 true 가 나옴
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true; // 자기자신과 동일하면 true
        if ( obj == null || getClass() != obj.getClass()) return false; // null 이거나 클래스가 다르면 false
        HouseholdPK householdPK = (HouseholdPK) obj;
        return Objects.equals(dong, householdPK.dong) && Objects.equals(ho, householdPK.ho);
    }

    // 복합키(dong,ho)를 하나의 hashCode 로 반환
    @Override
    public int hashCode() {
        return Objects.hash(dong,ho);
    }
}