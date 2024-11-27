import React, { useEffect, useState } from 'react'
import GolfList from '../../../components/facilities/golf/GolfList'
import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom';

const GolfListPage = () => {
  const [checkedReservationId, setCheckedReservationId] = useState([]);
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || 1 // URL 쿼리에서 page 가져오기
  const size = searchParams.get('size') || 10// URL 쿼리에서 size 가져오기
  console.log("GolfListPage:", page, size)
 
  return (
    <>
      <GolfList setCheckedReservationId={setCheckedReservationId} page={page} size={size} />
      <Outlet context={{ setCheckedReservationId }} />
    </>

  )
}

export default GolfListPage