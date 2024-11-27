import React, { useEffect, useState } from 'react'
import { myPageStudyReservations } from '../../api/facilities/studyApi';
import { handleCheckedCancel } from './StudyCancel';
import StudyDetailModifyModal from './StudyDetailModifyModal';

const StudyMyList = ({ uno, page, size }) => {
    const [checked, setChecked] = useState([])
    const [checkedReservationId, setCheckedReservationId] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); //모달 열림상태
    const [selectedReservationId, setSelectedReservationId] = useState(null); //선택된 예약 id
    
    const [studyReservations, setStudyReservations] = useState({
        dtoList: [],
        pageNumList: [],
        prev: false,
        next: false,
        totalCount: 0,
        current: 0
    });
    useEffect(() => {
        fetchStudyReservations();
    }, [uno, page, size]);
    const fetchStudyReservations = async () => {
        if (!uno) return;
        try {
            
            const golfData = await myPageStudyReservations(uno, page, size);
            setStudyReservations(golfData);
        } catch (err) {
            console.error('독서실 예약 정보를 가져오는 데 실패했습니다:', err);
        }
    };


    const handleCheckChange = (reservationId) => {
        setChecked((prevChecked) => {
            const isChecked = prevChecked.includes(reservationId);
            const updatedChecked = isChecked
                ? prevChecked.filter(item => item !== reservationId)
                : [...prevChecked, reservationId];
            setCheckedReservationId(updatedChecked);
            return updatedChecked;

        });
    };

    
    const handleModify = (reservationId) => {
        console.log("수정 버튼이 눌렸어요", reservationId)
        setSelectedReservationId(reservationId);
        setIsModalOpen(true);

    };
    const handleDelete = async () => {
        await handleCheckedCancel(checkedReservationId, fetchStudyReservations);
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">나의 독서실 예약 현황</h2>
            <div className="flex justify-between mb-4">
                <div>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                        선택 삭제
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-8 gap-4 font-semibold text-sm text-gray-700 bg-gray-100 p-2 rounded-lg">
                <div>NO</div>
                <div>날짜</div>
                <div>사용시작</div>
                <div>사용종료</div>
                <div>예약구역</div>
                <div>예약자</div>
                <div>예약 변경</div>
                <div>예약선택</div>
            </div>
            <div className="overflow-y-auto max-h-96">
                {studyReservations.dtoList.length > 0 ? (
                    studyReservations.dtoList.map((study) => (
                        <div key={study.reservationId} className="grid grid-cols-8 gap-4 items-center border-t py-4">
                            <div className="text-sm">{study.reservationId}</div>
                            <div className="text-sm">{study.date}</div>
                            <div className="text-sm">{study.startTime}</div>
                            <div className="text-sm">{study.endTime}</div>
                            <div className="text-sm">{study.seatNum}</div>
                            <div className="text-sm">{study.userName}</div>
                            <div>
                                <button
                                    onClick={() => handleModify(study.reservationId)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                >
                                    수정
                                </button>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    checked={checked.includes(study.reservationId)}
                                    onChange={() => handleCheckChange(study.reservationId)}
                                    className="w-5 h-5"
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 col-span-7">예약 정보가 없습니다.</div>
                )}
            </div>
              {/* 모달 렌더링 */}
              {isModalOpen && (
                    <StudyDetailModifyModal
                        reservationId={selectedReservationId}
                        closeModal={() => setIsModalOpen(false)}
                        refreshList={fetchStudyReservations}
                    />
                )}
        </div>
    )
}

export default StudyMyList