import React, { useEffect, useState } from 'react'
import GolfList from './GolfList'
import { listGolf, modifyGolf, getUserGolfById } from '../../api/facilities/golfApi'
import useFormFields from '../../hook/facilities/useFormFields'
import './GolfDetailModifyModal.css';
import useCustom from '../../hook/useCustom';
import { useParams, useSearchParams } from 'react-router-dom';
import { collapseToast } from 'react-toastify';
import GolfCancel, { handleSingleCancel } from './GolfCancel';

const GolfDetailModifyModal = ({ reservationId, closeModal, refreshList }) => {

    // const [userName, setUserName] = useState(); // 로그인한 사용자 name
    // useEffect(() => {
    //     const getUserName = localStorage.getItem('userName');
    //     if (getUserName) setUserName(getUserName);
    // }, [])
    
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        teeBox: '',
    });

    //URL 쿼리에서 page와 size가져오기
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || 1;// page가 없을 경우 기본값 1 설정
    const size = searchParams.get('size') || 10; // size가 없을 경우 기본값 10 설정



    useEffect(() => {
        if (reservationId) {
            console.log('예약 수정: ', page, size, reservationId);
            //기존예약정보가져오기 (예약 ID로 API 호출하여 데이터 가져옴)
            getUserGolfById({ uno: reservationId, page, size })
                .then((data) => {
                    setFormData({
                        date: data.date,
                        startTime: data.startTime,
                        endTime: data.endTime,
                        teeBox: data.teeBox,
                    });

                }).catch((error) => {
                    console.error("예약정보를 불러오는 중 오류발생 : ", error);
                    alert('예약 정보를불러오는 중 오류가 발생했습니다. ')
                });
        }
    }, [reservationId, page, size]);

    const handleModify = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleDelete = async () => {
        await handleSingleCancel(reservationId, refreshList);
        closeModal();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('예약 id', reservationId)
        console.log('수정 id', formData)
        try {
            //수정 api호출
            await modifyGolf(reservationId, formData);
            alert('예약이 변경되었습니다 😃');
            refreshList();
            closeModal();
        } catch (error) {
            console.error('예약변경 중 오류 발생: ', error);
            alert('해당 시간대에 이미 예약된 좌석입니다. 다른 시간대를 선택해 주세요 😥');

        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">예약 수정</h2>
                
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="form-group">
                        <label className="form-label">날짜</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date || ''}
                            onChange={handleModify}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">시작 시간</label>
                        <input
                            type="time"
                            name="startTime"
                            value={formData.startTime || ''}
                            onChange={handleModify}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">종료 시간</label>
                        <input
                            type="time"
                            name="endTime"
                            value={formData.endTime || ''}
                            onChange={handleModify}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">예약 구역</label>
                        <input
                            type="number"
                            name="teeBox"
                            value={formData.teeBox || ''}
                            onChange={handleModify}
                            required
                            className="form-input"
                            min="1"        // 최소값 1
                            max="10"       // 최대값 10
                        />
                    </div>

                    <div className="modal-buttons">
                        <button type="submit" className="btn-save">저장</button>
                        <button type="button" onClick={handleDelete} className="btn-delete">삭제</button>
                        <button type="button" onClick={closeModal} className="btn-cancel">취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GolfDetailModifyModal