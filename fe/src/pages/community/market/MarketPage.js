// import GolfList from '../../components/facilities/golf/GolfList'

import { useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const MarketPage = () => {
    const uno = 3;
    const navigate = useNavigate();
    const handleClickList = useCallback(() => {
        navigate('/communities/market/list');
    }, [navigate]);



    return (
        <div>
            
{/* 
            <ul className='flex justify-center space-x-8'>
                <li>
                    <button className="button" onClick={handleClickList}>거래소</button>
                </li>
            </ul> */}
          
            <Outlet/>
        </div>
    )
}

export default MarketPage;