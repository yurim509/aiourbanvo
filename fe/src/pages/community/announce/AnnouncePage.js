// import GolfList from '../../components/facilities/golf/GolfList'

import { useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const AnnouncePage = () => {
    const uno = 3;
    const navigate = useNavigate();
    const handleClickList = useCallback(() => {
        navigate('/communities/announce/list');
    }, [navigate]);

    return (
        <div>
{/* 

            <ul className='flex justify-center space-x-8'>
                <li>
                    <button className="button" onClick={handleClickList}>공지사항</button>
                </li>
            </ul> */}

            <Outlet />
        </div>
    )
}

export default AnnouncePage;