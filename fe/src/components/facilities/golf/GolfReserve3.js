import React, { useEffect, useState } from 'react'
import { listGolf, reserveGolf } from '../../api/facilities/golfApi';
import loadLoginData from '../../hook/useCustomLogin'
import { useNavigate } from 'react-router-dom';
import useFormFields from '../../hook/facilities/useFormFields';

const GolfReserve = () => {
    const [uno, setUno] = useState()
    const navigate = useNavigate()
    const [formData, handleFieldChange] = useFormFields({
        date: '',
        startTime: '',
        endTime: '',
        teeBox: '',
    });

    useEffect(() => {
        const getUno = localStorage.getItem('uno');
        if (getUno) {
            setUno(Number(getUno));
            console.log("불렸다 UNO : " + getUno)

        } else {
            console.log("로그인 정보가 없습니다.");
        }
    }, []);
    const validateReservation = (data) => {
        const selectedDate = new Date(data.date);
        const today = new Date();
        console.log("today:", today, "selectedDate", selectedDate)

        if (selectedDate < today.setHours(0, 0, 0, 0)) {
            alert("선택하신 날짜는 오늘 이후여야 합니다.");
            return false;
        }

        const startTime = new Date(`${data.date}T${data.startTime}`);
        const endTime = new Date(`${data.date}T${data.endTime}`);
        if (startTime >= endTime) {
            alert("시작 시간은 종료 시간보다 이전이어야 합니다.");
            return false;
        }

        if (selectedDate.toDateString() === today.toDateString() && startTime <= today) {
            alert("예약 시작 시간은 현재 시간 이후여야 합니다.");
            return false;
        }

        return true;
    };

    const handleReserve = async () => {
        if (!formData.date || !formData.startTime || !formData.endTime || !formData.teeBox) {
            alert('모든 필드를 채워 주세요.');
            return;
        }

        const reservationData = {
            uno,
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            delFlag: false,
            teeBox: parseInt(formData.teeBox),
        };
        console.log(reservationData)


        if (!validateReservation(reservationData)) {
            return;//유효하지 않으면 중단
        }

        try {
            await reserveGolf(reservationData);
            alert('예약에 성공하셨습니다 😃');
            navigate('/facilities/golf/list')
        } catch (error) {
            console.error("error발생 :", error);
            alert('해당 시간대에 이미 예약된 좌석입니다. 다른 시간대를 선택해 주세요 😥 ')

        }
    };
   

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto flex">

            <h2 className="text-2xl font-bold text-center mb-6">Reserve Golf</h2>


            {/* 예약폼  */}
            <div className="flex-1 pl-10">
                <h2 className="text-2xl font-bold text-center mb-6">골프 예약</h2>

                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">예약 날짜</label>
                    <input
                        type="date"
                        name="date"
                        placeholder="예약날짜"
                        value={formData.date}
                        onChange={handleFieldChange}
                        className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">사용 시작 시간</label>
                    <input
                        type="time"
                        name="startTime"
                        placeholder="사용시작시간"
                        value={formData.startTime}
                        onChange={handleFieldChange}
                        className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">사용 종료 시간</label>
                    <input
                        type="time"
                        name="endTime"
                        placeholder="사용종료시간"
                        value={formData.endTime}
                        onChange={handleFieldChange}
                        className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                </div>

                {/* 예약구역 선택 */}
                <div className="mb-4">
                    <label htmlFor="teeBox" className="block text-sm font-medium text-gray-700">예약 구역</label>
                    <select
                        id="teeBox"
                        name="teeBox"
                        value={formData.teeBox}
                        onChange={handleFieldChange}
                        className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                        <option value="">구역을 선택하세요</option>
                        {Array.from({ length: 10 }, (_, index) => (
                            <option key={index + 1} value={index + 1}>
                                {index + 1}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 예약 버튼 */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleReserve}
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                    >
                        예약하기
                    </button>
                </div>
            </div>

        </div>
    );
};

export default GolfReserve