import React, { useEffect, useState } from 'react'
import { addUserRole, deleteChecked, getApprovalList } from '../api/userApi'
import PageComponent from '../common/PageComponent'
import useCustomApproval from '../hook/useCustomApproval'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DoNotTouchIcon from '@mui/icons-material/DoNotTouch'
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

const UserApprovalComponent = () => {
    const [serverData, setServerData] = useState(initState)
    const { page, size, moveToList } = useCustomApproval()

    const handleClickAccess = (e) => {
        const uno = e.target.value
        addUserRole(uno)
        alert('승인 완료')
        getList()
    }

    const handleClickDenial = (e) => {
        const uno = [e.target.value]
        deleteChecked(uno)
        alert('거부 완료')
        getList()
    }

    // 승인, 거부 후 새로고침 기능 수행을 위해 함수로 정의
    const getList = () =>
        getApprovalList({ page, size }).then(data => {
            setServerData(data)
        }).catch(err => {
            console.error("Axios error", err)
        })

    useEffect(() => {
        getList()
    }, [page, size])

    return (
        <div className="tableRowContainer">
            <div className="approvalTable tableHeader">
                <div>동</div>
                <div>호</div>
                <div>이름</div>
                <div>전화번호</div>
                <div>가입 승인</div>
            </div>

            {/* 유저 데이터를 map으로 렌더링 */}
            {serverData.dtoList.map((user, index) => (
                <div key={index} className="approvalTable tableRow">
                    <div>{user.dong}</div>
                    <div>{user.ho}</div>
                    <div>{user.userName}</div>
                    <div>{user.phone}</div>
                    <div className="buttonGroup">
                        <button className='formButton add green h-4 '
                            value={user.uno}
                            onClick={handleClickAccess}
                        ><CheckCircleIcon /></button>
                        <button className='formButton cancel h-4'
                            value={user.uno}
                            onClick={handleClickDenial}
                        ><DoNotTouchIcon /></button>
                    </div>
                </div>
            ))}
            <PageComponent serverData={serverData} movePage={moveToList} />
        </div>
    );
}

export default UserApprovalComponent