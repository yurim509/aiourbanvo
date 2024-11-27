// import GolfList from '../../components/facilities/golf/GolfList'

import { useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const InfoPage = () => {
    const uno = 3;
    const navigate = useNavigate();
    const handleClickList = useCallback(() => {
        navigate('/communities/info/jobs');
    }, [navigate]);



    return (
        <div>
            
{/* 
            <ul className='flex justify-center space-x-8'>
                <li>
                    <button className="button" onClick={handleClickList}>동네 알바 </button>
                </li>
            </ul>
           */}
            <Outlet/>
        </div>
    )
}

export default InfoPage;