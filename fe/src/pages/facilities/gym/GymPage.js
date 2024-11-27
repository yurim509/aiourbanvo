import React, { useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const GymPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null); // 호버된 버튼 상태 관리
  const role = localStorage.getItem("role");

  const navigate = useNavigate();

  const handleClickList = useCallback(() => {
    navigate("/facilities/gym/list");
  }, [navigate]);
  const handleClickReserve = useCallback(() => {
    navigate("/facilities/gym/membership");
  }, [navigate]);
  const handleClickMyPage = useCallback(() => {
    navigate(`/myPage/facilities/gym`);
  }, [navigate]);
  const handleClickCreate = useCallback(() => {
    navigate("/facilities/gym/membership/create");
  }, [navigate]);

  // 버튼 스타일 설정 함수
  const getButtonStyle = (index) => ({
    width: hoveredIndex === index ? "230px" : "150px",
    height: hoveredIndex === index ? "200px" : "200px",
    borderRadius: "10%",
    background: "skyblue",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: hoveredIndex === index ? "200px" : "150px",
    boxShadow: hoveredIndex === index ? "0 8px 12px rgba(0, 0, 0, 0.2)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.4s ease",
    cursor: "pointer",
    zIndex: hoveredIndex === index ? 10 : 1,
  });

  return (
    <div>
      <ul className="flex justify-center space-x-8">
        <li>
          <button
            style={getButtonStyle(0)} // 버튼 스타일 동적으로 적용
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={handleClickList}
          >
            프로그램
          </button>
        </li>
        <li>
          <button
            style={getButtonStyle(1)}
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={handleClickReserve}
          >
            이용권 구매
          </button>
        </li>
        <li>
          <button
            style={getButtonStyle(2)}
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={handleClickMyPage}
          >
            나의신청내역
          </button>
        </li>
        {role === "ADMIN" && (
          <li>
            <button
              style={getButtonStyle(3)}
              onMouseEnter={() => setHoveredIndex(3)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={handleClickCreate}
            >
              이용권 등록
            </button>
          </li>
        )}
      </ul>
      <h1>Gym Facilities</h1>
      <Outlet />
    </div>
  );
};

export default GymPage;
