import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getGymListByProgramId, modifyPost } from '../../api/facilities/gymApi';
import useCustom from '../../hook/useCustom';

const GymModify = () => {
  const [formData, setFormData] = useState({
    content: '',
    target: '',
    programStartDate: '',
    programEndDate: '',
    programStartTime: '',
    programEndTime: '',
    applicationStartDate: '',
    applicationEndDate: '',
    participantLimit: '',
    price: '',

  });
  const { programId } = useParams();
  const navigate = useNavigate();
  const { page, size } = useCustom()
  //URL 쿼리에서 page와 size가져오기




  useEffect(() => {
    if (programId) {
      console.log('programId', programId)
      getGymListByProgramId({ programId })
        .then((data) => {
          setFormData({
            title: data.title,
            content: data.content || '',
            target: data.target || '',
            programStartDate: data.programStartDate || '',
            programEndDate: data.programEndDate || '',
            programStartTime: data.programStartTime || '',
            programEndTime: data.programEndTime || '',
            applicationStartDate: data.applicationStartDate || '',
            applicationEndDate: data.applicationEndDate || '',
            participantLimit: data.participantLimit || '',
            price: data.price || '',

          })
        })
        .catch((error) => {
          console.error("Error fetching program: ", error);
          alert('Failed to load program data.')
        })
    }
  }, [programId])

  const handleModify = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('예약 id : ', programId)
    console.log('수정 id', programId, formData)
    try {
      await modifyPost(programId, formData);
      alert('프로그램이 수정되었습니다.');
      navigate(`/facilities/gym/detail/${programId}?page=${page}&size=${size}`, { state: { gym: { programId, ...formData } } });
    } catch (error) {
      console.error('수정중 오류발생', error)
      alert('오류발생함')
    }
  }

  

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* 프로그램 세부정보 제목 */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-semibold">프로그램 세부정보</h2>
      </div>
  
      {/* 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 프로그램 명 */}
        <div>
          <label className="text-lg font-medium text-gray-700">프로그램 명:</label>
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleModify}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        {/* 세부내용 */}
        <div>
          <label className="text-lg font-medium text-gray-700">세부내용:</label>
          <input
            type="text"
            name="content"
            value={formData.content || ''}
            onChange={handleModify}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        {/* 대상 */}
        <div>
          <label className="text-lg font-medium text-gray-700">대상:</label>
          <input
            type="text"
            name="target"
            value={formData.target || ''}
            onChange={handleModify}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        {/* 모집정원 */}
        <div>
          <label className="text-lg font-medium text-gray-700">모집정원:</label>
          <input
            type="number"
            name="participantLimit"
            value={formData.participantLimit || ''}
            onChange={handleModify}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-500">명</span>
        </div>
  
        {/* 진행 기간 */}
        <div>
          <label className="text-lg font-medium text-gray-700">진행 기간:</label>
          <div className="flex space-x-4">
            <input
              type="date"
              name="programStartDate"
              value={formData.programStartDate || ''}
              onChange={handleModify}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-lg text-gray-500">~</span>
            <input
              type="date"
              name="programEndDate"
              value={formData.programEndDate || ''}
              onChange={handleModify}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        {/* 진행 시간 */}
        <div>
          <label className="text-lg font-medium text-gray-700">진행 시간:</label>
          <div className="flex space-x-4">
            <input
              type="time"
              name="programStartTime"
              value={formData.programStartTime || ''}
              onChange={handleModify}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-lg text-gray-500">~</span>
            <input
              type="time"
              name="programEndTime"
              value={formData.programEndTime || ''}
              onChange={handleModify}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        {/* 접수 기간 */}
        <div>
          <label className="text-lg font-medium text-gray-700">접수 기간:</label>
          <div className="flex space-x-4">
            <input
              type="datetime-local"
              name="applicationStartDate"
              value={formData.applicationStartDate || ''}
              onChange={handleModify}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-lg text-gray-500">~</span>
            <input
              type="datetime-local"
              name="applicationEndDate"
              value={formData.applicationEndDate || ''}
              onChange={handleModify}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        {/* 금액
        <div>
          <label className="text-lg font-medium text-gray-700">금액 (마일리지, 포인트 중에 결정):</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="price"
              value={formData.price || ''}
              onChange={handleModify}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-lg text-gray-500">원</span>
          </div>
        </div> */}
  
        {/* 저장 버튼 */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-6 px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
}


export default GymModify