import React, { useEffect, useState } from 'react';
import { deleteChecked, get, search } from '../../api/community/communityApi';
import { useNavigate } from 'react-router-dom';
import PageComponent from '../../common/PageComponent';
import CommunityCustom from '../../hook/CommunityCustom';

// 초기 상태 설정
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
    current: 1
};

const BoardListComponents = () => {
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [uno, setUno] = useState(); // 로그인한 사용자 uno
    const [serverData, setServerData] = useState(initState); // 서버 데이터 상태
    const [showModal, setShowModal] = useState(false); // 모달 상태
    const [currentPost, setCurrentPost] = useState(null); // 현재 모달에 표시할 게시물
    const [type, setType] = useState('title'); // 검색 필터 상태
    const [keyword, setKeyword] = useState(''); // 검색어 상태 추가
    const { page, size, moveToList } = CommunityCustom(); // 페이지 이동 훅
    const navigate = useNavigate(); // 페이지 이동 훅
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const getUno = localStorage.getItem('uno');
     
        if (getUno) {
            setUno(Number(getUno));

            
        } else {
            console.log("로그인 정보가 없습니다.");
        }
    }, []);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        console.log(storedRole)
        if (storedRole) {

            setUserRole(storedRole);
        }
    }, [])

    useEffect(() => {
        get({ page, size })
            .then(data => {
                console.log("받은 데이터:", data); // 데이터 로그
                setServerData(data);
                setLoading(false); // 로딩 상태 업데이트
            })
            .catch(err => {
                console.error("Axios 에러", err);
                setError("데이터를 가져오는 데 실패했습니다."); // 에러 상태 설정
                setLoading(false); // 로딩 상태 업데이트
            });
    }, [page, size]);

    const handleDelete = async (pno) => {
        try {
            const result = await deleteChecked(pno, uno,userRole);
            if (result) {
                const updatedList = serverData.dtoList.filter(item => item.pno !== pno);
                setServerData(prevData => ({
                    ...prevData,
                    dtoList: updatedList
                }));
                console.log("삭제 성공");
            }
        } catch {
            console.error("삭제 에러", error);
        }
    };

    const openModal = (post) => {
        setCurrentPost(post);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentPost(null);
    };
    // 검색 입력 변경 핸들러
    const handleSearchInputChange = (e) => {
        setKeyword(e.target.value);
    };
    const handleSearch = async () => {
        // 검색어가 비어있으면 경고창 표시
        if (!keyword.trim()) {
            alert("검색어를 입력해 주세요."); // 경고창
            return; // 검색 실행 중단
        }

        setLoading(true); // 로딩 상태 설정
        try {
            const data = await search({
                type,
                keyword,
                page,
                size,
                category: 'board', // 검색 카테고리
            });

            if (data.dtoList.length === 0) {
                alert("검색 결과가 없습니다."); // 검색 결과가 없을 경우 경고창
            }

            console.log("검색 요청 데이터:", { type, keyword, page, size, category: "board" });
            setServerData(data); // 검색 결과 설정
            console.log("검색 결과:", data);
            setError(null);
        } catch (err) {
            console.error("검색 실패:", err);
            setError("검색 중 문제가 발생했습니다.");
        } finally {
            setLoading(false); // 로딩 상태 해제
        }
    };


    return (
        <div className="max-w-7xl mx-auto mt-8 p-4">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold">자유게시판</h1>

            </header>
            <div className="flex justify-between items-center mb-6">
                {/* 왼쪽 검색 필터 */}
                <div className="flex space-x-4">
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="title">글 제목</option>
                        <option value="content">글 내용</option>
                        <option value="target">작성자</option>
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
                <button
                    onClick={() => { navigate('/communities/board/add'); }}
                    className="bg-blue-500 text-white py-1 px-4 rounded-lg"
                >
                    글쓰기
                </button>
            </div>

            <table className="min-w-full table-auto text-sm text-gray-600 bg-white shadow-lg rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200 text-gray-800">
                        <th className="w-12 py-3 border">번호</th>
                        <th className="w-auto py-3 border">제목</th>
                        <th className="w-20 py-3 border">글쓴이</th>
                        <th className="w-36 py-3 border">작성시간</th>
                        <th className="w-32 py-3 border">수정</th>
                        <th className="w-32 py-3 border">삭제</th>
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="text-center py-4">로딩 중...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="6" className="text-center text-red-600 py-4">{error}</td>
                        </tr>
                    ) : (
                        serverData.dtoList.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="py-3 px-4 border text-center">{item.pno}</td>
                                <td className="py-3 px-4 border">
                                    <button
                                        onClick={() => openModal(item)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {item.title}
                                    </button>
                                </td>
                                <td className="py-3 px-4 border text-center">{item.user?.userName || item.userName || '알 수 없음'}</td>
                                <td className="py-3 px-4 border text-center">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </td>

                                {/* 수정 버튼 */}
                                <td className="py-3 px-4 border text-center">
                                    <button
                                        onClick={() => { navigate(`/communities/board/modify/${item.pno}`); }}
                                        disabled={!(uno === item.userId || userRole === 'ROOT' || userRole === 'ADMIN')}
                                        className={`py-1 px-3 rounded-lg ${!(uno === item.userId || userRole === 'ROOT' || userRole === 'ADMIN')
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-blue-500 text-white'
                                            }`}
                                    >
                                        {!(uno === item.userId || userRole === 'ROOT' || userRole === 'ADMIN') ? '본인확인' : '수정'}
                                    </button>


                                </td>

                                {/* 삭제 버튼 */}
                                <td className="py-3 px-4 border text-center">
                                    <button
                                        onClick={() => { handleDelete(item.pno); }}
                                        disabled={!(uno === item.userId || userRole === 'ROOT' || userRole === 'ADMIN')}
                                        className={`py-1 px-3 rounded-lg ${!(uno === item.userId || userRole === 'ROOT' || userRole === 'ADMIN')
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-red-500 text-white'
                                            }`}
                                    >
                                        {!(uno === item.userId || userRole === 'ROOT' || userRole === 'ADMIN') ? '본인확인' : '삭제'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div>
                <PageComponent serverData={serverData} movePage={moveToList} />
            </div>

            {/* 모달 */}
            {showModal && currentPost && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full md:w-1/2 bg-gray-200 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">게시물 상세</h2>
                        <table className="min-w-full text-sm text-gray-600 bg-white shadow-md rounded-lg mb-4">
                            <tbody>
                                <tr>
                                    <td className="py-3 px-4 border">번호</td>
                                    <td className="py-3 px-4 border text-center">{currentPost.pno}</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 border">제목</td>
                                    <td className="py-3 px-4 border text-center">{currentPost.title}</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 border">글쓴이</td>
                                    <td className="py-3 px-4 border text-center">{currentPost.userName}</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 border">작성일</td>
                                    <td className="py-3 px-4 border text-center">
                                        {new Date(currentPost.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="border p-4 bg-gray-100 text-gray-700">
                            <h3 className="font-semibold">내용</h3>
                            <p>{currentPost.content}</p>
                        </div>
                        <div className="text-right mt-4">
                            <button
                                onClick={closeModal}
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BoardListComponents;
