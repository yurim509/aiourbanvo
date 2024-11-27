import React, { useRef, useState } from 'react'
import { postAdd } from '../../api/facilities/gymApi';
import FetchingModal from '../common/FetchingModal';
import { useNavigate } from 'react-router-dom';


const initState = {
  title: "",
  content: "",
  target: "",
  programStartDate: "",
  programEndDate: "",
  programStartTime: "",
  programEndTime: "",
  applicationStartDate: "",
  applicationEndDate: "",
  participantLimit: "",
  price: "",
};

const GymProgramAdd = () => {
  const navigate = useNavigate();
  const [program, setProgram] = useState(initState)
  const uploadRef = useRef()
  const [fetching, setFetching] = useState(false);


  const handleChangeProgram = (e) => {
    const { name, value } = e.target;
    setProgram((prevProgram) => ({ ...prevProgram, [name]: value }));
  };
  const handleClickAdd = async () => {
    const formData = new FormData();
    Object.entries(program).forEach(([key, value]) => {
      formData.append(key, value);
    });
    try {
      const response = await postAdd(formData);
      console.log('Program Added : ', response);
    } catch (error) {
      console.error('Error adding program: ', error)
    }

    navigate(`/facilities/gym/list`);
  };


  return (
    <>
      {fetching ? <FetchingModal /> : <></>}
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        {/* 프로그램 세부정보 제목 */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-semibold">프로그램 세부정보</h2>
        </div>
          {/* 프로그램명 */}
          <div>
            <label className="text-lg font-medium text-gray-700">프로그램 명:</label>
            <input
              type="text"
              name="title"
              value={program.title || ''}
              onChange={handleChangeProgram}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* 세부내용 */}
          <div>
            <label className="text-lg font-medium text-gray-700">세부내용:</label>
            <textarea
              name="content"
              rows="3"
              value={program.content || ''}
              onChange={handleChangeProgram}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* 대상 */}
          <div>
            <label className="text-lg font-medium text-gray-700">대상:</label>
            <textarea
              name="target"
              rows="2"
              value={program.target || ''}
              onChange={handleChangeProgram}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* 모집정원 */}
          <div>
            <label className="text-lg font-medium text-gray-700">모집정원:</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                name="participantLimit"
                value={program.participantLimit || ''}
                onChange={handleChangeProgram}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">명</span>
            </div>
          </div>
  
          {/* 진행기간 */}
          <div>
            <label className="text-lg font-medium text-gray-700">진행기간:</label>
            <div className="flex space-x-4">
              <input
                type="date"
                name="programStartDate"
                value={program.programStartDate || ''}
                onChange={handleChangeProgram}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-lg text-gray-500">~</span>
              <input
                type="date"
                name="programEndDate"
                value={program.programEndDate || ''}
                onChange={handleChangeProgram}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
  
          {/* 진행시간 */}
          <div>
            <label className="text-lg font-medium text-gray-700">진행시간:</label>
            <div className="flex space-x-4">
              <input
                type="time"
                name="programStartTime"
                value={program.programStartTime || ''}
                onChange={handleChangeProgram}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-lg text-gray-500">~</span>
              <input
                type="time"
                name="programEndTime"
                value={program.programEndTime || ''}
                onChange={handleChangeProgram}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
  
          {/* 접수기간 */}
          <div>
            <label className="text-lg font-medium text-gray-700">접수기간:</label>
            <div className="flex space-x-4">
              <input
                type="datetime-local"
                name="applicationStartDate"
                value={program.applicationStartDate || ''}
                onChange={handleChangeProgram}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-lg text-gray-500">~</span>
              <input
                type="datetime-local"
                name="applicationEndDate"
                value={program.applicationEndDate || ''}
                onChange={handleChangeProgram}
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
                value={program.price || ''}
                onChange={handleChangeProgram}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-lg text-gray-500">원</span>
            </div>
          </div> */}
  
     
          {/* 등록하기 버튼 */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleClickAdd}
              className="mt-6 px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              등록하기
            </button>
          </div>
      </div>
    </>
  );
}

export default GymProgramAdd;