import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityCustom from '../../hook/CommunityCustom';
import { post } from '../../api/community/announceApi';

const AnnounceAddComponents = () => {
  const initState = {
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: null,
    prev: false,
    next: false,
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 1,
  };

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uno, setUno] = useState(); // 로그인한 사용자 uno
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [serverData, setServerData] = useState(initState); // 페이지네이션 데이터
  const { page, size, moveToList } = CommunityCustom();
  const navigate = useNavigate(); // 페이지 이동 훅

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = { title, content }; // uno를 포함하지 않음
      await post(postData, uno); // uno를 쿼리 파라미터로 전달
      setTitle('');
      setContent('');
      window.alert('성공!');
      navigate('/communities/announce/list'); // 업데이트 후 목록 페이지로 이동
    } catch (err) {
      console.error('게시물 등록 실패:', err);
    }
  };

  useEffect(() => {
    const getUno = localStorage.getItem('uno');
    if (getUno) {
      setUno(Number(getUno));
    } else {
      console.log('로그인 정보가 없습니다.');
    }
  }, []);

  return (
    <div className="flex justify-center items-center  bg-gray-100"> {/* Centering */}
      <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-200 p-8 rounded-lg shadow-lg"> {/* Increased size */}
        <h2 className="text-2xl font-semibold mb-4 text-center">공지사항 작성</h2> {/* Centered title */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="게시물 내용을 작성하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[250px]" // Increased height
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnnounceAddComponents;
