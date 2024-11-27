import React, { useEffect, useState } from 'react'
import { createGymMembership } from '../../../api/facilities/gymApi';

const AdminCreateMembership = () => {
  // const [membershipPlanName, setMembershipPlanName] = useState('');
  const [durationMonths, setDurationMonths] = useState('');
  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState('');


    // 이용권명 동적 생성
    const membershipPlanName = durationMonths === 0 ? '일일권' : `${durationMonths}개월권`;


  const handleCreateMembership = async () => {
    const membershipData = {
      membershipType: membershipPlanName,
      durationMonths,
      price,
    };
    console.log("101010", membershipData)

    try {
      const result = await createGymMembership(membershipData);
      setMessage('이용권 등록이 완료되었습니다!');
      console.log(result);
    } catch (error) {
      setMessage('이용권 등록 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">헬스장 이용권 등록</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">이용권 기간 (개월)</label>
        <input
          type="number"
          value={durationMonths}
          onChange={(e) => setDurationMonths(Number(e.target.value))}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          placeholder="예: 6 (일일 이용권은 0 입력)"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">이용권명</label>
        <input
          type="text"
          value={membershipPlanName}
          readOnly
          className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">가격 (원)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          placeholder="예: 10000"
        />
      </div>

      <button
        onClick={handleCreateMembership}
        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
      >
        이용권 등록
      </button>

      {message && (
        <p className="mt-4 text-center text-green-600 font-medium">{message}</p>
      )}
    </div>
  );
};

export default AdminCreateMembership