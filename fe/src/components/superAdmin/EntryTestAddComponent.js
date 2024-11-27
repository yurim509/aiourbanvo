import React, { useState } from 'react'
import { entryPost, exitPost } from '../api/parking/entryApi'
import '../../css/public/public.css'

const initState = {
    carNum: '',
    dong: '',
    ho: '',
    entryDate: '',
    exitDate: '',
}

const EntryTestAddComponent = () => {
    const [serverData, setServerData] = useState({ ...initState })
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        serverData[e.target.name] = e.target.value
        setServerData({ ...serverData })
    }

    // 입력 예외처리
    const inputError = (list) => {
        const fieldLabels = {
            carNum: '차량번호',
            dong: '동',
            ho: '호',
            entryDate: '입차일',
            exitDate: '출차일',
        }
        const errorMsg = [] // 인풋 에러 메세지
        const newErrors = {} // 인풋 에러 상태
        for (const key of list) {
            const value = serverData[key]
            if (!value) {
                console.log(key, value)
                errorMsg.push(`[${fieldLabels[key]}]`)
                newErrors[key] = true
            }
        }

        setErrors(newErrors)

        if (errorMsg.length > 0) {
            alert(errorMsg.join(' ') + ' 입력값이 없습니다')
            return true // 예외 발생 시 true 반환
        }
        return false // 예외 미 발생 시 false 반환
    }

    const handleClickEntry = () => {
        // 예외처리 항목 전달 (입차 시 출차일 생략 가능)
        const isError = inputError([
            'carNum',
            'dong',
            'ho',
            'entryDate',
        ])
        if (isError) return
        entryPost(serverData)
        window.location.reload()

    }

    const handleClickExit = () => {
        // 예외처리 항목 전달 (출차 시 입차일 생략 가능)
        const isError = inputError([
            'carNum',
            'dong',
            'ho',
            'exitDate',
        ])
        if (isError) return
        exitPost(serverData)
        window.location.reload()
    }
    return (
        <div className='formContainer superAdminAdd'>
            <div className="formGroup superAdminAdd">
                <label className="formLabel">차량번호</label>
                <input
                    className={`inputBox ${errors.carNum && 'error'}`}
                    name='carNum'
                    onChange={handleChange} />
            </div>
            <div className="formGroup superAdminAdd">
                <label className="formLabel">동</label>
                <input
                    className={`inputBox ${errors.dong && 'error'}`}
                    name='dong'
                    onChange={handleChange} />
            </div>
            <div className="formGroup superAdminAdd">
                <label className="formLabel">호</label>
                <input
                    className={`inputBox ${errors.ho && 'error'}`}
                    name='ho'
                    onChange={handleChange} />
            </div>
            <div className="formGroup superAdminAdd">
                <label className="formLabel">입차일</label>
                <input
                    className={`inputBox ${errors.entryDate && 'error'}`}
                    type='date'
                    name='entryDate'
                    onChange={handleChange} />
            </div>
            <div className="formGroup superAdminAdd">
                <label className="formLabel">출차일</label>
                <input
                    className={`inputBox ${errors.exitDate && 'error'}`}
                    type='date'
                    name='exitDate'
                    onChange={handleChange} />
            </div>
            <div className="buttonGroup">
                <button type='button' className='formButton add'
                    onClick={handleClickEntry}>입차</button>
                <button type='button' className='formButton cancel'
                    onClick={handleClickExit}>출차</button>
            </div>
        </div>
    )
}

export default EntryTestAddComponent