package com.allinone.proja3.proja3.dto.mileage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ManualRequestDTO {

    CardInfoDTO card ;
    MileageDTO mileage;
    int paymentAmount;
}
