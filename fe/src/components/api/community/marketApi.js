import axios from "axios";

export const API_SERVER_HOST = 'http://localhost:8080';
const host = `${API_SERVER_HOST}/api/communities/market`;

// 리스트 가져오기
export const get = async (pageParam) => {
    const { page, size } = pageParam;
    const token = localStorage.getItem("token");
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

// 상품 추가
export const post = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    };

    try {
        const res = await axios.post(`${host}/add`, formData, config);
        return res.data;
    } catch (error) {
        console.error("상품 추가 요청 실패:", error);
        throw error;
    }
};

// 게시물 삭제
export const deleteChecked = async (mno, uno, role) => {
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
        const res = await axios.delete(`${host}/${mno}?${queryParams}`, config);
        return res.data;
    } catch (error) {
        console.error("삭제 요청 실패", error);
        throw error;
    }
};

// 수정 데이터 가져오기
export const getModify = async (mno) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("인증 토큰이 존재하지 않습니다.");

        const config = {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        const res = await axios.get(`${host}/modify/${mno}`, config);
        return res.data;
    } catch (error) {
        console.error("수정 데이터 조회 실패", error);
        throw error;
    }
};

// 게시물 수정
export const update = async (data, mno, uno, thumbnail, images) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("인증 토큰이 존재하지 않습니다.");

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("price", data.price); // 가격 추가
    formData.append("uno", uno); // uno 추가

    if (thumbnail) {
        formData.append("thumbnail", thumbnail);
    }

    if (images && images.length > 0) {
        images.forEach(image => {
            formData.append("images", image);
        });
    }

    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    };

    const res = await axios.put(`${host}/modify/${mno}`, formData, config);
    return res.data;
};

// 내가 쓴 게시물 조회
export const getMyMarketPosts = async (uno) => {
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
        const res = await axios.get(`${host}/${uno}`, config); // uno 기반 API 호출
        return res.data;
    } catch (error) {
        console.error("내 마켓 게시글 조회 실패", error);
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

