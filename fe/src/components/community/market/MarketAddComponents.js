import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityCustom from '../../hook/CommunityCustom';
import { post } from '../../api/community/marketApi';

const MarketAddComponents = () => {
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

  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uno, setUno] = useState(); // 로그인한 사용자 uno
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [serverData, setServerData] = useState(initState); // 페이지네이션 데이터
  const { page, size, moveToList } = CommunityCustom();
  const navigate = useNavigate(); // 페이지 이동 훅
  const [images, setImages] = useState([]); // 이미지 파일 상태
  const [thumbnail, setThumbnail] = useState(null); // 썸네일 파일 상태
  const [previewImages, setPreviewImages] = useState([]); // 이미지 미리보기 상태
  const [thumbnailPreview, setThumbnailPreview] = useState(null); // 썸네일 미리보기 상태

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('uno', uno); // userId를 'uno'로 설정
    formData.append('title', title);
    formData.append('content', content);
    formData.append('price', price);

    if (thumbnail) formData.append('thumbnail', thumbnail);
    images.forEach((image) => {
      formData.append('images', image); // 여러 장의 이미지를 'images'로 설정
    });

    try {
      const result = await post(formData); // post 함수 호출
      window.alert('상품 등록 성공!'); // 성공 메시지
      navigate('/communities/market/list'); // 목록 페이지로 이동
    } catch (err) {
      console.error('게시물 등록 실패:', err);
      window.alert('상품 등록에 실패했습니다.'); // 오류 메시지
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files); // 파일 리스트를 배열로 변환
    setImages(files); // 상태 업데이트

    const readers = files.map(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result]); // 이미지 미리보기 설정
      };
      reader.readAsDataURL(file); // 이미지 파일을 Data URL로 변환
      return reader;
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result); // 썸네일 미리보기 설정
      };
      reader.readAsDataURL(file); // 썸네일 파일을 Data URL로 변환
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
    <div className="flex justify-center items-center bg-gray-100">
      <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-200 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">상품 등록</h2>
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
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[250px]"
          />
          <input
            type="number"
            placeholder="가격"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">썸네일 이미지 선택</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {thumbnailPreview && (
              <img src={thumbnailPreview} alt="Thumbnail Preview" className="rounded-lg w-full h-24 object-cover mt-2" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">이미지 선택 (여러 장)</label>
            <input
              type="file"
              accept="image/*"
              multiple // 여러 이미지 선택 가능
              onChange={handleImagesChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-wrap mt-4">
              {previewImages.map((imgSrc, index) => (
                <img key={index} src={imgSrc} alt={`Preview ${index + 1}`} className="rounded-lg w-1/4 h-24 object-cover mr-2" />
              ))}
            </div>
          </div>

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

export default MarketAddComponents;
