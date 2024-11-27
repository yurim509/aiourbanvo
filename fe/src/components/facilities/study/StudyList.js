import React, { useEffect, useState } from 'react';
import { cancelStudy, listStudy } from '../../api/facilities/studyApi';
import useCustom from '../../hook/useCustom';
import PageComponent from '../../common/PageComponent';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import StudyCancel, { handleCheckedCancel } from './StudyCancel';
import StudyDetailModifyModal from './StudyDetailModifyModal';

const initState = {
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: null,
    prev: false,
    next: false,
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 0
}



const StudyList = ({ page, size }) => {
    // console.log(page, size)
    const [uno, setUno] = useState(); // 로그인한 사용자 uno
    const [userName, setUserName] = useState(); // 로그인한 사용자 name
    const [phone, setPhone] = useState(); // 로그인한 사용자 phone
    const navigate = useNavigate();
    const [checkedReservationId, setCheckedReservationId] = useState([]);
    const [serverData, setServerData] = useState(initState)
    const { moveToList } = useCustom()
    const [checked, setChecked] = useState([])

    //로그인에 따라 다르게 보여주는 속성으로 인한 권한 변수선언
    const role = localStorage.getItem("role")

    //모달 상태 및 선택된 예약 id관리
    const [isModalOpen, setIsModalOpen] = useState(false); //모달 열림상태
    const [selectedReservationId, setSelectedReservationId] = useState(null); //선택된 예약 id



    useEffect(() => {
        const getUno = localStorage.getItem('uno');
        const getUserName = localStorage.getItem('userName');
        const getPhone = localStorage.getItem('phone');

        if (getUno) setUno(Number(getUno));
        if (getUserName) setUserName(getUserName);
        if (getPhone) setPhone(getPhone);
        if (!getUno && !getUserName && !getPhone) console.log("로그인 정보가 없습니다.");

    }, [])

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


    const fetchStudyReservations = async () => {
        try {
            const data = await listStudy({ page, size });
            if (data.error) {
                throw new Error(data.error);
            }
            console.log("Fetched data:", data);
            setServerData(data);
        } catch (err) {
            console.error("데이터를 가져오는데 오류가 발생했습니다 => ", err);
            alert("예약 정보를 가져오는 데 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    };


    useEffect(() => {
        console.log(page, size)
        fetchStudyReservations();
    }, [page, size]);

    //수정로직구현하기
    const handleModify = (reservationId) => {
        console.log("수정 버튼이 눌렸어요", reservationId)
        setSelectedReservationId(reservationId);
        setIsModalOpen(true);

    };
    const handleDelete = async () => {
        await handleCheckedCancel(checkedReservationId, fetchStudyReservations);
    }



    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">독서실 예약 현황</h2>
            <div className="flex justify-between mb-4">
                {role === 'ADMIN' && (
                    <div>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                            선택 삭제
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-9 gap-4 font-semibold text-sm text-gray-700 bg-gray-100 p-2 rounded-lg">
                <div>예약번호</div>
                <div>날짜</div>
                <div>사용시작</div>
                <div>사용종료</div>
                <div>예약구역</div>
                <div>예약자</div>
                <div>연락처</div>
                {role === 'ADMIN' && <div>예약 변경</div>}
                {role === 'ADMIN' && <div>선택</div>}
            </div>

            {serverData.dtoList && serverData.dtoList.length > 0 ? (
                serverData.dtoList.map((study) => (
                    <div key={study.reservationId} className="grid grid-cols-9 gap-4 items-center border-t py-4">
                        <div className="text-sm">{study.reservationId}</div>
                        <div className="text-sm">{study.date}</div>
                        <div className="text-sm">{study.startTime}</div>
                        <div className="text-sm">{study.endTime}</div>
                        <div className="text-sm">{study.seatNum}</div>
                        <div className="text-sm">{study.userName}</div> {/* userName 값을 확인 */}
                        <div className="text-sm">{study.phone}</div> {/* phone 값을 확인 */}
                        <div>
                            {role === 'ADMIN' && (
                                <button
                                    onClick={() => handleModify(study.reservationId)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                >
                                    수정
                                </button>
                            )}
                        </div>
                        <div>
                            {role === 'ADMIN' && (
                                <input
                                    type="checkbox"
                                    checked={checked.includes(study.reservationId)}
                                    onChange={() => handleCheckChange(study.reservationId)}
                                    className="w-5 h-5"
                                />
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500 col-span-9">정보없음</div>
            )}

            {serverData && serverData.dtoList && serverData.dtoList.length > 0 && (
                <PageComponent
                    serverData={serverData}
                    movePage={(pageParam) => moveToList(pageParam, '/facilities/study/list')}
                />
            )}

            {/* 모달 렌더링 */}
            {isModalOpen && (
                <StudyDetailModifyModal
                    reservationId={selectedReservationId}
                    closeModal={() => setIsModalOpen(false)}
                    refreshList={fetchStudyReservations}
                />
            )}
        </div>

    );
};

export default StudyList;