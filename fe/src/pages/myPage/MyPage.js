import React, { useCallback, useState } from 'react'
import BasicLayout from '../../layout/BasicLayout'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import '../../css/_modules/myPage.css'

const MyPage = () => {
    const navigate = useNavigate()
    const [checkedRpno, setCheckedRpno] = useState([])
    const [checkedVpno, setCheckedVpno] = useState([])

    const handleClickRegularList = useCallback(() => { navigate({ pathname: 'myInfo' }) })
    const handleClickVisitList = useCallback(() => { navigate({ pathname: 'mileage' }) })
    const handleClickEEList = useCallback(() => { navigate({ pathname: 'facilities' }) })

    return (
        <BasicLayout>
        <div className="myPageContainer">
            <nav className="sidebarMenu">
                <ul className="sidebarList">
                    <li>
                        <NavLink 
                            to="myInfo" 
                            className="sidebarButton" 
                            activeClassName="active"
                        >
                            내정보
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="mileage" 
                            className="sidebarButton" 
                            activeClassName="active"
                        >
                            마일리지
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="facilities" 
                            className="sidebarButton" 
                            activeClassName="active"
                        >
                            예약현황
                        </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="communities"
                                className="sidebarButton"
                                activeClassName="active"
                            >
                                내가 쓸 글
                            </NavLink>
                        </li>
                </ul>
            </nav>
            <div className="contentArea">
                <Outlet />
            </div>
        </div>
    </BasicLayout>
    )
}

export default MyPage