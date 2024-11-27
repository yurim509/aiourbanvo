import axios from 'axios';
import { useEffect, useRef } from 'react';

// API 서버 주소
export const API_SERVER_HOST = 'http://localhost:8080';
const host = `${API_SERVER_HOST}/api/communities/info/jobs/search`;  // 수정된 엔드포인트

export const getJobs = async (keyword) => {
    const token = localStorage.getItem("token");
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
    const url = `http://localhost:8080/api/communities/info/jobs/search/${encodeURIComponent(keyword)}`;

    try {
        const response = await axios.get(url, config);
        console.log("getJobs:", url);
        return response.data;
    } catch (error) {
        console.error("Job search failed:", error);
        throw error;
    }
};

// 특정 채용공고 조회
export const getJobById = async (id) => {
    const token = localStorage.getItem("token");  // JWT 토큰 가져오기
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,  // Authorization 헤더 설정
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await axios.get(`${host}/${id}`, config);  // 채용공고 ID로 조회
        return response.data;  // 성공 시 채용공고 데이터 반환
    } catch (error) {
        console.error("채용공고 조회 실패", error);
        throw error;  // 에러를 호출한 곳으로 전달
    }
};
// Custom hook to manage markers on map
export const useManageMarkers = (map, markersData) => {
    const overlaysRef = useRef([]); // Store markers to manage across renders

    useEffect(() => {
        // Remove existing markers
        overlaysRef.current.forEach(marker => marker.setMap(null));
        overlaysRef.current = [];

        // Add new markers
        markersData.forEach(data => {
            const marker = new window.kakao.maps.Marker({
                map,
                position: new window.kakao.maps.LatLng(data.lat, data.lng),
                title: data.title,
            });
            overlaysRef.current.push(marker); // Save marker in ref array
        });

        // Clean up markers on unmount
        return () => {
            overlaysRef.current.forEach(marker => marker.setMap(null));
        };
    }, [map, markersData]);
};