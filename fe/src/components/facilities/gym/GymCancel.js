// import React from 'react'
// import { cancelParticipant, cancelWaitlist } from '../../api/facilities/gymApi';

// export const handleWaitingCancel = async () => {
//     const confirmed = window.confirm("정말 대기를 취소하시겠습니까?");
//     if (!confirmed) {
//         return;
//     }
//     try {
//         const response = await cancelWaitlist(gym.programId, { uno });
//         if (response === "D001") {
//             alert("대기자가 아닙니다.")
//             window.location.reload()//페이지 새로고침하여 참가자목록 업데이트
//         } else if (response === "D002") {
//             alert("대기 취소가 완료되었습니다.")
//         }
//         // else if (response === "D003") {
//         //     alert("대기 취소가 완료되었습니다.");
//         //     window.location.reload(); // 페이지 새로고침
//         // }
//         else {
//             alert("알 수 없는 오류가 발생했습니다.");
//         }
//     } catch (error) {
//         console.error("대기 취소 중 오류 발생: ", error);
//         alert("대기 취소 중 오류가 발생했습니다.");
//     }

// };

// export const handleUserCancel = async () => {
//     const confirmed = window.confirm("정말 참가를 취소하시겠습니까?");
//     if (!confirmed) {
//         return;
//     }
//     try {
//         const response = await cancelParticipant(gym.programId, { uno });
//         if (response === "C001") {
//             alert("참가 취소가 완료되었습니다.")
//             window.location.reload()//페이지 새로고침하여 참가자목록 업데이트
//         } else if (response === "C002") {
//             alert("참가 취소가 완료되었습니다.")
//         } else if (response === "C003") {
//             alert("참가 취소가 완료되었습니다."); //해당프로그램에 대기자명단이있을시 참가 취소 하고 대기자 명단 참가자로 등록하는 로직임
//             window.location.reload(); // 페이지 새로고침
//         } else {
//             alert("알 수 없는 오류가 발생했습니다.");
//         }
//     } catch (error) {
//         console.error("참가 취소 중 오류 발생: ", error);
//         alert("참가 취소 중 오류가 발생했습니다.");
//     }

// }; 