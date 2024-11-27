package com.allinone.proja3.proja3.service.parking;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.parking.*;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface EntryExitCarService {
    Long entry(EntryExitCarDTO entryExitCarDTO);
    void exit(EntryExitCarDTO entryExitCarDTO);
    void remove(Long eeno);
    PageResponseDTO<EntryExitCarDTO> getList(PageRequestDTO pageRequestDTO);
    PageResponseDTO<EntryExitCarDTO> getUserList(PageRequestDTO pageRequestDTO, HouseholdDTO householdDTO);
    PageResponseDTO<EntryExitCarDTO> getSearchList(PageRequestDTO pageRequestDTO, EntryExitSearchDataDTO entryExitSearchDataDTO);
}
