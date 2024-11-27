import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import useCustomLogin from '../hook/useCustomLogin'
import PageComponent from '../common/PageComponent'
import { superAdminGetAllList } from '../api/superAdmin/superAdminApi'
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

const UserManageComponent = ({ pageServerData, searchData }) => {
  const [serverData, setServerData] = useState(initState)
  const { page, size } = useCustomLogin()
  const [checked, setChecked] = useState([])
  const { setCheckedUno } = useOutletContext() // 부모에게서 전달된 함수
  const { exceptionHandler, loadLoginData } = useCustomLogin()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!pageServerData.dtoList || pageServerData.dtoList.length === 0) {
      try {
        if (loadLoginData().role !== 'ADMIN' && loadLoginData().role !== 'ROOT') {
          throw new Error('Access Error')
        } else {
          superAdminGetAllList({ page, size }).then(data => {
            if (data.error) {
              exceptionHandler(data)
            } else {
              setServerData(data)
              console.log(data)
            }
          })
        }
      } catch (error) {
        console.error(error);
        alert('권한이 없습니다')
        navigate({ pathname: '/login' })
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

    navigate({
      pathname: '/superAdmin/userManage/',
      search: `?${searchParams.toString()}`,
    })
  }
  const handleCheckChange = (uno) => {
    setChecked(checkedItem => {
      if (checkedItem.includes(uno)) {
        return checkedItem.filter(item => item !== uno)
      } else {
        return [...checkedItem, uno]
      }
    })
  }

  // 체크된 항목이 변경 시 부모에 [uno] 전달 / 부모(UserPage) 업데이트
  useEffect(() => {
    if (checked.length > 0) {
      setCheckedUno(checked)
      console.log("checked:" + checked)
    } else {
      setCheckedUno([])
    }
  }, [checked, setCheckedUno])

  return (
    <div className="tableRowContainer">
      <div className="userManageTable tableHeader">
        <div>No</div>
        <div>동</div>
        <div>호</div>
        <div>이름</div>
        <div>전화번호</div>
        <div>권한</div>
      </div>

      {/* 유저 데이터를 map으로 렌더링 */}
      {serverData.dtoList.map((user, index) => (
        <label
          key={index}
          className={`userManageTable tableRow ${checked.includes(user.uno) ? "checked" : ""}`}
          htmlFor={`checkbox-${user.uno}`}
        >
          <input
            type='checkbox'
            id={`checkbox-${user.uno}`}
            checked={checked.includes(user.uno)} // 페이지 이동 시 체크항목 유지
            onChange={() => handleCheckChange(user.uno)}
          />
          <div>{user.dong}</div>
          <div>{user.ho}</div>
          <div>{user.userName}</div>
          <div>{user.phone}</div>
          <div>{user.userRoleList}</div>
        </label>
      ))}
      <PageComponent serverData={serverData} movePage={movePage} />
    </div>
  )
}

export default UserManageComponent