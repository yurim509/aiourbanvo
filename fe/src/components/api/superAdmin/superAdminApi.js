import axios from "axios"

export const API_SERVER_HOST = "http://localhost:8080"
const host = `${API_SERVER_HOST}/api/superAdmin`

export const superAdminGetAllList = async (pageParam) => {
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


export const superAdminGetSearchList = async (pageParam, searchData) => {
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

export const superAdminAddRole = async (pageParam) => {
    const { page, size } = pageParam
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        params: { page, size },
    }
    const res = null
    // const res = await axios.get(`${host}/list`, config)
    return res.data
}
export const superAdminRecovery = async (pageParam) => {
    const { page, size } = pageParam
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        params: { page, size },
    }
    const res = null
    // const res = await axios.get(`${host}/list`, config)
    return res.data
}

export const addRole = async (uno, roleData) => {
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    }
    const body = {
        uno: uno,
        role: roleData,
    }
    const res = await axios.post(`${host}/addRole`, body, config)
    return res.data
}

export const superAdminHardDelete = async (checkedUno) => {
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