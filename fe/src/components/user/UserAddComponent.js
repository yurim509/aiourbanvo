import React, { useState } from 'react'
import useCustom from '../hook/useCustom'
import { postAdd } from '../api/userApi'
import '../../css/public/public.css'

const initState = {
  dong: '',
  ho: '',
  userName: '',
  phone: '',
  pw: '',
  verifyPw: '',
}

const UserAddComponent = () => {
  const { moveToList } = useCustom()
  const [userData, setUserData] = useState({ ...initState })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    userData[e.target.name] = e.target.value
    setUserData({ ...userData })
  }
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

    const updateData = { ...userData, userRoleList: ['USER'] }
    postAdd(updateData).then(data => {
      console.log('success : ' + data)
      moveToList()
    })
  }
  return (
    <div className='formContainer'>
      <div className='formGroup'>
        <label className='formLabel'>이름</label>
        <input className={`inputBox ${errors.userName && 'error'}`}
          name='userName'
          value={userData.userName}
          placeholder='이름 입력'
          onChange={handleChange} />
      </div>
      <div className='formGroup'>
        <label className='formLabel'>전화번호</label>
        <input className={`inputBox ${errors.phone && 'error'}`}
          name='phone'
          value={userData.phone}
          placeholder='전화번호 입력'
          onChange={handleChange} />
      </div>
      <div className='formGroup'>
        <label className='formLabel'>비밀번호</label>
        <input className={`inputBox ${errors.pw && 'error'}`}
          name='pw'
          value={userData.pw}
          type='password'
          placeholder='비밀번호 입력'
          onChange={handleChange} />
      </div>
      <div className='formGroup'>
        <label className='formLabel'>비밀번호 확인</label>
        <input className={`inputBox ${errors.verifyPw && 'error'}`}
          name='verifyPw'
          value={userData.verifyPw}
          type='password'
          placeholder='비밀번호 입력'
          onChange={handleChange} />
      </div>
      <div className='formGroup'>
        <label className='formLabel'>동</label>
        <input className={`inputBox ${errors.dong && 'error'}`}
          name='dong'
          value={userData.dong}
          placeholder='동 입력'
          onChange={handleChange} />
      </div>
      <div className='formGroup'>
        <label className='formLabel'>호</label>
        <input className={`inputBox ${errors.ho && 'error'}`}
          name='ho'
          value={userData.ho}
          placeholder='호 입력'
          onChange={handleChange} />
      </div>
      <div className='buttonGroup'>
        <button type='button' className='formButton add'
          onClick={handleClick}>추가</button>
        <button type='button' className='formButton cancel'
          onClick={moveToList}>취소</button>
      </div>
    </div>
  )
}

export default UserAddComponent