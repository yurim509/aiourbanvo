import axios from "axios";

export const API_SERVER_HOST = 'http://localhost:8080';
const host = `${API_SERVER_HOST}/api/communities/board`;

// 게시글 목록 조회
export const get = async (pageParam) => {
    const { page, size } = pageParam;
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("토큰이 존재하지 않습니다.");
        throw new Error("로그인이 필요합니다.");
    }

    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        params: { page, size },
    };

    const res = await axios.get(`${host}/list`, config);
    return res.data;
};

// 게시글 수정 데이터 조회
export const getModify = async (pno) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("토큰이 존재하지 않습니다.");
        throw new Error("로그인이 필요합니다.");
    }

    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    try {
        const res = await axios.get(`${host}/modify/${pno}`, config);
        return res.data;
    } catch (error) {
        console.error("게시글 수정 데이터 조회 실패", error);
        throw error;
    }
};

// 새 게시글 생성
export const post = async (data, uno) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("토큰이 존재하지 않습니다.");
        throw new Error("로그인이 필요합니다.");
    }

    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    const res = await axios.post(`${host}/add?uno=${uno}`, JSON.stringify(data), config);
    return res.data;
};

// 게시글 업데이트
export const update = async (data, pno, uno) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("토큰이 존재하지 않습니다.");
        throw new Error("로그인이 필요합니다.");
    }

    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    const res = await axios.put(`${host}/${pno}?uno=${uno}`, JSON.stringify(data), config);
    return res.data;
};
//삭제
export const deleteChecked = async (pno, uno, role) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("토큰이 존재하지 않습니다.");
        throw new Error("로그인이 필요합니다.");
    }

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // 관리자일 경우 uno를 전달하지 않음
    const queryParams = role === "admin" || role === "root" ? `role=${role}` : `uno=${uno}&role=${role}`;

    try {
        const res = await axios.delete(`${host}/${pno}?${queryParams}`, config);
        return res.data;
    } catch (error) {
        console.error("삭제 요청 실패", error);
        throw error;
    }
};



// 내가 쓴 게시글 조회
export const getMyCommunityPosts = async (uno) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("토큰이 존재하지 않습니다.");
        throw new Error("로그인이 필요합니다.");
    }

    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    try {
        const res = await axios.get(`${host}/${uno}`, config);
        return res.data;
    } catch (error) {
        console.error("내 게시글 조회 실패", error);
        throw error;
    }
};
export const search = async ({ type, keyword, page, size, category }) => {
const token = localStorage.getItem("token");

if (!token) {
    console.error("토큰이 없습니다.");
    throw new Error("로그인이 필요합니다.");
}

const config = {
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    params: { type, keyword, page, size, category },
};

try {
    const res = await axios.get(`${host}/search`, config);
    return res.data;
} catch (error) {
    console.error("검색 요청 실패:", error);
    throw error;
}
};

