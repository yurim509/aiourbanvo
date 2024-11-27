package com.allinone.proja3.proja3.dto.user;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserSearchDataDTO {
    private String searchCategory;
    private String searchValue;
}
