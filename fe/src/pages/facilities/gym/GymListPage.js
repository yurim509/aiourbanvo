import React, { useState } from 'react'
import GymList from '../../../components/facilities/gym/GymList'
import { Outlet, useSearchParams } from 'react-router-dom';

const GymListPage = () => {
    const [checkedProgramId, setCheckedProgramId] = useState([]);
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || 1 // URL 쿼리에서 page 가져오기
    const size = searchParams.get('size') || 10 // URL 쿼리에서 page 가져오기
    console.log(page, size)
    return (
        <>
            <GymList  page={page} size={size} />
            <Outlet context={{setCheckedProgramId}}/>
        </>
    )
}

export default GymListPage