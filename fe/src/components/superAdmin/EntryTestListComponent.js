import React, { useEffect, useState } from 'react'
import useCustom from '../hook/useCustom'
import { useLocation, useNavigate } from 'react-router-dom'
import PageComponent from '../common/PageComponent'
import useCustomLogin from '../hook/useCustomLogin'
import { entryGetList } from '../api/parking/entryApi'
import '../../css/public/public.css'

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

const EntryTestListComponent = ({ pageServerData, searchData, checkedEeno, setCheckedEeno }) => {
    const [serverData, setServerData] = useState(initState)
    const { page, size } = useCustom()
    const { exceptionHandler } = useCustomLogin()
    const location = useLocation()
    const navigate = useNavigate()

    const handleCheckChange = (eeno) => {
        setCheckedEeno(checkedItem => {
            if (checkedItem.includes(eeno)) {
                return checkedItem.filter(item => item !== eeno)
            } else {
                return [...checkedItem, eeno]
            }
        })
    }

    useEffect(() => {
        if (!pageServerData.dtoList || pageServerData.dtoList.length === 0) { // 검색 결과 유무 분기
            entryGetList({ page, size }).then(data => {
                if (data.error) {
                    exceptionHandler(data)
                } else {
                    setServerData(data)
                }
            })
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
            pathname: '/superAdmin/entryTest',
            search: `?${searchParams.toString()}`,
        })
    }

    return (
        <div className="tableRowContainer">
            <div className="entryListTable tableHeader">
                <div>삭제할 항목</div>
                <div>차량번호</div>
                <div>동</div>
                <div>호</div>
                <div>입차일</div>
                <div>출차일</div>
                <div>출차여부</div>
            </div>

            {/* Data Rendering */}
            {serverData.dtoList.map((entry, index) => (
                <label
                    key={index}
                    className={`entryListTable tableRow ${checkedEeno.includes(entry.eeno) ? "checked" : ""}`}
                    htmlFor={`checkbox-${entry.eeno}`}
                >
                    <input
                        type="checkbox"
                        id={`checkbox-${entry.eeno}`}
                        checked={checkedEeno.includes(entry.eeno)}
                        onChange={() => handleCheckChange(entry.eeno)}
                    />
                    <div>{entry.carNum}</div>
                    <div>{entry.dong && entry.dong}</div>
                    <div>{entry.ho && entry.ho}</div>
                    <div>{entry.entryDate}</div>
                    <div>{entry.exitDate}</div>
                    <div>{entry.exit ? '출차완료' : '미출차'}</div>
                </label>
            ))
            }
            <PageComponent serverData={serverData} movePage={movePage} />
        </div >
    )
}

export default EntryTestListComponent