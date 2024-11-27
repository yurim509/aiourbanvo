import React, { useEffect, useState } from 'react'
import StudyList from '../../../components/facilities/study/StudyList'
import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom';

const StudyListPage = () => {
  const [checkedReservationId, setCheckedReservationId] = useState([]);
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || 1 // URL 쿼리에서 page 가져오기
  const size = searchParams.get('size') || 10// URL 쿼리에서 size 가져오기
  console.log("StudyListPage:", page, size)
  // useEffect(() => {
  //   if (loadLoginData().role !== 'ADMIN' && loadLoginData().role !== 'ROOT') {
  //     alert('권한이 없습니다')
  //     navigate({ pathname: '../login' })
  //   }
  // }, [loadLoginData, navigate]) 

  //권한 설정은 나중에 아예메뉴 접근을 막아버리는것도 좋은 방법일듯함

  return (
    <>
      <StudyList setCheckedReservationId={setCheckedReservationId} page={page} size={size} />

      <Outlet context={{ setCheckedReservationId }} />
    </>

  )
}

export default StudyListPage