import axios from 'axios'

export const API_SERVER_HOST = 'http://localhost:8080'
const host = `${API_SERVER_HOST}/api/parking/regular`

export const regularGetList = async (pageParam) => {
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
    return res.data
}

export const regularGetUserList = async (pageParam, loginUser) => {
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

export const regularGetSearchList = async (pageParam, searchData) => {
    const token = localStorage.getItem('token')
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }
    const body = {
        pageRequestDTO: pageParam,
        regularSearchDataDTO: searchData,
    }
    const res = await axios.post(`${host}/search`, body, config)
    console.log('regular api : ', res.data)
    return res.data
}

export const regularParkingDeleteChecked = async (checkedRpno) => {
    const token = localStorage.getItem('token')
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }
    const res = await axios.post(`${host}/delete`, checkedRpno, config)
    return res.data
}

export const regularPostAdd = async (userData) => {
    const token = localStorage.getItem('token')
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }
    const updateUserData = {
        carNum: userData.carNum,
        name: userData.name,
        phone: userData.phone,
        householdDTO: {
            dong: userData.dong,
            ho: userData.ho,
        }
    }
    console.log(updateUserData)
    const res = await axios.post(`${host}/`, updateUserData, config)
    return res.data
}

export const regularGetOne = async (rpno) => {
    console.log('api', rpno)
    const token = localStorage.getItem('token')
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    }
    const res = await axios.get(`${host}/${rpno}`, config)
    return res.data
}

export const regularPutOne = async (rpno, serverData) => {
    console.log(serverData)
    const token = localStorage.getItem('token')
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }
    const { carNum, name, phone, dong, ho } = serverData
    const body = {
        regularParkingDTO: {
            carNum: carNum,
            name: name,
            phone: phone,
            householdDTO: {
                dong: dong,
                ho: ho,
            },
        }
    }
    const res = await axios.put(`${host}/${rpno}`, body, config)
    console.log('api', res.data)
    return res.data
}