// import GolfList from '../../components/facilities/golf/GolfList'

import { useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const BoardPage = () => {
    const uno = 3;
    const navigate = useNavigate();
    const handleClickList = useCallback(() => {
        navigate('/communities/board/list');
    }, [navigate]);

    return (
        <div>
            

            {/* <ul className='flex justify-center space-x-8'>
                <li>
                    <button className="button" onClick={handleClickList}>자유 게시판</button>
                </li>
            </ul> */}
          
            <Outlet/>
        </div>
    )
}

export default BoardPage;