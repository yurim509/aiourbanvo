import axios from "axios"

export const API_SERVER_HOST = "http://localhost:8080"
const host = `${API_SERVER_HOST}/api/main`

export const register = async (userData) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    }
    console.log(userData)
    const res = await axios.post(`${host}/join`, JSON.stringify(userData), config)
    return res.data
}

export const verifyPhoneSend = async (phone) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
        params: {
            phone: phone
        },
    }
    const res = await axios.post(`${host}/verify`, null, config)
    console.log(res.data)
    return res.data
}

export const findPw = async (phone) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
        params: {
            phone: phone
        }
    }
    try {
        const res = await axios.post(`${host}/findPw`, null, config)
        return res.data
    } catch (error) {
        throw error
    }
}

export const changePw = async (pw, uno) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    }

    const body = {
        pw: pw,
        uno: uno
    }

    try {
        const res = await axios.post(`${host}/changePw`, body, config)
        return res.data
    } catch (error) {
        throw error
    }
}