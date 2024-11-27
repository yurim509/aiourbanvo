import React, { useEffect, useState } from 'react'
import useCustom from '../hook/useCustom'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import PageComponent from '../common/PageComponent'
import useCustomLogin from '../hook/useCustomLogin'
import { entryGetList, entryGetUserList } from '../api/parking/entryApi'

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

const EntryListComponent = ({ pageServerData, searchData }) => {
  const [serverData, setServerData] = useState(initState)
  const { page, size } = useCustom()
  const { exceptionHandler, loadLoginData } = useCustomLogin()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const loginUser = {
      dong: loadLoginData().dong,
      ho: loadLoginData().ho,
    }
    if (!pageServerData.dtoList || pageServerData.dtoList.length === 0) { // 검색 결과 유무 분기
      if (loadLoginData().role === 'ADMIN' || loadLoginData().role === 'ROOT') { // 권한 분기
        console.log(loadLoginData().role)
        entryGetList({ page, size }).then(data => {
          if (data.error) {
            exceptionHandler(data)
          } else {
            setServerData(data)
          }
        })
      } else {
        console.log(loadLoginData().role)
        entryGetUserList({ page, size }, loginUser).then(data => {
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
    if (searchData.entryExitDateStart) {
      searchParams.set('entryExitDateStart', searchData.entryExitDateStart)
    }
    if (searchData.entryExitDateEnd) {
      searchParams.set('entryExitDateEnd', searchData.entryExitDateEnd)
    }

    navigate({
      pathname: '/parking/entry',
      search: `?${searchParams.toString()}`,
    })
  }

  return (
    <div className="tableRowContainer">
      <div className="parkingEntryTable tableHeader">
        <div>No</div>
        <div>차량번호</div>
        <div>동</div>
        <div>호</div>
        <div>입차일</div>
        <div>출차일</div>
        <div>출차여부</div>
      </div>

      {/* Data Rendering */}
      {serverData.dtoList.map((entry, index) => (
        <div key={index} className='parkingEntryTable tableRow'>
          <div>
            <input
              type='checkbox'
              disabled
            />
          </div>
          <div>{entry.carNum}</div>
          <div>{entry.dong && entry.dong}</div>
          <div>{entry.ho && entry.ho}</div>
          <div>{entry.entryDate}</div>
          <div>{entry.exitDate}</div>
          <div>{entry.exit ? '출차완료' : '미출차'}</div>
        </div>
      ))}
      <PageComponent serverData={serverData} movePage={movePage} />
    </div>
  )
}

export default EntryListComponent