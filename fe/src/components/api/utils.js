import axios from "axios";


//  ===================날짜를 한국 시간으로 포맷팅하는 함수
export const formatToKoreanTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

//  ===================숫자를 미국식 콤마 형식으로 포맷팅하는 함수
export const formatNumber = (number) => {
    return number.toLocaleString('en-US');
};




// ===================기본 url
let backendHost;
const hostname = window && window.location && window.location.hostname;

if (hostname === "localhost") {
    backendHost = "http://localhost:8080";
} else {
    // 혜미 서버
    // backendHost = "http://13.209.236.187:8080";
}

export const API_BASE_URL = backendHost;


// =================== axios call 함수
export async function apiCall(url, method, requestData) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': 'Bearer ' + token })
    };

    const options = {
        url: API_BASE_URL + url,
        method: method,
        headers: headers,
        ...(requestData && method === 'GET' ? { params: requestData } : { data: requestData })
    };

    return axios(options)
        .then(response => response)
        .catch(err => {
            console.error(`** apiCall Error message=${err.message}`);
            if (err.response) {
                console.error(`** Error status=${err.response.status}`);
            }
            return Promise.reject(err.response || err);
        });
}


// =============JSON 형식인지 확인하는 함수
export const isJSON = (str) => {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

// =================안전하게 JSON 파싱을 시도하는 함수
export const getParsedItem = (key) => {
    const item = localStorage.getItem(key);
    return item && item !== "undefined" && isJSON(item) ? JSON.parse(item) : item;
};