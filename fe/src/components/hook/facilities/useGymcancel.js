import { useLocation } from 'react-router-dom';
import { cancelParticipant } from '../../api/facilities/gymApi';

export const useGymcancel = (programId,uno) => {
    const location = useLocation();
    const { gym } = location.state || { title: '', content: '', target: '', participantLimit: 0, programId: null, currentParticipants: 0, applicationStartDate: '', applicationEndDate: '', price: 0 };
    const handleUserCancel = async (programId) => {
        const confirmed = window.confirm("정말 참가를 취소하시겠습니까?");
        if (!confirmed) {
            return;
        }
        try {
            const response = await cancelParticipant(programId, { uno });
            if (response === "C001") {
                alert("참가 취소가 완료되었습니다.");
            } else if (response === "C002") {
                alert("참가 취소가 완료되었습니다.");
            } else if (response === "C003") {
                alert("참가 취소가 완료되었습니다."); // 대기자 명단에서 참가자로 등록 처리
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("참가 취소 중 오류 발생: ", error);
            alert("참가 취소 중 오류가 발생했습니다.");
        }
    };
    return { handleUserCancel };
};
// //대기 취소 !!!
// export const handleWaitingCancel = async (gym, uno) => {
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
