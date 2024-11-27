import React, { useEffect, useState } from 'react'
import useCustom from '../hook/useCustom'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import PageComponent from '../common/PageComponent'
import useCustomLogin from '../hook/useCustomLogin'
import { visitGetList, visitGetUserList } from '../api/parking/visitApi'

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0
}

const VisitListComponent = ({ pageServerData, searchData }) => {
  const [serverData, setServerData] = useState(initState)
  const { page, size } = useCustom()
  const [checked, setChecked] = useState([])
  const { setCheckedVpno } = useOutletContext() // 부모에게서 전달된 함수
  const { exceptionHandler, loadLoginData } = useCustomLogin()
  const location = useLocation()
  const navigate = useNavigate()

  const handleCheckChange = (vpno) => {
    console.log(serverData)
    setChecked(checkedItem => {
      if (checkedItem.includes(vpno)) {
        return checkedItem.filter(item => item !== vpno)
      } else {
        return [...checkedItem, vpno]
      }
    })
  }

  // 체크된 항목이 변경 시 부모에 [vpno] 전달 / 부모 업데이트
  useEffect(() => {
    if (checked.length > 0) {
      setCheckedVpno(checked)
      console.log('checked:' + checked)
    } else {
      setCheckedVpno([])
    }
  }, [checked, setCheckedVpno])

  useEffect(() => {
    const loginUser = {
      dong: loadLoginData().dong,
      ho: loadLoginData().ho,
    }
    if (!pageServerData.dtoList || pageServerData.dtoList.length === 0) { // 검색 결과 유무 분기
      if (loadLoginData().role === 'ADMIN' || loadLoginData().role === 'ROOT') { // 권한 분기
        console.log(loadLoginData().role)
        visitGetList({ page, size }).then(data => {
          if (data.error) {
            exceptionHandler(data)
          } else {
            setServerData(data)
          }
        })
      } else {
        console.log(loadLoginData().role)
        visitGetUserList({ page, size }, loginUser).then(data => {
          if (data.error) {
            exceptionHandler(data)
          } else {
            setServerData(data)
          }
        })
      }
    } else {
      setServerData(pageServerData)
    }
  }, [page, size, pageServerData])

  const movePage = (pageParam) => {
    const searchParams = new URLSearchParams(location.search)

    searchParams.set('page', pageParam.page)

    if (searchData.searchCategory) {
      searchParams.set('searchCategory', searchData.searchCategory)
    }
    if (searchData.searchValue) {
      searchParams.set('searchValue', searchData.searchValue)
    }
    if (searchData.expectedDateStart) {
      searchParams.set('expectedDateStart', searchData.expectedDateStart)
    }
    if (searchData.expectedDateEnd) {
      searchParams.set('expectedDateEnd', searchData.expectedDateEnd)
    }

    navigate({
      pathname: '/parking/visit',
      search: `?${searchParams.toString()}`,
    })
  }

  return (
    <div className='tableRowContainer'>
      <div className='parkingRVTable tableHeader'>
        <div>No</div>
        <div>차량번호</div>
        <div>이름</div>
        <div>동</div>
        <div>호</div>
        <div>전화번호</div>
        <div>입차 예정 날짜</div>
      </div>

      {/* Data Rendering */}
      {serverData.dtoList.map((visit, index) => (
        <label
          key={index}
          className={`parkingRVTable tableRow ${checked.includes(visit.vpno) ? "checked" : ""}`}
          htmlFor={`checkbox-${visit.vpno}`}
        >
          <input
            type='checkbox'
            id={`checkbox-${visit.vpno}`}
            checked={checked.includes(visit.vpno)} // 페이지 이동 시 체크항목 유지
            onChange={() => handleCheckChange(visit.vpno)}
          />
          <div>{visit.carNum}</div>
          <div>{visit.name}</div>
          <div>{visit.household && visit.household.householdPK.dong}</div>
          <div>{visit.household && visit.household.householdPK.ho}</div>
          <div>{visit.phone}</div>
          <div>{visit.expectedDate}</div>
        </label>
      ))
      }
      <PageComponent serverData={serverData} movePage={movePage} />
    </div >
  )
}

export default VisitListComponent