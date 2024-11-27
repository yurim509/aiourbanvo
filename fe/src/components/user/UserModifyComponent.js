import React, { useEffect, useState } from 'react'
import useCustom from '../hook/useCustom'
import { getOne, putOne } from '../api/userApi'
import { useOutletContext } from 'react-router-dom'
import '../../css/public/public.css'

const initState = {
    dong: '',
    ho: '',
    userName: '',
    phone: '',
    pw: '',
    verifyPw: '',
}

const UserModifyComponent = () => {
    const { moveToList } = useCustom()
    const [userData, setUserData] = useState({ ...initState })
    const { checkedUno } = useOutletContext()
    const [errors, setErrors] = useState({})

    // data 수신
    useEffect(() => {
        getOne(checkedUno[0]).then(data => {
            console.log(data)
            setUserData({
                // null || undefined 일 경우 '' || 0 로 대체 (controlled input 에러)
                ...data,
                userName: data.userName || '',
                phone: data.phone || '',
                pw: '',
                verifyPw: '',
                dong: data.dong ?? '',
                ho: data.ho ?? '',
            })
        })
    }, [checkedUno])

    const handleChange = (e) => {
        userData[e.target.name] = e.target.value
        setUserData({ ...userData })
    }

    // 수정 data 전송
    const handleClick = () => {
        // 입력 예외처리
        const fieldLabels = {
            userName: '이름',
            phone: '전화번호',
            pw: '비밀번호',
            verifyPw: '비밀번호확인',
            dong: '동',
            ho: '호',
        }
        const errorMsg = [] // 인풋 에러 메세지
        const newErrors = {} // 인풋 에러 상태
        for (const [key, value] of Object.entries(userData)) {
            if (key === 'delFlag') continue
            if (!value) {
                console.log(key, value)
                errorMsg.push(`[${fieldLabels[key]}]`)
                newErrors[key] = true
            }
        }

        setErrors(newErrors)

        if (errorMsg.length > 0) {
            alert(errorMsg.join(' ') + ' 입력값이 없습니다')
            return
        }

        if (!(userData.pw === userData.verifyPw)) {
            alert('비밀번호와 비밀번호 확인이 일치하지 않습니다')
            setErrors({ pw: true, verifyPw: true })
            return
        }

        console.log('modify uno : ' + checkedUno[0])
        putOne(checkedUno[0], userData).then(() => {
            console.log('modify success')
            moveToList()
        })
    }

    return (
        <div className='formContainer'>
            <div className='formGroup'>
                <label className='formLabel'>이름</label>
                <input className={`inputBox ${errors.userName && 'error'}`}
                    name='userName'
                    placeholder='이름 입력'
                    value={userData.userName}
                    onChange={handleChange} />
            </div>
            <div className='formGroup'>
                <label className='formLabel'>전화번호</label>
                <input className={`inputBox ${errors.phone && 'error'}`}
                    name='phone'
                    placeholder='전화번호 입력'
                    value={userData.phone}
                    onChange={handleChange} />
            </div>
            <div className='formGroup'>
                <label className='formLabel'>비밀번호</label>
                <input className={`inputBox ${errors.pw && 'error'}`}
                    type='password'
                    name='pw'
                    value={userData.pw}
                    placeholder='비밀번호 입력'
                    onChange={handleChange} />
            </div>
            <div className='formGroup'>
                <label className='formLabel'>비밀번호 확인</label>
                <input className={`inputBox ${errors.verifyPw && 'error'}`}
                    type='password'
                    name='verifyPw'
                    value={userData.verifyPw}
                    placeholder='비밀번호 재입력'
                    onChange={handleChange} />
            </div>
            <div className='formGroup'>
                <label className='formLabel'>동</label>
                <input className={`inputBox ${errors.dong && 'error'}`}
                    name='dong'
                    placeholder='동 입력'
                    value={userData.dong}
                    onChange={handleChange} />
            </div>
            <div className='formGroup'>
                <label className='formLabel'>호</label>
                <input className={`inputBox ${errors.ho && 'error'}`}
                    name='ho'
                    placeholder='호 입력'
                    value={userData.ho}
                    onChange={handleChange} />
            </div>
            <div className='buttonGroup'>
                <button type='button' className='formButton add'
                    onClick={handleClick}>수정</button>
                <button type='button' className='formButton cancel'
                    onClick={moveToList}>취소</button>
            </div>
        </div>
    )
}

export default UserModifyComponent