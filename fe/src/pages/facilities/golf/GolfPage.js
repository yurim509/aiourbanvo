// import GolfList from '../../components/facilities/golf/GolfList'

import { useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const GolfPage = () => {
    const navigate = useNavigate();
    const handleClickList = useCallback(() => {
        navigate('/facilities/golf/list');
    }, [navigate]);

    const handleClickReserve = useCallback(() => {
        navigate('/facilities/golf/reserve');
    }, [navigate]);

    const handleClickMyPage = useCallback(() => {
        navigate(`/myPage/facilities/golf`);
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
            <h1>Golf Facilities</h1>
            <Outlet/>
        </div>
    )
}

export default GolfPage;