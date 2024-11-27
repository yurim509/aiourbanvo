import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyCommunityPosts, deleteChecked as deleteCommunityPost } from '../api/community/communityApi';
import { getMyMarketPosts, deleteChecked as deleteMarketPost } from '../api/community/marketApi';
import { getMyAnnouncePosts, deleteChecked as deleteAnnouncePost } from '../api/community/announceApi';

const MyCommunitiesComponent = () => {
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [myCommunities, setMyCommunities] = useState([]); // 자유게시판 데이터
  const [myMarketPosts, setMyMarketPosts] = useState([]); // 마켓 데이터
  const [myAnnouncePosts, setMyAnnouncePosts] = useState([]); // 공지사항 데이터
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const uno = localStorage.getItem('uno'); // 로그인된 사용자 uno
        if (!uno) throw new Error("로그인 정보가 없습니다.");

        const [communityResponse, marketResponse, announceResponse] = await Promise.all([
          getMyCommunityPosts(uno),
          getMyMarketPosts(uno),
          getMyAnnouncePosts(uno),
        ]);

        setMyCommunities(communityResponse || []);
        setMyMarketPosts(marketResponse || []);
        setMyAnnouncePosts(announceResponse || []);
        setLoading(false);
      } catch (err) {
        console.error("데이터를 불러오는 중 문제가 발생했습니다:", err);
        setError("데이터를 불러오는 중 문제가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const handleDeleteCommunityPost = async (pno) => {
    try {
      await deleteCommunityPost(pno, localStorage.getItem('uno'));
      setMyCommunities((prev) => prev.filter((post) => post.pno !== pno));
    } catch (err) {
      console.error("게시글 삭제 중 오류 발생:", err);
    }
  };

  const handleDeleteMarketPost = async (mno) => {
    try {
      await deleteMarketPost(mno, localStorage.getItem('uno'));
      setMyMarketPosts((prev) => prev.filter((post) => post.mno !== mno));
    } catch (err) {
      console.error("마켓 게시글 삭제 중 오류 발생:", err);
    }
  };

  const handleDeleteAnnouncePost = async (pno) => {
    try {
      await deleteAnnouncePost(pno, localStorage.getItem('uno'));
      setMyAnnouncePosts((prev) => prev.filter((post) => post.pno !== pno));
    } catch (err) {
      console.error("공지사항 게시글 삭제 중 오류 발생:", err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-1 p-4 ">
      <header className="text-center mb-8 ">
        <h1 className="text-3xl font-bold">내가 쓴 글</h1>
        <p className="text-gray-600 ">자유게시판, 공지사항 및 마켓에서 작성한 글</p>
      </header>

      <div className="flex flex-wrap gap-4 ">
        {/* 자유게시판 */}
        <section className="flex-1 bg-white shadow-lg rounded-lg p-4 ">
          <h2 className="text-2xl font-semibold mb-6">자유게시판</h2>
          <table className="min-w-full table-auto text-sm text-gray-600 bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="w-12 py-3 border">번호</th>
                <th className="w-auto py-3 border">제목</th>
                <th className="w-20 py-3 border">작성일</th>
                <th className="w-20 py-3 border">수정</th>
                <th className="w-20 py-3 border">삭제</th>
              </tr>
            </thead>
            <tbody className=''>
              {myCommunities.length > 0 ? (
                myCommunities.map((post) => (
                  <tr key={post.pno} className="hover:bg-gray-100">
                    <td className="py-3 px-4 border text-center">{post.pno}</td>
                    <td className="py-3 px-4 border text-center">{post.title}</td>
                    <td className="py-3 px-4 border text-center">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 border text-center">
                      <button
                        onClick={() => navigate(`/communities/board/modify/${post.pno}`)}
                        className="py-1 px-3 rounded-lg bg-blue-500 text-white"
                      >
                        수정
                      </button>
                    </td>
                    <td className="py-3 px-4 border text-center">
                      <button
                        onClick={() => handleDeleteCommunityPost(post.pno)}
                        className="py-1 px-3 rounded-lg bg-red-500 text-white"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">작성한 글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* 공지사항 */}
        <section className="flex-1 bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-2xl font-semibold mb-6">공지사항</h2>
          <table className="min-w-full table-auto text-sm text-gray-600 bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="w-12 py-3 border">번호</th>
                <th className="w-auto py-3 border">제목</th>
                <th className="w-20 py-3 border">작성일</th>
                <th className="w-20 py-3 border">수정</th>
                <th className="w-20 py-3 border">삭제</th>
              </tr>
            </thead>
            <tbody>
              {myAnnouncePosts.length > 0 ? (
                myAnnouncePosts.map((post) => (
                  <tr key={post.pno} className="hover:bg-gray-100">
                    <td className="py-3 px-4 border text-center">{post.pno}</td>
                    <td className="py-3 px-4 border text-center">{post.title}</td>
                    <td className="py-3 px-4 border text-center">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 border text-center">
                      <button
                        onClick={() => navigate(`/communities/announce/modify/${post.pno}`)}
                        className="py-1 px-3 rounded-lg bg-blue-500 text-white"
                      >
                        수정
                      </button>
                    </td>
                    <td className="py-3 px-4 border text-center">
                      <button
                        onClick={() => handleDeleteAnnouncePost(post.pno)}
                        className="py-1 px-3 rounded-lg bg-red-500 text-white"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">작성한 글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      {/* 마켓 */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">내 마켓 게시글</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myMarketPosts.length > 0 ? (
            myMarketPosts.map((item) => (
              <div
                key={item.mno}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {item.thumbnailUrl ? (
                  <img
                    src={`http://localhost:8080${item.thumbnailUrl}`}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">이미지 없음</p>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">상품명: {item.title}</h2>
                  <p className="text-gray-600">가격: {item.price} 원</p>
                  <div className="flex justify-between mt-2">
                 
                    <button
                      onClick={() => navigate(`/communities/market/modify/${item.mno}`)}
                      className="py-1 px-3 rounded-lg bg-blue-500 text-white"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteMarketPost(item.mno)}
                      className="py-1 px-3 rounded-lg bg-red-500 text-white"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-4">작성한 마켓 게시글이 없습니다.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyCommunitiesComponent;
