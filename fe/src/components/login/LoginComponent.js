import React, { useCallback, useState } from 'react'
import useCustomLogin from '../hook/useCustomLogin'
import '../../css/public/public.css'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const initState = {
    phone: '010',
    pw: '',
}
const LoginComponent = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [loginParam, setLoginParam] = useState(initState)
    const { doLogin } = useCustomLogin()
    const isFindPw = location.pathname.endsWith('findPw')

    const handleChange = (e) => {
        loginParam[e.target.name] = e.target.value
        setLoginParam({ ...loginParam })

        // // 로그인 시 전화번호만 입력 가능하도록 (추후 주석 해제)
        // const value = e.target.value

        // if (!value.startsWith('010')) {
        //     setLoginParam({
        //         ...loginParam,
        //         phone: '010', // 강제로 '010'으로 고정
        //     })
        //     return
        // }

        // const onlyNum = value.slice(3).replace(/\D/g, '') // 숫자만 남김 ("/\D/g" : 숫자가 아닌 문자를 찾는 정규식)
        // setLoginParam({
        //     ...loginParam,
        //     phone: '010' + onlyNum.slice(0, 8), // 010 이후 8자리까지 제한
        // })
    }

    const handleClick = () => {
        doLogin(loginParam)
        setLoginParam(initState)
    }

    const handleClickFindPw = () => {
        navigate('findPw')
    }

    return (
        <div className='loginBackground'>
            <div>
                <Outlet />
            </div>
            {!isFindPw && ( // findPw 경로에서 표기 X (opacity 때문에 비침)
                <div className='formContainer'>
                    <div className='formGroup'>
                        <label className='formLabel'>전화번호</label>
                        <input className='inputBox'
                            name='phone'
                            placeholder='전화번호 입력'
                            type='text'
                            value={loginParam.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='formGroup'>
                        <label className='formLabel'>비밀번호</label>
                        <input className='inputBox'
                            name='pw'
                            type='password'
                            placeholder='비밀번호 입력'
                            value={loginParam.pw}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='buttonGroup'>
                        <button type='button' className='formButton add'
                            onClick={handleClickFindPw}>비밀번호 찾기</button>
                        <button type='button' className='formButton add'
                            onClick={handleClick}>로그인</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LoginComponent