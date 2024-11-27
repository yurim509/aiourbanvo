import React, { useEffect, useState } from 'react'
import useCustom from '../hook/useCustom'
import { useOutletContext } from 'react-router-dom'
import { visitGetOne, visitPutOne } from '../api/parking/visitApi'
import useCustomLogin from '../hook/useCustomLogin'
import '../../css/public/public.css'

const initState = {
    carNum: '',
    name: '',
    phone: '',
    dong: '',
    ho: '',
    expectedDate: '',
}

const VisitModifyComponent = () => {
    const { moveToPath, page, size } = useCustom()
    const [serverData, setServerData] = useState({ ...initState })
    const { checkedVpno } = useOutletContext()
    const { loadLoginData } = useCustomLogin()
    const [errors, setErrors] = useState({})

    // data 수신
    useEffect(() => {
        visitGetOne(checkedVpno[0]).then(data => {
            console.log(data)
            setServerData({
                // null || undefined 일 경우 '' || 0 로 대체 (controlled input 에러)
                ...data,
                carNum: data.carNum || '',
                name: data.name || '',
                phone: data.phone || '',
                dong: data.household.householdPK.dong ?? '',
                ho: data.household.householdPK.ho ?? '',
                expectedDate: data.expectedDate ?? '',
            })
        })
    }, [checkedVpno])

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
            expectedDate: '입차 예상 날짜',
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

        visitPutOne(checkedVpno[0], serverData).then(() => {
            moveToPath('/parking/visit', { page, size })
        })
    }
    return (
        <div className='formContainer'>
            <div className="formGroup">
                <label className="formLabel">차량번호</label>
                <input
                    className={`inputBox ${errors.carNum && 'error'}`}
                    name="carNum"
                    placeholder='차량번호 입력'
                    value={serverData.carNum}
                    onChange={handleChange}
                />
            </div>
            <div className="formGroup">
                <label className="formLabel">이름</label>
                <input
                    className={`inputBox ${errors.name && 'error'}`}
                    name="name"
                    placeholder='이름 입력'
                    value={serverData.name}
                    onChange={handleChange}
                />
            </div>
            {/* 권한 별 분기 - 동/호 선택 여부 */}
            {loadLoginData().role !== 'ADMIN' && loadLoginData().role !== 'ROOT' ?
                <>
                    <div className="formGroup">
                        <label className="formLabel">동</label>
                        <input
                            className={`inputBox ${errors.dong && 'error'}`}
                            name='dong'
                            value={loadLoginData().ho}
                            disabled
                            onChange={handleChange} />
                    </div>
                    <div className="formGroup">
                        <label className="formLabel">호</label>
                        <input
                            className={`inputBox ${errors.ho && 'error'}`}
                            name='ho'
                            value={loadLoginData().ho}
                            disabled
                            onChange={handleChange} />
                    </div>
                </>
                :
                <>
                    <div className="formGroup">
                        <label className="formLabel">동</label>
                        <input
                            className={`inputBox ${errors.dong && 'error'}`}
                            name='dong'
                            placeholder="동 입력"
                            value={serverData.dong}
                            onChange={handleChange} />
                    </div>
                    <div className="formGroup">
                        <label className="formLabel">호</label>
                        <input
                            className={`inputBox ${errors.ho && 'error'}`}
                            name='ho'
                            placeholder="호 입력"
                            value={serverData.ho}
                            onChange={handleChange} />
                    </div>
                </>
            }
            {/* --------------- */}

            <div className="formGroup">
                <label className="formLabel">전화번호</label>
                <input
                    className={`inputBox ${errors.phone && 'error'}`}
                    name="phone"
                    placeholder='전화번호 입력'
                    value={serverData.phone}
                    onChange={handleChange}
                />
            </div>
            <div className="formGroup">
                <label className="formLabel">입차 예상 날짜</label>
                <input
                    className={`inputBox ${errors.expectedDate && 'error'}`}
                    type='date'
                    name='expectedDate'
                    onChange={handleChange} />
            </div>
            <div className="buttonGroup">
                <button type='button' className='formButton add'
                    onClick={handleClick}>수정</button>
                <button type='button' className='formButton cancel'
                    onClick={(pageParam) => moveToPath('/parking/visit', pageParam)}>취소</button>
            </div>
        </div>
    )
}

export default VisitModifyComponent