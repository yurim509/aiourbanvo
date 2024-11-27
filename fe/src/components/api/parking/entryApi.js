import axios from 'axios'

export const API_SERVER_HOST = 'http://localhost:8080'
const host = `${API_SERVER_HOST}/api/parking/entry`

export const entryGetList = async (pageParam) => {
    const { page, size } = pageParam
    const token = localStorage.getItem('token')
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        params: { page, size },
    }
    const res = await axios.get(`${host}/list`, config)
    console.log('getList : ', res.data)
    return res.data
}

export const entryGetUserList = async (pageParam, loginUser) => {
    console.log('getUserList loginUser : ', pageParam)
    console.log('getUserList loginUser : ', loginUser)
    const token = localStorage.getItem('token')
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }

    const body = {
        pageRequestDTO: pageParam,
        householdDTO: loginUser,
    }
    const res = await axios.post(`${host}/user_list`, body, config)
    return res.data
}

export const entryGetSearchList = async (pageParam, searchData) => {
    const token = localStorage.getItem('token')
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }
    const body = {
        pageRequestDTO: pageParam,
        entryExitSearchDataDTO: searchData,
    }
    console.log(body)
    const res = await axios.post(`${host}/search`, body, config)
    console.log('search data api : ', res.data)
    return res.data
}


export const entryPost = async (serverData) => {
    const token = localStorage.getItem('token')
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }
    const { carNum, name, phone, dong, ho, entryDate, exitDate } = serverData
    const updateServerData = {
        carNum: carNum,
        name: name,
        phone: phone,
        dong: dong,
        ho: ho,
        entryDate: entryDate,
        exitDate: exitDate,
    }
    const res = await axios.post(`${host}/entry`, updateServerData, config)
    return res.data
}

export const exitPost = async (serverData) => {
    const token = localStorage.getItem('token')
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }
    const { carNum, name, phone, dong, ho, entryDate, exitDate } = serverData
    const updateServerData = {
        carNum: carNum,
        name: name,
        phone: phone,
        dong: dong,
        ho: ho,
        entryDate: entryDate,
        exitDate: exitDate,
    }
    const res = await axios.post(`${host}/exit`, updateServerData, config)
    return res.data
}

export const entryDeleteChecked = async (checkedEeno) => {
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    }
    const res = await axios.post(`${host}/delete`, checkedEeno, config)
    return res.data
}