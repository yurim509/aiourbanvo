import React, { useState } from 'react'
import useCustom from '../hook/useCustom'
import { regularPostAdd } from '../api/parking/regularApi'
import '../../css/public/public.css'

const initState = {
  carNum: '',
  name: '',
  phone: '',
  dong: '',
  ho: '',
}
const RegularAddComponent = () => {
  const { page, size, moveToPath } = useCustom()
  const [serverData, setServerData] = useState({ ...initState })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    serverData[e.target.name] = e.target.value
    setServerData({ ...serverData })
  }
  const handleClick = () => {
    // 입력 예외처리
    const fieldLabels = {
      carNum: '차량번호',
      name: '이름',
      phone: '전화번호',
      dong: '동',
      ho: '호',
    }
    const errorMsg = [] // 인풋 에러 메세지
    const newErrors = {} // 인풋 에러 상태
    for (const [key, value] of Object.entries(serverData)) {
      if (key === 'householdDTO') continue
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

    regularPostAdd(serverData).then(data => {
      console.log('success : ' + data)
      moveToPath('/parking/regular', { page, size })
    })
  }
  return (
    <div className="formContainer">
      <div className="formGroup">
        <label className="formLabel">차량번호</label>
        <input
          className={`inputBox ${errors.carNum && 'error'}`}
          name="carNum"
          placeholder="차량번호 입력"
          onChange={handleChange}
        />
      </div>
      <div className="formGroup">
      </div>
      <div className="formGroup">
        <label className="formLabel">이름</label>
        <input
          className={`inputBox ${errors.name && 'error'}`}
          name="name"
          placeholder="이름 입력"
          onChange={handleChange}
        />
      </div>
      <div className="formGroup">
        <label className="formLabel">전화번호</label>
        <input
          className={`inputBox ${errors.phone && 'error'}`}
          name="phone"
          placeholder="전화번호 입력"
          onChange={handleChange}
        />
      </div>
      <div className="formGroup">
        <label className="formLabel">동</label>
        <input
          className={`inputBox ${errors.dong && 'error'}`}
          name="dong"
          placeholder="동 입력"
          onChange={handleChange}
        />
      </div>
      <div className="formGroup">
        <label className="formLabel">호</label>
        <input
          className={`inputBox ${errors.ho && 'error'}`}
          name="ho"
          placeholder="호 입력"
          onChange={handleChange}
        />
      </div>
      <div className="buttonGroup">
        <button type="button" className="formButton add" onClick={handleClick}>
          추가
        </button>
        <button
          type="button"
          className="formButton cancel"
          onClick={() => moveToPath('/parking/regular', { page, size })}
        >
          취소
        </button>
      </div>
    </div>
  )
}

export default RegularAddComponent