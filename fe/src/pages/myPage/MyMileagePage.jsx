import React from 'react'
import { NavLink, Outlet } from 'react-router-dom';
import '../../css/mileageManagement/mileageMypage.css'

const MyMileagePage = () => {
  return (
    <div className='mileageMypage'>
      <h1 className='mileageName'>마일리지 사용 </h1>
      <p>아래 탭에서 마일리지 사용 및 구매 내역을 확인하세요.</p>
      <nav className='mileageLinkNav'>
        <NavLink to="usage">마일리지 사용 내역</NavLink>
        <NavLink to="purchase">나의 구매 내역</NavLink>
      </nav>
      <Outlet />
    </div>
  )
}

export default MyMileagePage