import React, { useEffect, useState } from 'react'
import PageComponent from '../../common/PageComponent';
import useMyReservations from '../../hook/facilities/useMyReservations';

const StudyMyReservationList = ({ studyReservations }) => {
    // const [uno, setUno] = useState(); // 로그인한 사용자 uno
    // const { studyReservations } = useMyReservations(uno, page, size);

    // // uno 초기화
    // useEffect(() => {
    //     const storedUno = localStorage.getItem('uno');
    //     if (storedUno) {
    //         setUno(Number(storedUno));
    //     } else {
    //         console.error('로그인 정보가 없습니다.');
    //     }
    // }, []);

    const movePage = (pageParam) => {
        console.log(`페이지 이동: ${pageParam}`);
        // 페이지 이동 로직 구현
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">나의 독서실 예약 현황</h2>

            <div className="grid grid-cols-7 gap-4 font-semibold text-sm text-gray-700 bg-gray-100 p-2 rounded-lg">
                <div>예약번호</div>
                <div>날짜</div>
                <div>사용시작</div>
                <div>사용종료</div>
                <div>예약구역</div>
                <div>예약자</div>
                <div>연락처</div>
            </div>

            {/* {studyReservations.dtoList && studyReservations.dtoList.length > 0 ? (
          studyReservations.dtoList.map((study) => ( */}

            {studyReservations && studyReservations.length > 0 ? (
                studyReservations.map((study) => (
                    <div key={study.reservationId} className="grid grid-cols-7 gap-4 items-center border-t py-4">
                        <div className="text-sm">{study.reservationId}</div>
                        <div className="text-sm">{study.date}</div>
                        <div className="text-sm">{study.startTime}</div>
                        <div className="text-sm">{study.endTime}</div>
                        <div className="text-sm">{study.seatNum}</div>
                        <div className="text-sm">{study.userName}</div>
                        <div className="text-sm">{study.phone}</div>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500 col-span-7">예약 정보가 없습니다.</div>
            )}
            {studyReservations && studyReservations.length > 0 && (
                <PageComponent serverData={studyReservations} movePage={movePage} />
            )}
        </div>
    );
};


export default StudyMyReservationList