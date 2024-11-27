import React, { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import useCustomLogin from '../../components/hook/useCustomLogin'
import { entryDeleteChecked, entryGetSearchList } from '../../components/api/parking/entryApi'
import EntryTestAddComponent from '../../components/superAdmin/EntryTestAddComponent'
import EntryTestListComponent from '../../components/superAdmin/EntryTestListComponent'
import '../../css/public/public.css'

const initStateSearchData = {
    searchCategory: '',
    searchValue: '',
    entryExitDateStart: '',
    entryExitDateEnd: '',
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

const EntryTestPage = () => {
    const navigate = useNavigate()
    const { loadLoginData } = useCustomLogin()
    const [checkedEeno, setCheckedEeno] = useState([])
    const [searchData, setSearchData] = useState(initStateSearchData)
    const [pageServerData, setPageServerData] = useState(initStateServerData)
    const [inputTitle, setInputTitle] = useState('검색 필터를 선택해주세요')
    const location = useLocation()

    const handleClickDelete = () => {
        entryDeleteChecked(checkedEeno).then(() => {
            alert('삭제가 완료되었습니다.')
            setCheckedEeno([])
            window.location.reload()
        })
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
            entryExitDateStart: '',
            entryExitDateEnd: '',
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
        if (searchData.searchCategory === 'entryDate' || searchData.searchCategory === 'exitDate') {
            if (searchData.entryExitDateStart === '' || searchData.entryExitDateEnd === '') {
                alert('검색 범위가 잘못되었습니다')
                return
            }
            if (searchData.entryExitDateStart > searchData.entryExitDateEnd) {
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
        if (searchData.entryExitDateStart) {
            searchParams.set('entryExitDateStart', searchData.entryExitDateStart)
        }
        if (searchData.entryExitDateEnd) {
            searchParams.set('entryExitDateEnd', searchData.entryExitDateEnd)
        }

        // queryParameter 경로 설정
        navigate(`/superAdmin/entryTest?${searchParams.toString()}`)
    }

    useEffect(() => {
        // queryParameter 설정
        const queryParams = new URLSearchParams(location.search)
        const page = parseInt(queryParams.get('page')) || 1
        const size = parseInt(queryParams.get('size')) || 10

        const newSearchData = {
            searchCategory: queryParams.get('searchCategory') || '',
            searchValue: queryParams.get('searchValue') || '',
            entryExitDateStart: queryParams.get('entryExitDateStart') || '',
            entryExitDateEnd: queryParams.get('entryExitDateEnd') || '',
        }
        setSearchData(newSearchData)

        const pageParam = { page, size }

        if (newSearchData.searchCategory) {
            entryGetSearchList(pageParam, newSearchData).then(data => {
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
        navigate({ pathname: '/superAdmin/entryTest' })
        window.location.reload()
    }
    // --------------------
    return (
        <div>
            <ul className='topMenu'>
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
                            <option value='carNum' title='예시) 00반0000'>차량번호</option>
                            <option value='isExit'>출차여부</option>
                            <option value='entryDate'>입차일</option>
                            <option value='exitDate'>출차일</option>
                        </select>
                        :
                        <select className='inputBox'
                            name='searchCategory'
                            onChange={handleChangeSearchCategory}>
                            <option value='' title='검색 필터를 선택해주세요'>검색 필터</option>
                            <option value='dong-ho' title='예시) 101-101'>동-호</option>
                            <option value='dong' title='예시) 101'>동</option>
                            <option value='ho' title='예시) 101'>호</option>
                            <option value='carNum' title='예시) 00반0000'>차량번호</option>
                            <option value='isExit'>출차여부</option>
                            <option value='entryDate'>입차일</option>
                            <option value='exitDate'>출차일</option>
                        </select>
                    }
                </li>
                {searchData.searchCategory === 'entryDate' ||
                    searchData.searchCategory === 'exitDate' ? (
                    <li>
                        <input className='inputBox'
                            type='date'
                            name='entryExitDateStart'
                            value={searchData.entryExitDateStart}
                            onChange={handleChangeSearchDate}
                        />
                        ~
                        <input className='inputBox'
                            type='date'
                            name='entryExitDateEnd'
                            value={searchData.entryExitDateEnd}
                            onChange={handleChangeSearchDate}
                        />
                    </li>
                ) :
                    searchData.searchCategory === 'isExit' ? (
                        <li>
                            <select className='inputBox'
                                name='isExit'
                                onChange={handleChangeSearchValue}>
                                <option value=''>--------</option>
                                <option value='entry'>미출차</option>
                                <option value='exit'>출차완료</option>
                            </select>
                        </li>
                    ) : (
                        <li>
                            <input className='inputBox'
                                name='searchValue'
                                value={searchData.searchValue}
                                placeholder={inputTitle}
                                onChange={handleChangeSearchValue}
                            />
                        </li>
                    )}
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
            <div>
                <EntryTestAddComponent />
                <EntryTestListComponent
                    pageServerData={pageServerData}
                    searchData={searchData}
                    checkedEeno={checkedEeno}
                    setCheckedEeno={setCheckedEeno} />
            </div>
        </div>
    )
}

export default EntryTestPage