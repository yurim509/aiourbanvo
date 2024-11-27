import React, { useEffect, useState } from 'react'
import { reserveGolf } from '../../api/facilities/golfApi';
import { useNavigate } from 'react-router-dom';

const GolfReserve = () => {
    const [uno, setUno] = useState()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        teeBox: '',
    });

    const handleFieldChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    // const [formData, handleFieldChange] = useFormFields({
    //     date: '',
    //     startTime: '',
    //     endTime: '',
    //     teeBox: '',
    // });
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [
        "/images/g1.png",
        "/images/g2.png",
        "/images/g3.png",
    ];

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

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    }

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };



    const handleTeeBoxClick = (teeBoxNumber) => {
        setFormData({
            ...formData,
            teeBox: teeBoxNumber,
        });
    };



    return (
        <div className="flex justify-between p-10 bg-white rounded-lg shadow-lg w-full">
            {/* 왼쪽 여백 10% */}
            <div className="w-1/5" />

            {/* 예약 폼 30% */}
            <div className="w-5/10 pl-4 pr-4">
                <h2 className="text-2xl font-bold text-center mb-6">골프장 예약하기</h2>

                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">예약 날짜</label>
                    <input
                        type="date"
                        name="date"
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
                        value={formData.endTime}
                        onChange={handleFieldChange}
                        className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                </div>

                {/* 예약 구역 선택 */}
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

                {/* 예약 구역 선택 (이미지 맵) */}
                <div className="mb-4">
                    <label htmlFor="teeBox" className="block text-sm font-medium text-gray-700">예약 구역</label>
                    <img src="/images/golf.png" useMap="#image-map" alt="Golf course layout" />
                    <map name="image-map">
                        {/* 좌석 영역 */}
                        <area target="" alt="1" title="1" href="#" coords="330,533,526,884" shape="rect" onClick={() => handleTeeBoxClick(1)} />
                        <area target="" alt="2" title="2" href="#" coords="575,533,774,886" shape="rect" onClick={() => handleTeeBoxClick(2)} />
                        <area target="" alt="3" title="3" href="#" coords="813,535,1008,880" shape="rect" onClick={() => handleTeeBoxClick(3)} />
                        <area target="" alt="4" title="4" href="#" coords="1068,535,1263,884" shape="rect" onClick={() => handleTeeBoxClick(4)} />
                        <area target="" alt="5" title="5" href="#" coords="1308,535,1503,882" shape="rect" onClick={() => handleTeeBoxClick(5)} />
                        <area target="" alt="6" title="6" href="#" coords="1548,537,1745,888" shape="rect" onClick={() => handleTeeBoxClick(6)} />
                        <area target="" alt="7" title="7" href="#" coords="262,967,607,1166" shape="rect" onClick={() => handleTeeBoxClick(7)} />
                        <area target="" alt="8" title="8" href="#" coords="1297,967,1658,1166" shape="rect" onClick={() => handleTeeBoxClick(8)} />
                        <area target="" alt="9" title="9" href="#" coords="277,1294,624,1491" shape="rect" onClick={() => handleTeeBoxClick(9)} />
                        <area target="" alt="10" title="10" href="#" coords="1295,1315,1652,1510" shape="rect" onClick={() => handleTeeBoxClick(10)} />
                    </map>
                </div>

                {/* 예약 버튼 */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleReserve}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                        예약하기
                    </button>
                </div>
            </div>

            {/* 오른쪽 이미지 */}
            <div className="w-4/10 ml-8 relative">
                <div className="absolute top-1/2 transform -translate-y-1/2 left-0">
                    <button onClick={handlePrevImage} className="text-white p-2 bg-black bg-opacity-50 rounded-full mb-2">
                        &lt;
                    </button>
                    <button onClick={handleNextImage} className="text-white p-2 bg-black bg-opacity-50 rounded-full mt-2">
                        &gt;
                    </button>
                </div>
                <img
                    src={images[currentImageIndex]}
                    alt="골프장 이미지"
                    className="w-full h-auto object-cover rounded-lg"
                />
            </div>
        </div>
    );
};

export default GolfReserve;