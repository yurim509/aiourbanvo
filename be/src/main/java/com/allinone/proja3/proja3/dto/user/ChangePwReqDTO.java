package com.allinone.proja3.proja3.dto.user;

import com.allinone.proja3.proja3.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChangePwReqDTO {
    private Long uno;
    private String pw;
}
