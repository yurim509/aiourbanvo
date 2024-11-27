import React, { useCallback } from 'react';
import BasicLayout from '../../layout/BasicLayout';
import { Outlet, useNavigate } from 'react-router-dom';

const CommunityPage = () => {
    const navigate = useNavigate();
    const handleClickList = useCallback(() => { navigate({ pathname: 'board/list' }) });
    const handleClickCommunityAnnouncementPage = useCallback(() => { navigate({ pathname: 'announce/list' }) });
    const handleClickMarketPage = useCallback(() => { navigate({ pathname: 'market/list' }) });
    const handleClickLifeInfoPage = useCallback(() => { navigate({ pathname: 'info/jobs' }) });

    return (
        <BasicLayout>
            {/* <ul className='topMenu'>
                <button className='topMenuBtn' onClick={handleClickList}>
                    게시판
                </button>
                <button className='topMenuBtn' onClick={handleClickCommunityAnnouncementPage}>
                    공지사항
                </button>
                <button className='topMenuBtn' onClick={handleClickMarketPage}>
                    장터
                </button>
                <button className='topMenuBtn' onClick={handleClickLifeInfoPage}>
                    생활정보
                </button>
            </ul> */}
            <Outlet />
        </BasicLayout>
    );
};

export default CommunityPage;
