import React, { useEffect, useState } from 'react'
import { cancelParticipant, cancelWaitlist, myPageGymMembership, myPageGymReservations, myPageGymWaitlist } from '../../api/facilities/gymApi';
import { useLocation } from 'react-router-dom';
import GymProgramState from './GymProgramState';

const GymMyList = ({ uno, page, size }) => {

    const location = useLocation();
    const { gym } = location.state || { title: '', content: '', target: '', participantLimit: 0, programId: null, currentParticipants: 0, applicationStartDate: '', applicationEndDate: '', price: 0 };
   
    const [isParticipant, setIsParticipant] = useState(true);
    const [isWaitList, setIsWaitList] = useState(true);
    const [gymMembership, setGymMembership] = useState({
        dtoList: [],
        pageNumList: [],
        prev: false,
        next: false,
        totalCount: 0,
        current: 0
    })
    const [gymReservations, setGymReservations] = useState({
        dtoList: [],
        pageNumList: [],
        prev: false,
        next: false,
        totalCount: 0,
        current: 0
    });
    const [gymWaitlists, setGymWaitlists] = useState({
        dtoList: [],
        pageNumList: [],
        prev: false,
        next: false,
        totalCount: 0,
        current: 0
    });
//   const applicationEndDate = gym.applicationEndDate;
//     const currentDate = new Date(); // 현재 날짜
//     const isAfterProgramEndDate = currentDate > new Date({ applicationEndDate }); // 접수 종료일 이후인지 체크

    useEffect(() => {
        const fetchGymReservations = async () => {

            if (!uno) return;
            try {
                //참가프로그램 조회
                const gymData = await myPageGymReservations(uno, page, size);
                setGymReservations(gymData);
                 //대기프로그램 조회
                 const gymWaitData = await myPageGymWaitlist(uno, page, size);
                 setGymWaitlists(gymWaitData);
                //결제 한 이용권 조회
                const gymMembershipData = await myPageGymMembership(uno, page, size);
                setGymMembership(gymMembershipData);
            } catch (err) {
                console.error('멤버십 및 예약 정보를 가져오는 데 실패했습니다:', err);
            }
        };
        fetchGymReservations();
    }, [uno, page, size]);

    const today = new Date().setHours(0, 0, 0, 0); // 오늘 날짜의 시간 제거
    const membershipState = (endDate) =>
        new Date(endDate).setHours(0, 0, 0, 0) >= today ? "이용중" : "이용만료";

    //참가취소!!!
    const handleUserCancel = async (programId) => {
        const confirmed = window.confirm("정말 참가를 취소하시겠습니까?");
        if (!confirmed) {
            return;
        }
        try {
            const response = await cancelParticipant(programId, { uno });
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
    const handleWaitingCancel = async (programId) => {
        const confirmed = window.confirm("정말 대기를 취소하시겠습니까?");
        if (!confirmed) {
            return;
        }
        try {
            const response = await cancelWaitlist(programId, { uno });
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


    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">나의 이용권 </h2>
            <div className="grid grid-cols-7 gap-4 font-semibold text-sm text-gray-700 bg-gray-100 p-2 rounded-lg">
                <div>NO</div>
                <div>이용권 종류</div>
                <div>시작일</div>
                <div>종료일</div>
                <div>이용권 상태</div>

            </div>
            <div className="overflow-y-auto max-h-13">
                {gymMembership.data && gymMembership.data.length > 0 ? (
                    gymMembership.data.map((membership) => (
                        <div key={membership.membershipId} className="grid grid-cols-7 gap-4 items-center border-t py-4">
                            <div className="text-sm">{membership.membershipId}</div>
                            <div className="text-sm">{membership.membershipType}</div>
                            <div className="text-sm">{membership.startDate}</div>
                            <div className="text-sm">{membership.endDate}</div>
                            <div> {membershipState(membership.endDate)}</div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 col-span-7">예약 정보가 없습니다.</div>
                )}
            </div>

            <div>
            {/* 참가신청 내역 */}
            <GymProgramState
                reservations={gymReservations.data}
                isParticipant={isParticipant}
                handleCancel={handleUserCancel}
                listTitle="참가신청 내역"
            />
            
            {/* 대기신청 내역 */}
            <GymProgramState
                reservations={gymWaitlists.data}
                isParticipant={isWaitList}
                handleCancel={handleWaitingCancel}
                listTitle="대기신청 내역"
            />
        </div>



        </div>
    );
}

export default GymMyList