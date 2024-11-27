// import StudyList from '../../components/facilities/study/StudyList'

import { useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const StudyPage = () => {
    const navigate = useNavigate();
    const handleClickList = useCallback(() => {
        navigate('/facilities/study/list');
    }, [navigate]);
    const handleClickReserve = useCallback(() => {
        navigate('/facilities/study/reserve');
    }, [navigate]);
    const handleClickMyPage = useCallback(() => {
        navigate('/myPage/facilities/study');
    }, [navigate]); //나중에 마이페이지 구현후 링크 연동 



    return (
        <div>
            

            <ul className='flex justify-center space-x-8'>
                <li>
                    <button className="button" onClick={handleClickList}>예약현황</button>
                </li>
                <li>
                    <button className="button" onClick={handleClickReserve}>예약 등록 </button>
                </li>
                <li>
                    <button className="button" onClick={handleClickMyPage}>나의예약</button>
                </li>
            
            </ul>
            <h1>Study Facilities</h1>
            <Outlet/>
        </div>
    )
}

export default StudyPage;