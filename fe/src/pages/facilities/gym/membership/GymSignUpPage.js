// import React, { useCallback, useState } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import './membership.css'; // CSS 파일을 추가하여 스타일 적용

// const GymSignUpPage = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState(''); // 클릭한 버튼에 따라 활성화 상태 관리

//   const handleDayPassClick = useCallback(() => {
//     setActiveTab('day-pass'); // 일일권 클릭 시 activeTab을 'day-pass'로 설정
//     navigate('/facilities/gym/signup/day-pass');  // 절대 경로로 이동
//   }, [navigate]);

//   const handleMembershipClick = useCallback(() => {
//     setActiveTab('membership'); // 회원권 클릭 시 activeTab을 'membership'으로 설정
//     navigate('/facilities/gym/signup/membership');  // 절대 경로로 이동
//   }, [navigate]); 
  
//   const handleAdminCreateMembership= useCallback(() => {
//     setActiveTab('membership'); // 회원권 클릭 시 activeTab을 'membership'으로 설정
//     navigate('/facilities/gym/signup/create');  // 절대 경로로 이동
//   }, [navigate]);

//   return (
//     <div>
    
//       <ul className="button-list">
//         {/* 일일권 버튼 */}
//         <li 
//           className={`button-item ${activeTab === 'day-pass' ? 'active' : ''}`} 
//           onClick={handleDayPassClick}
//         >
//           일일권 구매
//         </li>
//         {/* 회원권 버튼 */}
//         <li 
//           className={`button-item ${activeTab === 'membership' ? 'active' : ''}`} 
//           onClick={handleMembershipClick}
//         >
//           회원권 구매
//         </li>
//         <li 
//           className={`button-item` } 
//           onClick={handleAdminCreateMembership}
//         >
//           입주민 회원권 생성
//         </li>
//       </ul>
//       {/* <Outlet />를 통해 하위 컴포넌트를 렌더링 */}
//       <Outlet />
//     </div>
//   );
// };

// export default GymSignUpPage;
