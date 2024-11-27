import { useDispatch, useSelector } from 'react-redux'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { loginPostAsync, logout } from '../../slice/loginSlice'

const useCustomLogin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const loginState = useSelector(state => state.loginSlice)

    const loadLoginData = () => {
        const token = localStorage.getItem("token")
        const uno = localStorage.getItem("uno")
        const role = localStorage.getItem("role")
        const dong = localStorage.getItem("dong")
        const ho = localStorage.getItem("ho")
        //이름,연락처 추가 1121(CYR)
        const userName = localStorage.getItem("userName")
        const phone = localStorage.getItem("phone")
        return { token, uno, role, dong, ho, userName, phone }
    }

    const isLogin = loadLoginData().token != null

    const doLogin = async (loginParam) => {
        const action = await dispatch(loginPostAsync(loginParam))

        if (action.type === 'loginPostAsync/fulfilled') {
            const { accessToken, uno, roleNames, dong, ho, phone, userName } = action.payload
            console.log(action.payload)
            localStorage.setItem("token", accessToken)
            localStorage.setItem("uno", uno)
            localStorage.setItem("role", roleNames)
            localStorage.setItem("dong", dong)
            localStorage.setItem("ho", ho)
            localStorage.setItem("phone", phone)
            localStorage.setItem("userName", userName)
            alert("로그인 되었습니다.")
            moveToPath('/')
        } else {
            alert('전화번호 혹은 비밀번호를 확인해 주십시오.')
            moveToPath('/login')
        }

        return action.payload
    }
    const doLogout = async () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("role")
        dispatch(logout())
    }

    const moveToPath = (path) => {
        navigate({ pathname: path }, { replace: true }) // replace:true >> 페이지 이동기록 덮어쓰기(뒤로가기 불가)
    }

    const exceptionHandler = (ex) => {
        const msg = ex.error
        console.log("exceptionHandler msg : ", msg)
        const str = createSearchParams({ error: msg }).toString()

        if (msg === "REQUIRE_LOGIN") {
            alert("로그인이 필요합니다.")
            navigate({ pathname: '/login', search: str })
            return
        }

        if (msg === "ERROR_ACCESS_DENIED") {
            alert("권한이 없습니다.")
            navigate({ pathname: '/login', search: str })
            return
        }

        if (msg === "ERROR_ACCESS_TOKEN") {
            alert("로그인 시간이 만료되었습니다.")
            navigate({ pathname: '/login', search: str })
            return
        }
    }

    return { navigate, dispatch, loginState, isLogin, doLogin, doLogout, moveToPath, loadLoginData, exceptionHandler }
}

export default useCustomLogin