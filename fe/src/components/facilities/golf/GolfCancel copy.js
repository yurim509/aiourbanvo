import React from 'react'
import { cancelGolf } from '../../api/facilities/golfApi';

//체크된 예약 삭제 로직
export const handleCheckedCancel = async (checkedReservationId) => {
    console.log("전송될 예약 ID: ", checkedReservationId);
    
    if (checkedReservationId.length > 0) {
        try {
            await cancelGolf(checkedReservationId)
            alert(`삭제된 예약 아이디 : ${checkedReservationId.join(",")}`)
            // await fetchGolfReservations(); 
            window.location.reload();
            // fetchGolfReservations();

        } catch (error) {
            console.log("삭제 요청 중 오류 발생 : ", error);
        }
    } else {
        alert("선택된 항목이 없습니다.")
    }

};
//항목 단일 삭제 로직
export const handleSingleCancel = async (reservationId, fetchGolfReservations) => {
    console.log("전송될 예약 ID: ", reservationId);
    if (reservationId) {
        try {
            await cancelGolf([reservationId]);
            alert(`삭제되었습니다.`)
            fetchGolfReservations();
        } catch (error) {
            console.log("삭제 요청 중 오류 발생 : ", error)
        }
    } else {
        alert("예약 ID를 입력하세요.");
    }
};

