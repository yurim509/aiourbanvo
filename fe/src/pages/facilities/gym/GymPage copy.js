// import GymList from '../../components/facilities/gym/GymList'

import { useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const GymPage = () => {
    const role = localStorage.getItem("role")

    const navigate = useNavigate();
    const handleClickList = useCallback(() => {
        navigate('/facilities/gym/list');
    }, [navigate]);
    const handleClickReserve = useCallback(() => {
        navigate('/facilities/gym/membership');
    }, [navigate]);
    const handleClickMyPage = useCallback((uno) => {
        navigate(`/myPage/facilities/gym`);
    }, [navigate]);
    const handleClickCreate = useCallback(() => {
        navigate('/facilities/gym/membership/create');
    }, [navigate]);
 


    return (
        <div>


            <ul className='flex justify-center space-x-8'>

                <li>
                    <button className="button" onClick={handleClickList}>프로그램</button>
                </li>
                <li>
                    <button className="button" onClick={handleClickReserve}>이용권 구매 </button>
                </li>
                <li>
                    <button className="button" onClick={handleClickMyPage}>나의신청내역 </button>
                </li>
                {role === "ADMIN" &&
                    <li>
                        <button className="button" onClick={handleClickCreate}> 이용권 등록 </button>
                    </li>
                }
             

            </ul>
            <h1>Gym Facilities</h1>
            <Outlet />
        </div>
    )
}

export default GymPage;