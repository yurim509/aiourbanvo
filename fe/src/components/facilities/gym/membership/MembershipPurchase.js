import React, { useEffect, useState } from 'react';
import { deleteGymMembership, fetchAllMembershipPlans, purchaseMembership } from '../../../api/facilities/gymApi';
// import { apiCall, formatNumber } from '../../../api/utils';
import useMileage from '../../../hook/useCustomMileage';

const MembershipPurchase = () => {
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState('');
  // const [money, setMoney] = useState();
  // const [mileageId, setMileageId] = useState(null);
  const { money, mileageId } = useMileage();
  // const [uno, setUno] = useState(); // 예시로 사용자 uno 설정

  const role = localStorage.getItem("role");
  const uno = localStorage.getItem("uno");
  // const dong = localStorage.getItem("dong");
  // const ho = localStorage.getItem("ho");

  //현재 마일리지 &마일리지 아이디 조회 혜미님꺼 참고 



  useEffect(() => {
    // 헬스장 이용권 목록을 가져옵니다.
    const fetchMembershipPlansList = async () => {
      try {
        const plans = await fetchAllMembershipPlans(); // fetchAllMembershipPlans 호출
        setMembershipPlans(plans); // 가져온 데이터를 상태에 설정
      } catch (error) {
        console.error("이용권 목록 가져오기 오류: ", error);
      }
    };
    fetchMembershipPlansList(); // 목록을 가져오기
  }, []);


  const handlePurchase = async () => {
    console.log("1212", selectedPlan)

    const membershipData = {
      uno,
      membershipPlanId: selectedPlan.membershipPlanId,
      membershipType: selectedPlan.membershipType,
      mileageId: mileageId,
      startDate: new Date().toISOString().split('T')[0], // 'YYYY-MM-DD' 형식
      endDate: new Date(new Date().setMonth(new Date().getMonth() + selectedPlan.durationMonths)).toISOString().split('T')[0],
    };


    console.log("구매 요청 데이터:", membershipData);
    try {
      // purchaseMembership 함수 호출
      const result = await purchaseMembership(membershipData); // API 호출
      console.log("구매 완료 결과:", result);
    
      // result를 기준으로 조건 처리 (M001, M002, M003)
      if (result === "M001") {
        setMessage('구매가 완료되었습니다!');
      } else if (result === "M002") {
        setMessage('이미 유효한 이용권이 존재합니다. 이용권이 만료된 후에 다시 시도해 주세요.');
      } else if (result === "M003") {
        setMessage('마일리지가 부족합니다. 충전 후 이용해주세요.');
      }
    
    } catch (error) {
      // 오류 발생 시 처리
      console.error("구매 요청 중 오류:", error);
      
      // 각 오류 코드에 맞는 메시지 설정
      if (error.response?.data === "M002") {
        setMessage("이미 유효한 이용권이 존재합니다. 이용권이 만료된 후에 다시 시도해 주세요");
        // alert("이미 유효한 이용권이 존재합니다. 이용권이 만료된 후에 다시 시도해 주세요");
      } else if (error.response?.data === "M003") {
        setMessage("마일리지가 부족합니다. 충전 후 이용해주세요.");
        // alert("마일리지가 부족합니다. 충전 후 이용해주세요.");
      } else {
        setMessage("알 수 없는 오류가 발생했습니다.");
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  }

  //   try {
  //     const result = await purchaseMembership(membershipData); // API 호출
  //     setMessage('구매가 완료되었습니다!');
  //     console.log("구매 완료 결과:", result);
  //   } catch (error) {
  //     if (error.response.data === "M002") {
  //       alert("이미 유효한 이용권이 존재합니다. 이용권이 만료된 후에 다시 시도해 주세요");
  //     }
  //     setMessage('마일리지가 부족합니다. 충전 후 이용해주세요.');
  //     console.error("구매 요청 중 오류:", error);
  //   }
  // };


  const handleDelete = async (planId) => {
    console.log("삭제버튼눌렸다 삭제될 이용권id:", planId, membershipPlans)
    const isConfirmed = window.confirm("해당 이용권을 삭제하시겠습니까?");
    if (!isConfirmed) {
      return; // 사용자가 취소하면 삭제를 하지 않음
    }

    try {
      // 이용권 삭제 요청
      await deleteGymMembership(planId);
      // 목록에서 삭제된 이용권 제거
      setMembershipPlans(prevPlans => prevPlans.filter(plan => plan.membershipPlanId !== planId));
      // 성공 메시지
      setMessage('이용권이 삭제되었습니다.');
    } catch (error) {
      console.error("이용권 삭제 오류: ", error);
      setMessage('삭제 중 오류가 발생 했습니다.');
    }
  };

  //종료 날짜 계산 (오늘 날짜 기준)
  const calculateEndDate = (durationMonths) => {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationMonths);
    return endDate.toLocaleDateString(); // 날짜를 YYYY/MM/DD 형식으로 반환
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">헬스장 이용권 구매</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">이용권 목록</h2>
        {membershipPlans.length === 0 ? (
          <p className="text-gray-500">등록된 이용권이 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {membershipPlans.map((plan) => (
              <li
                key={plan.membershipPlanId}
                className={`p-4 border rounded cursor-pointer ${selectedPlan?.membershipPlanId === plan.membershipPlanId ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
                  }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium text-lg">{plan.membershipType}</p>
                  {/* {isAdmin && ( */}
                  {role === 'ADMIN' && (
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation(); // 클릭 이벤트 전파 방지
                        handleDelete(plan.membershipPlanId); // 이용권 삭제
                      }}
                    >
                      삭제
                    </button>
                  )}
                </div>
                {/* <p className="font-medium text-lg">{plan.membershipType}</p> */}
                <p className="text-sm text-gray-600">{plan.durationMonths}개월</p>
                <p className="text-sm text-gray-600">{plan.price.toLocaleString()}원</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedPlan && (

        <div className="mb-6">
          <div className="balance" style={{ textAlign: 'center' }}>

            현재 잔액 : <span style={{ color: 'red', fontWeight: 'bold' }}>
              {money.toLocaleString()}
            </span> 원<br />
            구매 후 잔액: <span style={{ color: 'red', fontWeight: 'bold' }}>
              {(money - selectedPlan.price).toLocaleString()}
            </span> 원
          </div>
          <h3 className="text-xl font-semibold mb-3">선택된 이용권</h3>
          <div className="p-4 border rounded bg-gray-50">
            <p className="font-medium text-lg">{selectedPlan.membershipType}</p>
            <p className="text-sm text-gray-600">{selectedPlan.durationMonths}개월</p>
            <p className="text-sm text-gray-600">{selectedPlan.price.toLocaleString()}원</p>
            <p className="text-sm text-gray-600">
              이용 종료일: {new Date().toISOString().split('T')[0]} ~ {calculateEndDate(selectedPlan.durationMonths)}
            </p>
            {/* <p className="text-sm text-gray-600">
              이용 종료일: {calculateStartDate()} ~ {calculateEndDate(selectedPlan.durationMonths)}
            </p> */}
          </div>
          <button
            onClick={handlePurchase}
            className="mt-4 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
          >
            구매하기
          </button>
        </div>
      )}

      {message && <p className="text-center text-green-600 font-medium">{message}</p>}
    </div>
  );
};

export default MembershipPurchase;
