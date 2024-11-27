import React, { useCallback, useState } from 'react'
import BasicLayout from '../../layout/BasicLayout'
import { Outlet, useNavigate } from 'react-router-dom'
import '../../css/public/public.css'

const ParkingPage = () => {
    const navigate = useNavigate()
    const [checkedRpno, setCheckedRpno] = useState([])
    const [checkedVpno, setCheckedVpno] = useState([])

    const handleClickRegularList = useCallback(() => { navigate({ pathname: 'regular' }) })
    const handleClickVisitList = useCallback(() => { navigate({ pathname: 'visit' }) })
    const handleClickEEList = useCallback(() => { navigate({ pathname: 'entry' }) })

    return (
        <BasicLayout>
            {/* <ul className='topMenu flex justify-center'>
                <li>
                    <button className='topMenuBtn' onClick={handleClickRegularList}>
                        정기권 차량
                    </button>
                </li>
                <li>
                    <button className='topMenuBtn' onClick={handleClickVisitList}>
                        방문 예약 차량
                    </button>
                </li>
                <li>
                    <button className='topMenuBtn' onClick={handleClickEEList}>
                        입출차 기록
                    </button>
                </li>
            </ul> */}
            <div className='parkingBackground'>
                <Outlet context={{ checkedRpno, setCheckedRpno, checkedVpno, setCheckedVpno }} />
            </div>
        </BasicLayout>
    )
}

export default ParkingPage