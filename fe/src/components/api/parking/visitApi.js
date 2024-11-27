import axios from 'axios'

export const API_SERVER_HOST = 'http://localhost:8080'
const host = `${API_SERVER_HOST}/api/parking/visit`

export const visitGetList = async (pageParam) => {
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

export const visitGetUserList = async (pageParam, loginUser) => {
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

export const visitGetSearchList = async (pageParam, searchData) => {
    const token = localStorage.getItem('token')
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }
    const body = {
        pageRequestDTO: pageParam,
        visitSearchDataDTO: searchData,
    }
    console.log(body)
    const res = await axios.post(`${host}/search`, body, config)
    console.log('search data api : ', res.data)
    return res.data
}

export const visitParkingDeleteChecked = async (checkedVpno) => {
    const token = localStorage.getItem('token')
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }
    const res = await axios.post(`${host}/delete`, checkedVpno, config)
    return res.data
}

export const visitPostAdd = async (serverData) => {
    const token = localStorage.getItem('token')
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }
    const { carNum, name, phone, dong, ho, expectedDate } = serverData
    const updateServerData = {
        carNum: carNum,
        name: name,
        phone: phone,
        expectedDate: expectedDate,
        householdDTO: {
            dong: dong,
            ho: ho,
        },
    }
    const res = await axios.post(`${host}/`, updateServerData, config)
    return res.data
}

export const visitGetOne = async (vpno) => {
    console.log('api', vpno)
    const token = localStorage.getItem('token')
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    }
    const res = await axios.get(`${host}/${vpno}`, config)
    return res.data
}

export const visitPutOne = async (vpno, serverData) => {
    console.log(serverData)
    const token = localStorage.getItem('token')
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }
    const { carNum, name, phone, dong, ho, expectedDate } = serverData
    const updateServerData = {
        carNum: carNum,
        name: name,
        phone: phone,
        expectedDate: expectedDate,
        householdDTO: {
            dong: dong,
            ho: ho,
        },
    }
    const res = await axios.put(`${host}/${vpno}`, updateServerData, config)
    console.log('api', res.data)
    return res.data
}