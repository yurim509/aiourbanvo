import React, { useCallback, useState } from 'react'
import BasicLayout from '../../layout/BasicLayout'
import { Outlet, useNavigate } from 'react-router-dom'
import '../../css/public/public.css'

const SuperAdminPage = () => {
    const navigate = useNavigate()
    const [checkedUno, setCheckedUno] = useState([])

    const handleClickUserManage = useCallback(() => { navigate({ pathname: 'userManage' }) })
    const handleClickEntryTest = useCallback(() => { navigate({ pathname: 'entryTest' }) })

    return (
        <BasicLayout>
            <div className='superAdminBackground'>
                <ul className='topMenu'>
                    <li>
                        <button className='topMenuBtn' onClick={handleClickUserManage}>
                            유저 관리
                        </button>
                    </li>
                    <li>
                        <button className='topMenuBtn' onClick={handleClickEntryTest}>
                            입출차 테스트
                        </button>
                    </li>
                </ul>
                <Outlet context={{ checkedUno, setCheckedUno }} />
            </div>
        </BasicLayout>
    )
}

export default SuperAdminPage