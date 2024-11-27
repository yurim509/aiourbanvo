import VisitListComponent from '../../components/parking/VisitListComponent'
import React, { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import useCustomLogin from '../../components/hook/useCustomLogin'
import { visitGetList, visitGetSearchList, visitParkingDeleteChecked } from '../../components/api/parking/visitApi'
import '../../css/public/public.css'

const initStateSearchData = {
  searchCategory: '',
  searchValue: '',
  expectedDateStart: '',
  expectedDateEnd: '',
}

const initStateServerData = {
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

const VisitPage = () => {
  const navigate = useNavigate()
  const { checkedVpno, setCheckedVpno } = useOutletContext() // 부모에게서 전달된 함수
  const { loadLoginData } = useCustomLogin()
  const [searchData, setSearchData] = useState(initStateSearchData)
  const [pageServerData, setPageServerData] = useState(initStateServerData)
  const [inputTitle, setInputTitle] = useState('검색 필터를 선택해주세요')
  const location = useLocation()


  const handleClickAdd = useCallback(() => { navigate({ pathname: 'add' }) })

  const handleClickModify = useCallback(() => {
    if (checkedVpno.length === 1) {
      navigate({ pathname: `modify/${checkedVpno[0]}` })  // 1개 체크 시
    } else if (checkedVpno.length > 1) {
      alert('하나만 선택해주세요') // 여러개 체크 시
    } else {
      alert('선택된 항목이 없습니다') // 미체크 시
    }
  }, [checkedVpno, navigate])

  const handleClickDelete = async () => {
    if (checkedVpno.length > 0) {
      await visitParkingDeleteChecked(checkedVpno)
      setPageServerData(initStateServerData) // 삭제 후 새로고침 기능 수행
      navigate('/parking/visit')
    } else {
      alert('선택된 항목이 없습니다')
      navigate('/parking/visit')
    }
  }

  // ------- 검색 -------
  // Category 변경 시 value 값 초기화
  const handleChangeSearchCategory = (e) => {
    // select option(category) title 가져와서 input(value) placeholder 에 설정
    setInputTitle(e.target.options[e.target.selectedIndex].getAttribute('title'))
    setSearchData(prevData => ({
      ...prevData,
      searchCategory: e.target.value,
      searchValue: '',
      expectedDateStart: '',
      expectedDateEnd: '',
    }))
  }

  // normal value onChange 설정
  const handleChangeSearchValue = (e) => {
    setSearchData((prev) => ({
      ...prev,
      searchValue: e.target.value,
    }))
  }

  // regDateStart/End onChange 설정
  const handleChangeSearchDate = (e) => {
    const { name, value } = e.target

    setSearchData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }


  const handleClickSearch = () => {
    // 검색 범위 예외처리
    if (searchData.searchCategory === 'expectedDate') {
      if (searchData.expectedDateStart === '' || searchData.expectedDateEnd === '') {
        alert('검색 범위가 잘못되었습니다')
        return
      }
      if (searchData.expectedDateStart > searchData.expectedDateEnd) {
        alert('검색 범위가 잘못되었습니다')
        return
      }
    }

    // queryParameter 생성
    const searchParams = new URLSearchParams()
    searchParams.set('page', 1)
    searchParams.set('size', 10)

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

    // queryParameter 경로 설정
    navigate(`/parking/visit?${searchParams.toString()}`)
  }

  useEffect(() => {
    // queryParameter 설정
    const queryParams = new URLSearchParams(location.search)
    const page = parseInt(queryParams.get('page')) || 1
    const size = parseInt(queryParams.get('size')) || 10

    const newSearchData = {
      searchCategory: queryParams.get('searchCategory') || '',
      searchValue: queryParams.get('searchValue') || '',
      expectedDateStart: queryParams.get('expectedDateStart') || '',
      expectedDateEnd: queryParams.get('expectedDateEnd') || '',
    }
    setSearchData(newSearchData)

    const pageParam = { page, size }

    if (newSearchData.searchCategory) {
      visitGetSearchList(pageParam, newSearchData).then(data => {
        setPageServerData(data)
        // 결과 예외 처리
        if (!data.dtoList || data.dtoList.length === 0) {
          alert('검색 결과가 없습니다')
        }
      })
    } else {
      setPageServerData(initStateServerData)
    }
  }, [location.search])


  const handleClickClear = () => {
    navigate({ pathname: '/parking/visit' })
    window.location.reload()
  }
  // --------------------
  return (
    <div>
      <ul className='topMenu'>
        <li>
          <button className='topMenuBtn' onClick={handleClickAdd}>
            등록
          </button>
        </li>
        <li>
          <button className='topMenuBtn' onClick={handleClickModify}>
            수정
          </button>
        </li>
        <li>
          <button className='topMenuBtn' onClick={handleClickDelete}>
            삭제
          </button>
        </li>
        {/* // ------- 검색 ------- */}
        <li>
          {loadLoginData().role !== 'ADMIN' && loadLoginData().role !== 'ROOT' ?
            <select className='inputBox'
              name='searchCategory'
              onChange={handleChangeSearchCategory}>
              <option value='' title='검색 필터를 선택해주세요'>검색 필터</option>
              <option value='name' title='예시) 김어반'>이름</option>
              <option value='carNum' title='예시) 00반0000'>차량번호</option>
              <option value='phone' title='예시) 01012345678'>전화번호</option>
              <option value='expectedDate'>입차 예정 날짜</option>
            </select>
            :
            <select className='inputBox'
              name='searchCategory'
              onChange={handleChangeSearchCategory}>
              <option value='' title='검색 필터를 선택해주세요'>검색 필터</option>
              <option value='dong-ho' title='예시) 101-101'>동-호</option>
              <option value='dong' title='예시) 101'>동</option>
              <option value='ho' title='예시) 101'>호</option>
              <option value='name' title='예시) 김어반'>이름</option>
              <option value='carNum' title='예시) 00반0000'>차량번호</option>
              <option value='phone' title='예시) 01012345678'>전화번호</option>
              <option value='expectedDate'>입차 예정 날짜</option>
            </select>
          }
        </li>
        {searchData.searchCategory === 'expectedDate' ?
          <li>
            <input className='inputBox'
              type='date'
              name='expectedDateStart'
              value={searchData.expectedDateStart}
              onChange={handleChangeSearchDate}
            />
            ~
            <input className='inputBox'
              type='date'
              name='expectedDateEnd'
              value={searchData.expectedDateEnd}
              onChange={handleChangeSearchDate}
            />
          </li>
          :
          <li>
            <input className='inputBox'
              name='searchValue'
              value={searchData.searchValue}
              placeholder={inputTitle}
              onChange={handleChangeSearchValue}
            />
          </li>
        }
        <li>
          <button className='topMenuBtn' onClick={handleClickSearch}>
            검색
          </button>
        </li>
        <li>
          <button className='topMenuBtn' onClick={handleClickClear}>
            검색 초기화
          </button>
        </li>
        {/* // -------------------- */}
      </ul>
      <VisitListComponent pageServerData={pageServerData} searchData={searchData} />
      <Outlet context={{ checkedVpno, setCheckedVpno }} />
    </div>
  )
}

export default VisitPage