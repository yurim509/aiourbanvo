import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8080"
const host = `${API_SERVER_HOST}/api/facilities`

//공통 config설정 : 권한관련/ 변수로 설정하여 코드의 중복을 줄인다.
const getConfig = () => {
    const token = localStorage.getItem("token");// JWT 토큰을 저장한 위치
    // console.log("token", token)
    if (!token) {
        console.error("토큰이 없습니다.");
        return {};
    }
    return {
        headers: {
            "Authorization": `Bearer ${token}`,  // Bearer 형식으로 JWT 토큰 설정
            "Content-Type": "application/json",
        },
    };
};
//관리자 시설 스케줄
export const saveSchedule  = (data) => {
    const config = getConfig();
    return axios.post(`${host}`, data, config);
};


//사용자 시설 스케줄 조회
export const listSchedule = async () => {
    const config = getConfig();
    return axios.get(`${host}`, config);
}

//관리자 스케줄 수정
export const updateSchedule = async (data) => {
    const config = getConfig();
    return axios.put(`${host}`, data, config);
}
//관리자 스케줄 삭제
export const deleteSchedule = async (id) => {
    const config = getConfig();
    return axios.delete(`${host}/${id}`, config);
}
