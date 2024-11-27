import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useCustom from '../../hook/useCustom';
import PageComponent from '../../common/PageComponent';
import { listGym, searchListGym } from '../../api/facilities/gymApi';

const GymList = () => {
  const navigate = useNavigate();
  const [serverData, setServerData] = useState({ dtoList: [], totalPage: 0 });

  const [searchParams] = useSearchParams(); 

  const initialType = searchParams.get('type') || 'title';
  const initialKeyword = searchParams.get('keyword') || '';
  const initialPage = parseInt(searchParams.get('page'), 10) || 1;
  const initialSize = parseInt(searchParams.get('size'), 10) || 10;


  const [type, setType] = useState(initialType);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  const role = localStorage.getItem("role");

  // const { moveToList } = useCustom();
  // const urlWithKeyword =`type=${type}&keyword=${searchParams.keyword}`
  
  
  const fetchGymProgramList = async () => {
    try {
      const data = await listGym({ page, size });
      if (data.error) throw new Error(data.error);
      setServerData(data);
    } catch (err) {
      console.error("데이터를 가져오는데 오류가 발생했습니다 => ", err);
      alert("프로그램 정보를 가져오는 데 오류가 발생했습니다. 다시 시도해주세요 ");
    }
  };


  const fetchGymListSearch = async () => {
    try {
      const data = await searchListGym({ page, size }, type, keyword);
      console.log("검색결과를 확인합니다:", data);
      if (data.error) throw new Error(data.error);
      setServerData(data);
      return data.dtoList.length;  //검색결과의 개수를 반환
    } catch (err) {
      console.error("데이터를 가져오는데 오류가 발생했습니다 => ", err);
      alert("프로그램 정보를 가져오는 데 오류가 발생했습니다. 다시 시도해주세요 ");
      return 0;
    }
  };

  useEffect(() => {
    if (initialKeyword) {
      fetchGymListSearch();
    } else {
      fetchGymProgramList();
    }
  }, [page, size, type]);

  const handleProgramClick = (gym) => {
    // navigate(`/facilities/gym/detail/${gym.programId}?${urlWithKeyword}&page=${page}&size=${size}`, { state: { gym } });
    navigate(`/facilities/gym/detail/${gym.programId}?type=${type}&keyword=${keyword}&page=${page}&size=${size}`, { state: { gym } });
  };

  const determineButtonState = (gym) => {
    switch (gym.programState) {
      case 'NOT_STARTED':
        return <button onClick={() => handleProgramClick(gym)}>접수 전</button>;
      case 'AVAILABLE':
        return <button onClick={() => handleProgramClick(gym)}>접수 중</button>;
      case 'WAITLIST':
        return <button onClick={() => handleProgramClick(gym)}>대기 가능</button>;
      case 'CLOSED':
        return <button onClick={() => handleProgramClick(gym)}>마감</button>;
      default:
        return null;
    }
  };

  const handleSearchInputChange = (e) => {
    setKeyword(e.target.value);
  }
  const handleSearch = async() => {
    console.log("검색 버튼이 클릭되었습니다.");
    const resultCount = await fetchGymListSearch();
    if (resultCount === 0) {
      alert("검색 결과가 없습니다 😓")
    } else {
      const params = new URLSearchParams({ type, keyword, page: 1, size }).toString();
      navigate(`/facilities/gym/list?${params}`);
      setPage(1);

    }
  };

  const handlePageChange = ({ page: newPage }) => {
    const params = new URLSearchParams({ type, keyword, page: newPage, size }).toString();
    navigate(`/facilities/gym/list?${params}`);
    setPage(newPage);
  }


  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* 프로그램 신청 목록 헤더 */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-semibold">프로그램 신청 목록</h2>
      </div>
  
      {/* 검색 필터 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="title">프로그램 제목</option>
            <option value="content">내용</option>
            <option value="target">대상</option>
            <option value="titleAndContent">제목+내용</option>
          </select>
  
          <input
            type="text"
            value={keyword}
            onChange={handleSearchInputChange}
            placeholder="검색어를 입력해 주세요"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
  
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            검색
          </button>
        </div>
      </div>
  
      {/* 프로그램 목록 테이블 */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-left">no</th>
              <th className="border px-4 py-2 text-left">프로그램</th>
              <th className="border px-4 py-2 text-left">모집현황</th>
              <th className="border px-4 py-2 text-left">접수 버튼</th>
            </tr>
          </thead>
          <tbody>
            {serverData.dtoList.map((gym) => (
              <tr key={gym.programId} className="border-b hover:bg-gray-50">
                <td className="border px-4 py-2">{gym.programId}</td>
                <td className="border px-4 py-2">
                  <div className="cursor-pointer" onClick={() => handleProgramClick(gym)}>
                    <h1 className="text-lg font-medium text-blue-600">{gym.title}</h1>
                    <p className="text-sm text-gray-500">{gym.content}</p>
                    <p className="text-xs text-gray-400">프로그램 진행 기간: {gym.programStartDate} ~ {gym.programEndDate}</p>
                  </div>
                </td>
                <td className="border px-4 py-2">{gym.currentParticipants}/{gym.participantLimit}</td>
                <td className="border px-4 py-2">{determineButtonState(gym)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* 관리자만 프로그램 등록 버튼 */}
      {role === 'ADMIN' && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/facilities/gym/add')}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            프로그램 등록
          </button>
        </div>
      )}
  
      {/* 페이지네이션 */}
      {serverData.dtoList.length > 0 && (
        <div className="mt-6 flex justify-center">
          <PageComponent
            serverData={serverData}
            movePage={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default GymList;