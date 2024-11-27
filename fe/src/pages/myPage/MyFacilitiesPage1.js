import React, { useCallback } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const MyFacilitiesPage = () => {
  const navigate = useNavigate();
  const handleClickGym = useCallback(() => {
      navigate('/myPage/facilities/gym');
  }, [navigate]);
    const handleClickGolf = useCallback(() => {
      navigate(`/myPage/facilities/golf`);
  }, [navigate]);
  const handleClickStudy = useCallback(() => {
      navigate('/myPage/facilities/study');
  }, [navigate]);

  return (
    <div>
      
        <ul className='flex justify-center space-x-8'>
            <li>
                <button className="button" onClick={handleClickGolf}>골프 예약 조회</button>
            </li>
            <li>
                <button className="button" onClick={handleClickStudy}>스터디룸 예약 조회 </button>
            </li>
            <li>
                <button className="button" onClick={handleClickGym}>헬스장 신청&이용권 조회</button>
            </li>
        
          </ul>
          
      
        <Outlet/>
    </div>
)
}

export default MyFacilitiesPage