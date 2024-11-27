import React, { useState } from 'react';
import { purchaseMembership } from '../../../api/facilities/gymApi';

const MembershipPurchase = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [currentMileageBalance, setCurrentMileageBalance] = useState(300000);
  const [selectedMileageCost, setSelectedMileageCost] = useState(0);
  const userUno = 53;

  const handleSelectOption = (months, mileageCost,) => {
    setSelectedOption(months); // option 에서 months로 변경
    calculateExpiryDate(months);
    setSelectedMileageCost(mileageCost);
  };

  const handlePurchase = async () => {
    if (currentMileageBalance >= selectedMileageCost) {
      try {
        const membershipData = {
          userUno, // 사용자 고유 ID
          startDate: new Date().toISOString(),  // 현재 날짜 (ISO 형식)
          endDate: expiryDate,    // 계산된 만료일
          membershipType: selectedOption, // 선택한 상품 (예: 1개월, 6개월, 1년 등)
        
        };
        const result = await purchaseMembership(membershipData);
        console.log("구매 응답 데이터: ", result);
        setCurrentMileageBalance(prevBalance => prevBalance - selectedMileageCost);
        alert("구매가 완료되었습니다!");
      } catch (error) {
        console.error("구매 실패: ", error);
        alert("구매 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } else {
      alert("마일리지가 부족합니다. 마일리지 충전 후 사용해 주세요.");
    }
  };

  // const calculateExpiryDate = (months) => {
  //   const today = new Date();
  //   today.setMonth(today.getMonth() + months);
  //   const formattedExpiryDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  //   setExpiryDate(formattedExpiryDate);
  // };
  const calculateExpiryDate = (months) => {
    const today = new Date();
    today.setMonth(today.getMonth() + months);
    const formattedExpiryDate = today.toISOString().split('T')[0]; // "yyyy-MM-dd" 형식
    setExpiryDate(formattedExpiryDate);
  };

  return (
    <div>
      <h1>정기권 구매</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h2>1개월권</h2>
          <button onClick={() => handleSelectOption(1,1, 30000)}>1개월권 선택</button>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h2>6개월권</h2>
          <button onClick={() => handleSelectOption(2,6, 150000)}>6개월권 선택</button>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h2>1년권</h2>
          <button onClick={() => handleSelectOption(3,12, 250000)}>1년권 선택</button>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        {selectedOption ? (
          <>
            <p>선택한 상품: {selectedOption}개월권</p>
            <p>이용 만료일: {expiryDate}</p>
            <p>잔여 마일리지: {currentMileageBalance.toLocaleString()} - {selectedMileageCost.toLocaleString()} = {(currentMileageBalance - selectedMileageCost).toLocaleString()}</p>
          </>
        ) : <p>상품을 선택해 주세요.</p>}
      </div>
      {selectedOption && (
        <button style={{ marginTop: '20px' }} onClick={handlePurchase}>구매하기</button>
      )}
    </div>
  );
}

export default MembershipPurchase;
