import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { loginPost } from "../components/api/userApi"

const initState = { phone: '' }

export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => {
    return loginPost(param)
})

const loginSlice = createSlice({
    name: 'LoginSlice',
    initialState: initState,
    reducers: {
        login: (state, action) => {
            const data = action.payload
            console.log("login.... : " + data.phone)
            return { phone: data.phone }
        },
        logout: (state, action) => {
            console.log("logout....")
            return { initState }
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginPostAsync.fulfilled, (state, action) => { // 완료
                console.log("fulfilled.... : " + action.payload)
                const payload = action.payload
                return payload
            })
            .addCase(loginPostAsync.pending, (state, action) => {
                console.log('pending.... : 처리중...')
            })
            .addCase(loginPostAsync.rejected, (state, action) => {
                console.log('rejected.... : 중단됨...')
            })
    }
})
export const { login, logout } = loginSlice.actions

export default loginSlice.reducer