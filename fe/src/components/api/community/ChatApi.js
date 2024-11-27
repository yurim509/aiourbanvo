import axios from 'axios';

export const API_SERVER_HOST = 'http://localhost:8080';
const host = `${API_SERVER_HOST}/api/communities/market/chat`;

// 메시지 전송
export const sendMessage = async (chatMessage) => {
    const token = localStorage.getItem("token"); // JWT 토큰 가져오기
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`, // Authorization 헤더 설정
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await axios.post(`${host}/send`, chatMessage, config); // 메시지 전송
        return response.data; // 성공 시 응답 데이터 반환
    } catch (error) {
        console.error("메시지 전송 실패", error);
        throw error; // 에러를 호출한 곳으로 전달
    }
};

// 특정 상품에 대한 메시지 조회
// 특정 상품에 대한 메시지 조회
export const getMessages = async (productId) => {
    const token = localStorage.getItem("token");
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await axios.get(`${host}/${productId}`, config); // 상품 ID로 메시지 조회
        console.log("메시지 조회 응답:", response.data); // 추가된 로그
        return response.data; // 성공 시 메시지 목록 반환
    } catch (error) {
        console.error("메시지 조회 실패", error);
        throw error; // 에러를 호출한 곳으로 전달
    }
};

export const getProductByMno = async (mno) => {
    const token = localStorage.getItem("token");
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await axios.get(`${host}/post/${mno}`, config); // /post/{mno}로 수정
        return response.data;
    } catch (error) {
        console.error("상품 정보 조회 실패", error);
        throw new Error("데이터를 가져오는 데 실패했습니다.");
    }
};