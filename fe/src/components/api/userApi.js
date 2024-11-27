import axios from "axios"

export const API_SERVER_HOST = "http://localhost:8080"
const host = `${API_SERVER_HOST}/api/user`

export const getList = async (pageParam) => {
    const { page, size } = pageParam
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        params: { page, size },
    }
    const res = await axios.get(`${host}/list`, config)
    return res.data
}

export const getSearchList = async (pageParam, searchData) => {
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    }
    const body = {
        pageRequestDTO: pageParam,
        userSearchDataDTO: searchData,
    }
    const res = await axios.post(`${host}/search`, body, config)
    return res.data
}

export const getApprovalList = async (pageParam) => {
    const { page, size } = pageParam
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        params: { page, size },
    }
    const res = await axios.get(`${host}/approval_list`, config)
    return res.data
}

export const postAdd = async (userData) => {
    console.log(userData)
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    }
    const res = await axios.post(`${host}/`, JSON.stringify(userData), config)
    return res.data
}

export const putOne = async (uno, userData) => {
    console.log(userData)
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    }
    const res = await axios.put(`${host}/${uno}`, JSON.stringify(userData), config)
    return res.data
}

export const getOne = async (uno) => {
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    }
    const res = await axios.get(`${host}/${uno}`, config)
    console.log('user api getOne : ', res.data)
    return res.data
}

export const deleteChecked = async (checkedUno) => {
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    }
    const res = await axios.post(`${host}/delete`, checkedUno, config)
    return res.data
}

export const loginPost = async (loginParam) => {
    const header = { headers: { "Content-Type": "application/json" } };
    const body = {
        phone: loginParam.phone,
        pw: loginParam.pw,
    };
    try {
        const res = await axios.post(`${host}/login`, JSON.stringify(body), header);
        return res.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export const approvalStatus = async (uno) => {
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        params: { uno },
    }
    const res = await axios.get(`${host}/approval`, config)
    return res.data
}

export const addUserRole = async (uno) => {
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    }
    const body = { uno }
    const res = await axios.post(`${host}/approval`, body, config)
    return res.data
}