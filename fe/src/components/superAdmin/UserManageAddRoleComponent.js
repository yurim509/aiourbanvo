import React, { useEffect, useState } from 'react'
import useCustom from '../hook/useCustom'
import { getOne, putOne } from '../api/userApi'
import { useOutletContext } from 'react-router-dom'
import { addRole } from '../api/superAdmin/superAdminApi'
import '../../css/public/public.css'

const initState = {
    dong: '',
    ho: '',
    userName: '',
    phone: '',
    pw: '',
    userRoleList: [],
    delFlag: [],
}

const roleLabelList = {
    PENDING: '승인대기',
    USER: '일반유저',
    ADMIN: '관리자',
    ROOT: '루트',
}

const UserManageAddRoleComponent = () => {
    const { moveToPath } = useCustom()
    const [userData, setUserData] = useState({ ...initState })
    const { checkedUno } = useOutletContext()
    const [roleData, setRoleData] = useState('')
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
                userRoleList: data.userRoleList ?? [],
                delFlag: data.delFlag,
            })
        })
    }, [checkedUno])

    const handleChange = (e) => {
        let value = e.target.value
        if (e.target.name === 'delFlag') {
            value = value === 'true'
            console.log(value)
        }
        userData[e.target.name] = e.target.value
        setUserData({ ...userData })
    }

    const handleChangeRole = (e) => {
        setRoleData(e.target.value)
    }

    // 수정 data 전송
    const handleClick = async () => {
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
            // 권한, 복구 add
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

        console.log('addRole uno : ' + checkedUno[0])
        await putOne(checkedUno[0], userData).then(() => {
            console.log('addRole success')
        })
        await addRole(checkedUno[0], roleData).then(data => {
            console.log('addRole success : ', data)
            moveToPath('/superAdmin/userManage')
        })
    }
    return (
        <div className='formContainer'>
            <div className="formGroup">
                <label className="formLabel">이름</label>
                <input className={`inputBox ${errors.userName && 'error'}`}
                    name='userName'
                    value={userData.userName}
                    placeholder='이름 입력'
                    onChange={handleChange} />
            </div>
            <div className="formGroup">
                <label className="formLabel">전화번호</label>
                <input className={`inputBox ${errors.phone && 'error'}`}
                    name='phone'
                    value={userData.phone}
                    placeholder='전화번호 입력'
                    onChange={handleChange} />
            </div>
            <div className="formGroup">
                <label className="formLabel">비밀번호</label>
                <input className={`inputBox ${errors.pw && 'error'}`}
                    name='pw'
                    value={userData.pw}
                    type='password'
                    placeholder='비밀번호 입력'
                    onChange={handleChange} />
            </div>
            <div className="formGroup">
                <label className="formLabel">비밀번호 확인</label>
                <input className={`inputBox ${errors.verifyPw && 'error'}`}
                    name='verifyPw'
                    value={userData.verifyPw}
                    type='password'
                    placeholder='비밀번호 입력'
                    onChange={handleChange} />
            </div>
            <div className="formGroup">
                <label className="formLabel">동</label>
                <input className={`inputBox ${errors.dong && 'error'}`}
                    name='dong'
                    placeholder='동 입력'
                    value={userData.dong}
                    onChange={handleChange} />
            </div>
            <div className="formGroup">
                <label className="formLabel">호</label>
                <input className={`inputBox ${errors.ho && 'error'}`}
                    name='ho'
                    placeholder='호 입력'
                    value={userData.ho}
                    onChange={handleChange} />
            </div>
            <div className="formGroup">
                <label className="formLabel">권한</label>
                <select className='inputBox'
                    name='userRoleList'
                    onChange={handleChangeRole}>
                    <option value={userData.userRoleList[0]}>
                        {roleLabelList[userData.userRoleList[0]] || '삭제된 유저'}</option>
                    <option value='PENDING'>승인대기</option>
                    <option value='USER'>일반유저</option>
                    <option value='ADMIN'>관리자</option>
                    <option value='ROOT'>루트</option>
                </select>
            </div>
            <div className="formGroup">
                <label className="formLabel">복구</label>
                <select className='inputBox'
                    name='delFlag'
                    onChange={handleChange}>
                    <option value={userData.delFlag}>{userData.delFlag ? '삭제된 유저' : '삭제되지 않은 유저'}</option>
                    <option value='false'>복구</option>
                    <option value='true'>삭제</option>
                </select>
            </div>
            <div className="buttonGroup">
                <button type='button' className='formButton add'
                    onClick={handleClick}>수정</button>
                <button type='button' className='formButton cancel'
                    onClick={() => moveToPath('/superAdmin/userManage')}>취소</button>
            </div>
        </div>
    )
}

export default UserManageAddRoleComponent