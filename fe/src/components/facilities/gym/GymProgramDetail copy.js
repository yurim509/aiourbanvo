import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { applyForProgram, applyForWaitlist, cancelParticipant, cancelWaitlist, deletePost, fetchRegisteredUsers, fetchWaitlistUsers, getGymListByProgramId, getRegisteredUsersByProgramId } from '../../api/facilities/gymApi';
import useCustom from '../../hook/useCustom';
import PageComponent from '../../common/PageComponent';
import axios from 'axios';
import { createReducer } from '@reduxjs/toolkit';

const GymProgramDetail = () => {
    const [participants, setParticipants] = useState([]);
    const [waitlist, setWaitlist] = useState([]);// 대기자 유저 
    const [uno, setUno] = useState(); // 로그인한 사용자 uno
    const [userName, setUserName] = useState(); // 로그인한 사용자 name
    const [phone, setPhone] = useState(); // 로그인한 사용자 phone
    // const [registeredUsers, setRegisteredUsers] = useState([]);
    const [isParticipant, setIsParticipant] = useState(false); // 로그인한 사용자가 참가자인지 여부
    const [isWaitList, setIsWaitList] = useState(false); // 로그인한 사용자가 대기자인지 여부
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    console.log("searchParams", searchParams)
    // const { moveToList, page, size } = useCustom()
    const type = searchParams.get('type') || '';
    const keyword = searchParams.get('keyword') || '';
    const page = searchParams.get('page') || 1;
    const size = searchParams.get('size') || 10;
    // console.log('예약 수정asfda: ', page, size);
    const role = localStorage.getItem("role")
    const location = useLocation();
    const { gym } = location.state || { title: '', content: '', target: '', participantLimit: 0, programId: null, currentParticipants: 0, applicationStartDate: '', applicationEndDate: '', price: 0 };
    console.log("detail gym", gym)
    //   const token = localStorage.getItem("token")
    //     const uno = localStorage.getItem("uno")
    //     const role = localStorage.getItem("role")
    //     const dong = localStorage.getItem("dong")
    //     const ho = localStorage.getItem("ho")

    useEffect(() => {
        const getUno = localStorage.getItem('uno');
        const getUserName = localStorage.getItem('userName');
        const getPhone = localStorage.getItem('phone');
        console.log("로컬 스토리지에서 가져온 데이터:", { getUno, getUserName, getPhone }); // 추가: 로컬 스토리지 데이터 확인

        if (getUno) setUno(Number(getUno));
        if (getUserName) setUserName(getUserName);
        if (getPhone) setPhone(getPhone);
        if (!getUno && !getUserName && !getPhone) console.log("로그인 정보가 없습니다.");



    }, [])


    useEffect(() => {
        const getUno = localStorage.getItem('uno');
        // if (!gym.programId) return;
        if (gym.programId) {
            console.log('예약 수정: ', page, size, gym);
            //기존예약정보가져오기 (예약 ID로 API 호출하여 데이터 가져옴)
            getGymListByProgramId({ programId: gym.programId })
                .then((data) => {
                    console.log("기존예약데이터:", data)
                }).catch((error) => {
                    console.error("Failed to fetch gym list:", error);
                });
            // 프로그램 ID가 있을 때 참가자 목록 가져오기
            if (gym.programId) {
                fetchRegisteredUsers(gym.programId)
                    .then((users) => {
                        console.log("참가자목록 :", users);
                        setParticipants(users);
                        // 로그인한 사용자가 참가자 목록에 포함되어 있는지 확인
                        setIsParticipant(users.some(user => user.uno === Number(getUno)));
                    })
                    .catch((error) => console.error("Failed to fetch registered users:", error));

                // 대기자 목록 가져오기
                fetchWaitlistUsers(gym.programId)
                    .then((users) => {
                        setWaitlist(users);
                        setIsWaitList(users.some(user => user.uno === Number(getUno)));
                    })
                    .catch((error) => console.error("Failed to fetch waitlist users:", error));
            }

        }
    }
        , [gym.programId, page, size]);

    const handleModify = () => {
        console.log("수정버튼 눌림")
        navigate(`/facilities/gym/detail/modify/${gym.programId}?page=${page}&size=${size}`, { state: { gym } });
    }

    const handleDelete = async () => {
        // const { gym } = location.state || {};
        console.log("전송될 프로그램 ID: ", gym.programId);
        if (gym.programId) {
            try {
                await deletePost(gym.programId);
                alert(`삭제되었습니다.`)
                navigate(`/facilities/gym/list?page=${page}&size=${size}`, { state: { gym } });

            } catch (error) {
                console.log("삭제 요청 중 오류 발생 : ", error)
            }
        }
    };
    const determineButtonState = (gym) => {
        console.log("프로그램 상태 :", gym)
        switch (gym.programState) {
            case 'NOT_STARTED':
                return { text: '접수 전', disabled: true };
            case 'AVAILABLE':
                return { text: '접수중', disabled: false, onClick: () => handleApply(gym) };
            case 'WAITLIST':
                return { text: '대기', disabled: false, onClick: () => handleWaiting(gym) };
            case 'CLOSED':
                return { text: '접수종료', disabled: true };
            default:
                return { text: '', disabled: false };
        }
    }


    // JSX 부분에서 버튼 렌더링
    const buttonState = determineButtonState(gym);


    //참가접수 로직
    const handleApply = async () => {
        const applicationState = getApplicationState(gym);
        const applicationData = {
            uno,
            userName,
            phone,
            programId: gym.programId,
            title: gym.title,
            applicationDate: new Date().toISOString(), // 현재 날짜
            applicationState
        };
        console.log("전송할 신청 데이터:", applicationData);

        // 먼저 확인 창을 띄움
        const confirmed = window.confirm("해당 프로그램을 접수하시겠습니까?");
        if (!confirmed) {
            return; // 사용자가 취소를 선택한 경우 함수 종료
        }

        try {
            // 사용자가 확인을 선택한 경우에만 API 호출
            const response = await applyForProgram(applicationData);
            console.log("응답 코드:", response);

            if (response === "A001") {
                alert('이미 접수된 회원입니다.');
            } else if (response === 'A002') {
                alert(`접수 완료되었습니다.`);
                window.location.reload(); // 접수 후 페이지를 새로고침하여 신청자 명단을 업데이트
            }
        } catch (error) {
            console.error("접수 처리 중 오류 발생: ", error);
            alert('신청에 실패했습니다.');
        }
    };


    //참가 대기자 로직
    const handleWaiting = async () => {
        const applicationState = getApplicationState(gym);
        const waitlistData = {
            uno,
            userName,
            phone,
            programId: gym.programId,
            title: gym.title,
            applicationDate: new Date().toISOString(), // 현재 날짜
            applicationState // 대기자로 등록할 경우 상태
        };
        console.log("전송할 신청 데이터:", waitlistData);
        // 먼저 확인 창을 띄움
        const confirmed = window.confirm("해당 프로그램을 참가대기하시겠습니까?");
        if (!confirmed) {
            return; // 사용자가 취소를 선택한 경우 함수를 종료합니다.
        }

        try {
            const waitlistResponse = await applyForWaitlist(waitlistData);
            console.log("응답 코드:", waitlistResponse);

            if (waitlistResponse === "B000") {
                alert("이미 정식 접수된 회원입니다.");
            } else if (waitlistResponse === "B001") {
                alert("이미 대기자로 등록된 회원입니다.");
            } else if (waitlistResponse === "B002") {
                alert('대기자로 등록되었습니다.');
            } else {
                alert('대기자 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error("대기자 등록 중 오류 발생: ", error);
            alert('대기자 등록에 실패했습니다. ')
        }
    }


    const getApplicationState = (gym) => {
        return gym.currentParticipants < gym.participantLimit ? '접수 완료' : '대기 중';
    };

    //참가취소!!!
    const handleUserCancel = async () => {
        const confirmed = window.confirm("정말 참가를 취소하시겠습니까?");
        if (!confirmed) {
            return;
        }
        try {
            const response = await cancelParticipant(gym.programId, { uno });
            if (response === "C001") {
                alert("참가 취소가 완료되었습니다.")
                window.location.reload()//페이지 새로고침하여 참가자목록 업데이트
            } else if (response === "C002") {
                alert("참가 취소가 완료되었습니다.")
            } else if (response === "C003") {
                alert("참가 취소가 완료되었습니다."); //해당프로그램에 대기자명단이있을시 참가 취소 하고 대기자 명단 참가자로 등록하는 로직임
                window.location.reload(); // 페이지 새로고침
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("참가 취소 중 오류 발생: ", error);
            alert("참가 취소 중 오류가 발생했습니다.");
        }

    };


    //대기 취소 !!!
    const handleWaitingCancel = async () => {
        const confirmed = window.confirm("정말 대기를 취소하시겠습니까?");
        if (!confirmed) {
            return;
        }
        try {
            const response = await cancelWaitlist(gym.programId, { uno });
            if (response === "D001") {
                alert("대기자가 아닙니다.")
                window.location.reload()//페이지 새로고침하여 참가자목록 업데이트
            } else if (response === "D002") {
                alert("대기 취소가 완료되었습니다.")
            }
            // else if (response === "D003") {
            //     alert("대기 취소가 완료되었습니다.");
            //     window.location.reload(); // 페이지 새로고침
            // }
            else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("대기 취소 중 오류 발생: ", error);
            alert("대기 취소 중 오류가 발생했습니다.");
        }

    };

    const formatLocalTimeWithMeridiem = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number); // 시, 분 분리
        const meridiem = hours >= 12 ? '오후' : '오전';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // 12시간제 변환
        return `${meridiem} ${formattedHours}:${minutes.toString().padStart(2, '0')}`;
    };

    const handleBackToList = () => {
        // navigate(`/facilities/gym/list?page=${page}&size=${size}`, { state: { gym } });
        navigate(`/facilities/gym/list?type=${type}&keyword=${keyword}&page=${page}&size=${size}`, { state: { gym } });
    };


    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg relative">
            {role === 'ADMIN' && (
                <div className="absolute top-4 right-4 flex space-x-2">

                    <button
                        type="button"
                        onClick={handleModify}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        수정
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        삭제
                    </button>

                </div>
            )}
            {/* 프로그램 세부정보 */}

            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-center mb-4">프로그램 세부정보</h2>

                <div className="space-y-4">
                    <p><strong>프로그램 명: </strong> {gym.title}</p>
                    <p><strong>세부내용:</strong> {gym.content}</p>
                    <p><strong>대상: </strong> {gym.target}</p>
                    <p><strong>모집 인원: </strong> {gym.currentParticipants}/{gym.participantLimit}명</p>
                    <p><strong>진행 기간: </strong> {gym.programStartDate} ~ {gym.programEndDate}</p>
                    <p> <strong>진행 시간: </strong>
                        {formatLocalTimeWithMeridiem(gym.programStartTime)} ~ {formatLocalTimeWithMeridiem(gym.programEndTime)}
                    </p>
                    <p><strong>접수 기간:</strong> {gym.applicationStartDate.split('T')[0]} {gym.applicationStartDate.split('T')[1].slice(0, 5)} ~ {gym.applicationEndDate.split('T')[0]} {gym.applicationEndDate.split('T')[1].slice(0, 5)}</p>
                    {/* <p><strong>금액:</strong> {gym.price} (마일리지, 포인트 중에 결정 예정)</p> */}
                </div>
            </div>

            {/* 참가자 및 대기자 명단 */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">참가자 명단</h3>
                <ul className="list-disc pl-5 space-y-2">
                    {participants && participants.length > 0 ? (
                        participants.map((user, index) => (
                            <li key={`participant-${user.uno}-${index}`} className="text-lg">{user.userName} - {user.phone}</li>
                        ))
                    ) : (
                        <li className="text-gray-500">등록된 참가자가 없습니다.</li>
                    )}
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-2">대기자 명단</h3>
                <ul className="list-disc pl-5 space-y-2">
                    {waitlist && waitlist.length > 0 ? (
                        waitlist.map((user, index) => (
                            <li key={`waitlist-${user.uno}-${index}`} className="text-lg">{user.userName} - {user.phone}</li>
                        ))
                    ) : (
                        <li className="text-gray-500">등록된 대기자가 없습니다.</li>
                    )}
                </ul>
            </div>

            {/* 버튼 영역 */}


            <div className="flex justify-center space-x-4 mt-6">

                {/* 메인 버튼 */}
                <button
                    type="button"
                    onClick={buttonState.onClick}
                    disabled={buttonState.disabled}
                    className={`px-6 py-2 ${buttonState.disabled ? 'bg-gray-400' : 'bg-orange-500'} text-white rounded hover:bg-orange-600 transition`}
                >
                    {buttonState.text}
                </button>

                {/* 목록 버튼 */}
                <button
                    type="button"
                    onClick={handleBackToList}
                    className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                    목록
                </button>

                {/* 참가 취소 및 대기 취소 버튼 */}
                {isParticipant && (
                    <button
                        type="button"
                        onClick={handleUserCancel}
                        className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                        참가 취소
                    </button>
                )}
                {isWaitList && (
                    <button
                        type="button"
                        onClick={handleWaitingCancel}
                        className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                        대기 취소
                    </button>
                )}
            </div>
        </div>

    );
}

export default GymProgramDetail