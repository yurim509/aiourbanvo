import React, { useState } from 'react'
import GymProgramDetail from '../../../components/facilities/gym/GymProgramDetail'
import { useParams, useSearchParams } from 'react-router-dom'

const GymProgramDetailPage = () => {
    const [searchParams] = useSearchParams();// useSearchParams 훅 사용
    const page = searchParams.get('page'); // URL 쿼리에서 page 가져오기
    const size = searchParams.get('size'); // URL 쿼리에서 size 가져오기
    // const gym = location.state?.gym;
    // console.log(page, size); // 확인용

    return (
        <div><GymProgramDetail page={page} size={size} /></div>
    )
}

export default GymProgramDetailPage