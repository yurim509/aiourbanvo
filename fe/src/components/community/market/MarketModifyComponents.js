import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CommunityCustom from '../../hook/CommunityCustom';
import { getModify, update } from '../../api/community/marketApi'; // 수정 API 가져오기

const MarketModifyComponents = () => {
  const { mno } = useParams(); // 수정할 게시글의 ID
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [uno, setUno] = useState(); // 로그인한 사용자 uno
  const [thumbnail, setThumbnail] = useState(null); // 썸네일 파일 상태
  const [images, setImages] = useState([]); // 새 이미지 파일 상태
  const [previewImages, setPreviewImages] = useState([]); // 새 이미지 미리보기 상태
  const [thumbnailPreview, setThumbnailPreview] = useState(null); // 썸네일 미리보기 상태
  const [existingImages, setExistingImages] = useState([]); // 기존 이미지 상태
  const { moveToList } = CommunityCustom();
  const navigate = useNavigate(); // 페이지 이동 훅

  useEffect(() => {
    const getUno = localStorage.getItem('uno');
    if (getUno) {
      setUno(Number(getUno));
    } else {
      console.log("로그인 정보가 없습니다.");
    }
  }, []);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await getModify(mno);
        if (response) {
          const { title, content, price, thumbnail, imageUrls } = response; // 필요한 데이터 구조 해체
          setTitle(title);
          setContent(content);
          setPrice(price);
          setThumbnailPreview(thumbnail ? `http://localhost:8080${thumbnail}` : null); // 썸네일 미리보기 설정
          setExistingImages(imageUrls.map(url => `http://localhost:8080${url}`)); // 기존 이미지 URL 설정
        } else {
          console.error("No data found");
        }
      } catch (err) {
        console.error("Failed to fetch post data", err);
        window.alert("게시물 데이터를 가져오는 데 실패했습니다."); // 사용자에게 알림
      }
    };

    fetchPostData(); // 함수 호출
  }, [mno]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = { title, content, price };
      const response = await update(updateData, mno, uno, thumbnail, images);

      if (response) {
        window.alert("업데이트 성공!");
        navigate("/communities/market/list");
      } else {
        console.log("업데이트 실패:", response);
      }
    } catch (err) {
      console.error("업데이트 에러", err.response ? err.response.data : err);
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const readers = files.map(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
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
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-200 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">상품 수정</h2>
        <form className="space-y-4" onSubmit={handleUpdate}>
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

          {/* 썸네일 선택 및 미리보기 */}
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

          {/* 새 이미지 선택 및 미리보기 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">새 이미지 선택 (여러 장)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-wrap mt-4">
              {previewImages.map((imgSrc, index) => (
                <img key={index} src={imgSrc} alt={`New Preview ${index + 1}`} className="rounded-lg w-1/4 h-24 object-cover mr-2" />
              ))}
            </div>
          </div>

          {/* 기존 이미지 미리보기 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">기존 이미지</label>
            <div className="flex flex-wrap mt-4">
              {existingImages.map((imgSrc, index) => (
                <img key={index} src={imgSrc} alt={`Existing Preview ${index + 1}`} className="rounded-lg w-1/4 h-24 object-cover mr-2" />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            수정하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarketModifyComponents;
