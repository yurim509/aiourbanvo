import React, { useCallback, useEffect, useState } from 'react'
import BasicLayout from '../../layout/BasicLayout'
import { Outlet, useNavigate } from 'react-router-dom'
import '../../css/public/public.css'

const UserPage = () => {
    const navigate = useNavigate()
    const [checkedUno, setCheckedUno] = useState([])

    const handleClickList = useCallback(() => { navigate({ pathname: 'list' }) })
    const handleClickAdd = useCallback(() => { navigate({ pathname: 'add' }) })
    const handleClickApprovalList = useCallback(() => { navigate({ pathname: 'approval' }) })

    return (
        <BasicLayout>
            {/* <ul className='topMenu'>
                <li>
                    <button className='topMenuBtn' onClick={handleClickList}>
                        입주민 목록
                    </button>
                </li>
                <li>
                    <button className='topMenuBtn' onClick={handleClickApprovalList}>
                        가입 승인
                    </button>
                </li>
                <li>
                    <button className='topMenuBtn' onClick={handleClickAdd}>
                        입주민 등록
                    </button>
                </li>
            </ul> */}
            <div className='userBackground'>
                <Outlet context={{ checkedUno, setCheckedUno }} />
            </div>
        </BasicLayout>
    )
}

export default UserPage