import axios from 'axios';

export const API_SERVER_HOST = "http://localhost:8080"
const host = `${API_SERVER_HOST}/api/facilities/golf`

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


//reserve 정상동작 확인완료
export const reserveGolf = (reservationData) => {
    const config = getConfig();
    return axios.post(`${host}/reserve`, reservationData, config);
};

//list 정상동작 확인완료
export const listGolf = async (pageParam) => {
    const { page, size } = pageParam
    const config = {
        ...getConfig(),
        params: { page, size },
    }
    const res = await axios.get(`${host}/list`, config)
    return res.data
}
//cancel 정상동작 확인완료
export const cancelGolf = async (checkedReservationId) => {

    console.log("0505",checkedReservationId)
    const config = getConfig();
    return axios.post(`${host}/delete`, checkedReservationId, config);
}






// export const getUserGolfById = async ({ uno, page, size }) => {
//     console.log("Fetching user golf by ID:dsfsadfasdfsafsaf", uno, page, size);
//     const token = localStorage.getItem("token")
//     const config = {
//         headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//         },
//     }
//     console.log("config:", config)
//     const res = await axios.get(`${host}/detail/${uno}`, config);
//     console.log(res)
//     return res.data;
// };

export const getUserGolfById = async ({ uno, page, size }) => {
    console.log("Fetching user golf by ID:dsfsadfasdfsafsaf ", uno, page, size)
    const config = getConfig();
    console.log("config: ", config)
    const res = await axios.get(`${host}/detail/${uno}`, config);
    console.log(res)
    return res.data
}



// export const modifyGolf = async (reservationId, reservationData) => {
//     console.log("골프 수정 : " + reservationId, reservationData);
//     const token = localStorage.getItem("token")
//     const config = {
//         headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//         },
//     }
//     const response = await axios.put(`${host}/detail/${reservationId}`, JSON.stringify(reservationData), config); // 쿼리 파라미터로 uno 추가
//     return response;
// }
export const modifyGolf = async (reservationId, reservationData) => {
    const config = getConfig();
    const response = await axios.put(`${host}/detail/${reservationId}`, JSON.stringify(reservationData), config);
    return response;
}

//MYPAGE 나의 예약 조회
export const myPageGolfReservations = async (uno, page, size) => {
    console.log("golf uno조회 " ,uno)
    const config = getConfig();
    try {
        const response = await axios.get(`${host}/myPage/${uno}`, {
            params: { uno, page, size },
            ...config
        })
        return response.data;
    } catch (error) {
        console.error("Error fetching user reservations:", error);
        throw error;
    }
}
