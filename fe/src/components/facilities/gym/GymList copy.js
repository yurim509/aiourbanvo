import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCustom from '../../hook/useCustom';
import PageComponent from '../../common/PageComponent';
import { listGym, searchListGym } from '../../api/facilities/gymApi';

const GymList = ({ page, size }) => {
  const navigate = useNavigate();
  const [serverData, setServerData] = useState({ dtoList: [], totalPage: 0 });
  const [type, setType] = useState('title');
  const [keyword, setKeyword] = useState('');
  const [searchParams, setSearchParams] = useState({ type: '', keyword: '' }); // 검색 시에만 적용될 상태
  const { moveToList } = useCustom();
  const role = localStorage.getItem("role");
  const urlWithKeyword =`type=${searchParams.type}&keyword=${searchParams.keyword}`
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
      const data = await searchListGym({ page, size }, searchParams.type, searchParams.keyword);
      console.log("검색결과를 확인합니다:", data);
      if (data.error) throw new Error(data.error);
      setServerData(data);
      if (Array.isArray(data.dtoList)) {
        return data.dtoList.length;
      } else {
        return 0;
      }
      // return data.length //검색결과의 개수를 반환
    } catch (err) {
      console.error("데이터를 가져오는데 오류가 발생했습니다 => ", err);
      alert("프로그램 정보를 가져오는 데 오류가 발생했습니다. 다시 시도해주세요 ");
      return 0;
    }
  };

  useEffect(() => {
    if (searchParams.keyword) {
      fetchGymListSearch();
    } else {
      fetchGymProgramList();
    }
  }, [page, size, searchParams]);

  const handleProgramClick = (gym) => {
    navigate(`/facilities/gym/detail/${gym.programId}?${urlWithKeyword}&page=${page}&size=${size}`, { state: { gym } });
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
  const handleSearch = async(e) => {
    console.log("검색 버튼이 클릭되었습니다.");
    const resultCount = await fetchGymListSearch();
    if (resultCount === 0) {
      alert("검색 결과가 없습니다 😓")
    } else {
      setSearchParams({ type, keyword });
      // fetchGymListSearch();
      navigate(`/facilities/gym/list?type=${type}&keyword=${keyword}&page=1&size=${size}`);
      
    }
  };

  const handlePageChange = (pageParam) => {
    const newUrl = `/facilities/gym/list?${urlWithKeyword}&page=${pageParam}&size=${size}`;
    moveToList(pageParam, newUrl);
  }


  return (
    <div>
      <h2>프로그램 신청 목록</h2>

      <div>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="title">프로그램 제목</option>
          <option value="content">내용</option>
          <option value="target">대상</option>
          <option value="titleAndContent">제목+내용</option>
        </select>

        <input
          type="text"
          value={keyword}
          onChange={handleSearchInputChange}
          placeholder='검색어를 입력해 주세요'
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>

            <th style={{ border: '1px solid black', padding: '10px' }}>no</th>
            <th style={{ border: '1px solid black', padding: '10px' }}>프로그램</th>
            <th style={{ border: '1px solid black', padding: '10px' }}>모집현황</th>
            <th style={{ border: '1px solid black', padding: '10px' }}>접수 버튼</th>
          </tr>

        </thead>
        <tbody>
          {serverData.dtoList.map((gym) => (
            <tr key={gym.programId}>
              <td style={{ border: '1px solid black', padding: '10px' }}>{gym.programId}</td>
              <td style={{ border: '1px solid black', padding: '10px' }} onClick={() => handleProgramClick(gym)}>
                <h1 style={{ cursor: 'pointer' }}>{gym.title}</h1>
                <p>{gym.content}</p>
                <p>프로그램 진행 기간 : {gym.programStartDate}~{gym.programEndDate}</p>
              </td>
              <td style={{ border: '1px solid black', padding: '10px' }}>{gym.currentParticipants}/{gym.participantLimit}</td>
              <td style={{ border: '1px solid black', padding: '10px' }}>
                {determineButtonState(gym)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {role === 'ADMIN' && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => navigate('/facilities/gym/add')}>프로그램 등록</button>
        </div>
      )}
      {serverData.dtoList.length > 0 && (
        <PageComponent
          serverData={serverData}
          // movePage={(pageParam) => moveToList(pageParam, '/facilities/gym/list')}
          movePage={handlePageChange}
        />
      )}
    </div>
  );
};

export default GymList;