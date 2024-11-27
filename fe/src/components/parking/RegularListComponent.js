import React, { useEffect, useState } from 'react'
import useCustom from '../hook/useCustom'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import PageComponent from '../common/PageComponent'
import useCustomLogin from '../hook/useCustomLogin'
import { regularGetList, regularGetUserList } from '../api/parking/regularApi'
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

const RegularListComponent = ({ pageServerData, searchData }) => {
    const [serverData, setServerData] = useState(initState)
    const { page, size } = useCustom()
    const [checked, setChecked] = useState([])
    const { setCheckedRpno } = useOutletContext() // 부모에게서 전달된 함수
    const { exceptionHandler, loadLoginData } = useCustomLogin()
    const location = useLocation()
    const navigate = useNavigate()

    const handleCheckChange = (rpno) => {
        console.log(serverData)
        setChecked(checkedItem => {
            if (checkedItem.includes(rpno)) {
                return checkedItem.filter(item => item !== rpno)
            } else {
                return [...checkedItem, rpno];
            }
        })
    }

    // 체크된 항목이 변경 시 부모에 [rpno] 전달 / 부모 업데이트
    useEffect(() => {
        if (checked.length > 0) {
            setCheckedRpno(checked);
            console.log("checked:" + checked)
        } else {
            setCheckedRpno([]);
        }
    }, [checked, setCheckedRpno]);

    useEffect(() => {
        const loginUser = {
            dong: loadLoginData().dong,
            ho: loadLoginData().ho,
        }
        if (!pageServerData.dtoList || pageServerData.dtoList.length === 0) { // 검색 결과 유무 분기
            if (loadLoginData().role === 'ADMIN' || loadLoginData().role === 'ROOT') { // 권한 분기
                console.log(loadLoginData().role)
                regularGetList({ page, size }).then(data => {
                    if (data.error) {
                        exceptionHandler(data)
                    } else {
                        setServerData(data)
                    }
                })
            } else {
                console.log(loadLoginData().role)
                regularGetUserList({ page, size }, loginUser).then(data => {
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
        if (searchData.regDateStart) {
            searchParams.set('regDateStart', searchData.regDateStart)
        }
        if (searchData.regDateEnd) {
            searchParams.set('regDateEnd', searchData.regDateEnd)
        }

        navigate({
            pathname: '/parking/regular',
            search: `?${searchParams.toString()}`,
        })
    }
    return (
        <div className="tableRowContainer">
            <div className="parkingRVTable tableHeader">
                <div>No</div>
                <div>차량번호</div>
                <div>이름</div>
                <div>동</div>
                <div>호</div>
                <div>전화번호</div>
                <div>등록 일자</div>
            </div>

            {/* Data Rendering */}
            {serverData.dtoList.map((regular, index) => (
                <label
                    key={index}
                    className={`parkingRVTable tableRow ${checked.includes(regular.rpno) ? "checked" : ""}`}
                    htmlFor={`checkbox-${regular.rpno}`}
                >
                    <input
                        type="checkbox"
                        id={`checkbox-${regular.rpno}`}
                        checked={checked.includes(regular.rpno)}
                        onChange={() => handleCheckChange(regular.rpno)}
                    />
                    <div>{regular.carNum}</div>
                    <div>{regular.name}</div>
                    <div>{regular.household && regular.household.householdPK.dong}</div>
                    <div>{regular.household && regular.household.householdPK.ho}</div>
                    <div>{regular.phone}</div>
                    <div>{regular.regDate}</div>
                </label>
            ))}
            <PageComponent serverData={serverData} movePage={movePage} />
        </div>
    );
}

export default RegularListComponent