package com.allinone.proja3.proja3.dto.community;

public class Coordinates {
    private Double longitude;  // 경도
    private Double latitude;   // 위도

    // 생성자
    public Coordinates(Double longitude, Double latitude) {
        this.longitude = longitude;
        this.latitude = latitude;
    }

    // Getter, Setter
    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
}
