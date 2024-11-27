import { useState, useEffect } from 'react';
import { listGolf } from '../../api/facilities/golfApi';

const useGolfReservations = (page, size, uno) => {
    const [reservations, setReservations] = useState({
        dtoList: [],
        pageNumList: [],
        prev: false,
        next: false,
        totalCount: 0,
        current: 0
    });
    const [checked, setChecked] = useState([]);
    const [selectedReservationId, setSelectedReservationId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchReservations = async () => {
        if (!uno) return; // uno 값이 없으면 API 호출을 중단
        try {
            const data = await listGolf({ page, size });
            setReservations(data);
        } catch (err) {
            console.error('예약 데이터를 가져오는 데 실패했습니다:', err);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [page, size, uno]);

    const handleCheckChange = (reservationId) => {
        setChecked((prevChecked) => {
            const isChecked = prevChecked.includes(reservationId);
            return isChecked
                ? prevChecked.filter(item => item !== reservationId)
                : [...prevChecked, reservationId];
        });
    };

    const handleModify = (reservationId) => {
        setSelectedReservationId(reservationId);
        setIsModalOpen(true);
    };

    return {
        reservations,
        fetchReservations,
        checked,
        handleCheckChange,
        isModalOpen,
        selectedReservationId,
        setIsModalOpen,
        handleModify
    };
};

export default useGolfReservations;
