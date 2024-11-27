package com.allinone.proja3.proja3.dto.parking;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EntryExitReqDTO {
    private PageRequestDTO pageRequestDTO;
    private EntryExitSearchDataDTO entryExitSearchDataDTO;
    private HouseholdDTO householdDTO;
}
