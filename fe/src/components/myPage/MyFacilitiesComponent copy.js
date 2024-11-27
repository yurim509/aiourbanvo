import React, { useState, useEffect, useCallback } from 'react';
import GolfMyList from '../facilities/golf/GolfMyList';
import StudyMyList from '../facilities/study/StudyMyList';
import GymMyList from '../facilities/gym/GymMyList';
import { Outlet, useNavigate } from 'react-router-dom';

const MyFacilitiesComponent = () => {
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


  // useEffect(() => {
  //   const storedUno = localStorage.getItem('uno');
  //   if (storedUno) setUno(Number(storedUno));
  // }, []);

  // const handleTabChange = (tabName) => {
  //   setSelectedTab(tabName); // 선택된 탭 변경
  //   setPage(1); // 탭이 변경될 때 페이지 초기화
  // };

  return (
    <div className="p-6">
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
     
          {/* 선택된 탭에 따라 렌더링 */}
          {/* {selectedTab === 'golf' && <GolfMyList uno={uno} page={page} size={size} />}
          {selectedTab === 'study' && <StudyMyList uno={uno} page={page} size={size} />}
          {selectedTab === 'gym' && <GymMyList uno={uno} />}
       */}
        <Outlet/>
    </div>
  );
};

export default MyFacilitiesComponent;
