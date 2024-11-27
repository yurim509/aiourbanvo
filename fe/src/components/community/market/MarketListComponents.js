import React, { useEffect, useState } from 'react';
import { deleteChecked, get, search } from '../../api/community/marketApi';
import { useNavigate } from 'react-router-dom';
import PageComponent from '../../common/PageComponent';
import CommunityCustom from '../../hook/CommunityCustom';

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

const MarketListComponents = () => {
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
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // 현재 이미지 인덱스 추가
    const [userRole, setUserRole] = useState(null);



    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        console.log(storedRole)
        if (storedRole) {

            setUserRole(storedRole);
        }
    }, [])

    useEffect(() => {
        const getUno = localStorage.getItem('uno');
        if (getUno) {
            setUno(Number(getUno));
        } else {
            console.log("로그인 정보가 없습니다.");
        }
    }, []);

    useEffect(() => {
        get({ page, size })
            .then(data => {
                console.log("serverData:", data.dtoList)
                setServerData(data);
                setLoading(false);
            })
            .catch(err => {
                setError("데이터를 가져오는 데 실패했습니다.");
                setLoading(false);
            });
    }, [page, size]);

    const handleDelete = async (mno) => {
        try {
            const result = await deleteChecked(mno, uno, userRole);
            if (result) {
                const updatedList = serverData.dtoList.filter(item => item.mno !== mno);

                setServerData(prevData => ({
                    ...prevData,
                    dtoList: updatedList
                }));
                alert("삭제성공");
                console.log("삭제 성공");
            }
        } catch {
            console.error("삭제 에러", error);
        }
    };

    const openModal = (post) => {
        setCurrentPost(post);
        setCurrentImageIndex(0); // 모달 열 때 이미지 인덱스를 초기화
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentPost(null);
    };

    const handleNextImage = () => {
        if (currentPost) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % currentPost.imageUrls.length);
        }
    };

    const handlePrevImage = () => {
        if (currentPost) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + currentPost.imageUrls.length) % currentPost.imageUrls.length);
        }
    };
    const handleSearchInputChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await search({
                type,
                keyword,
                page,
                size,
                category: "market",
            });
            console.log("검색 요청 데이터:", { type, keyword, page, size, category: "market" });
            console.log("검색 결과:", data);
            setServerData(data);
            setError(null);
        } catch (err) {
            console.error("검색 실패:", err);
            setError("검색 중 문제가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto mt-8 p-4">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold">마켓 리스트</h1>

            </header>
            {/* 왼쪽 검색 필터 */}
            {/* 검색 필터와 글쓰기 버튼 */}
            <div className="flex items-center justify-between mb-6">
                {/* 왼쪽 검색 필터 */}
                <div className="flex items-center space-x-4">
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

                {/* 오른쪽 글쓰기 버튼 */}
                <button
                    onClick={() =>navigate('/communities/market/add')}
                    className="bg-blue-500 text-white py-1 px-4 rounded-lg"
                >
                    상품등록
                </button>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-3 text-center py-4">로딩 중...</div>
                ) : error ? (
                    <div className="col-span-3 text-center text-red-600 py-4">{error}</div>
                ) : (
                    serverData.dtoList.map((item, index) => (
                        <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            {item.thumbnailUrl ? (
                                <img
                                    src={`http://localhost:8080${item.thumbnailUrl}`} // /uploads/ 경로로 접근
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
                                <p className="text-gray-500">판매자: {item.user?.userName || item.userName || '알 수 없음'}</p>
                                <div className="flex justify-between mt-2">
                                    <button
                                        onClick={() => openModal(item)}
                                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                                    >
                                        상세보기
                                    </button>
                                   
                                        <button
                                            onClick={() => { navigate(`/communities/market/modify/${item.mno}`); }}
                                            disabled={!(userRole === 'ADMIN' || userRole === 'ROOT' || uno === item.userId)}
                                            className={`py-1 px-3 rounded-lg ${!(userRole === 'ADMIN' || userRole === 'ROOT' || uno === item.userId)
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-blue-500 text-white'
                                                }`}
                                        >
                                            {!(userRole === 'ADMIN' || userRole === 'ROOT' || uno === item.userId) ? '권한없음' : '수정'}
                                        </button>
                                    

                                    {/* 삭제 버튼 */}
                             
                                        <button
                                            onClick={() => { handleDelete(item.mno); }}
                                            disabled={!(userRole === 'ADMIN' || userRole === 'ROOT' || uno === item.userId)}
                                            className={`py-1 px-3 rounded-lg ${!(userRole === 'ADMIN' || userRole === 'ROOT' || uno === item.userId)
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-red-500 text-white'
                                                }`}
                                        >
                                            {!(userRole === 'ADMIN' || userRole === 'ROOT' || uno === item.userId) ? '권한없음' : '삭제'}
                                        </button>
                               
                                    {/* <button
                                        onClick={() => { navigate(`/communities/market/chat/${item.mno}`); }}
                                        className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition duration-200"
                                    >
                                        1:1 대화
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div>
         

                <PageComponent serverData={serverData} movePage={moveToList} />
            </div>

            {showModal && currentPost && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-auto bg-gray-200 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">게시물 상세</h2>
                        <table className="min-w-full text-sm text-gray-600 bg-white shadow-md rounded-lg mb-4">
                            <tbody>
                                <tr>
                                    <td className="py-3 px-4 border">번호</td>
                                    <td className="py-3 px-4 border text-center">{currentPost.mno}</td>
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
                        <div className="mt-4">
                            <h3 className="font-semibold">상품 이미지</h3>
                            <div className="flex cursor-pointer relative">
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-1/3"
                                    onClick={() => handlePrevImage()}
                                ></div>
                                <img
                                    src={`http://localhost:8080${currentPost.imageUrls[currentImageIndex]}`}
                                    alt="게시물 이미지"
                                    className="w-auto h-auto rounded-lg"
                                />
                                <div
                                    className="absolute right-0 top-0 bottom-0 w-1/3"
                                    onClick={() => handleNextImage()}                                ></div>
                                <img
                                    src={`http://localhost:8080${currentPost.imageUrls[currentImageIndex]}`}
                                    alt="게시물 이미지"
                                    className="w-auto h-auto rounded-lg"
                                />
                                <div
                                    className="absolute right-0 top-0 bottom-0 w-1/3"
                                    onClick={() => handleNextImage()}
                                ></div>
                            </div>
                        </div>
                        <div className="mt-4 flex overflow-x-auto">
                            {currentPost.imageUrls.map((url, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:8080${url}`}
                                    alt={`썸네일 ${index + 1}`}
                                    className={`w-24 h-24 object-cover rounded-lg cursor-pointer m-1 ${currentImageIndex === index ? 'border-2 border-blue-500' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                        <div className="text-right mt-4">
                            <button
                                onClick={() => {
                                    // 현재 선택된 게시물의 mno를 사용하여 채팅 페이지로 이동
                                    navigate(`/communities/market/chat/${currentPost.mno}`);
                                }}
                                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 ml-2"
                            >
                                1:1 대화
                            </button>

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

export default MarketListComponents;

