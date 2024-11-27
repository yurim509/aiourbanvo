package com.allinone.proja3.proja3.model;

import com.allinone.proja3.proja3.model.facilities.Gym;
import com.allinone.proja3.proja3.model.facilities.GymParticipant;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_user")
@Data
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long uno;
    private String dong;
    private String ho;
    private String userName;
    private String phone;
    private String pw;
    private boolean delFlag;

    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private List<UserRole> userRoleList = new ArrayList<>();
    public void addRole(UserRole userRole){ userRoleList.add(userRole);}
    public void clearRole(){ userRoleList.clear();}

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<GymParticipant> gymParticipants;


}
