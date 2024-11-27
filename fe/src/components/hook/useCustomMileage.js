import { useState, useEffect } from 'react';
import { apiCall } from '../api/utils';

const useMileage = () => {
    const [money, setMoney] = useState(0);
    const [mileageId, setMileageId] = useState(null);
    const [isAutopay, setIsAutopay] = useState(false);
    const [cardName, setCardName] = useState('');

    useEffect(() => {
        const dong = localStorage.getItem("dong");
        const ho = localStorage.getItem("ho");
        const uno = localStorage.getItem("uno");

        if (dong && ho) {
            const params = { dong, ho, uno };

            apiCall('/mileage/getmileage', 'GET', params)
                .then(response => {
                    const { mileage, usedCardName } = response.data;
                    setCardName(usedCardName);
                    if (mileage && !isNaN(mileage.price)) {
                        setMoney(Number(mileage.price)); // 숫자로 변환
                        setMileageId(mileage.mileageId);
                        setIsAutopay(mileage.autopay);
                    } else {
                        setMoney(0);
                        setMileageId(null);
                    }
                })
                .catch(error => {
                    console.error(error);
                    setMoney(0); // 오류가 발생한 경우 마일리지 0으로 설정
                    setMileageId(null); 
                });
        } else {
            setMoney(0); // dong이나 ho가 없으면 마일리지 0으로 설정
            setMileageId(null); // 마일리지 ID를 null로 설정
        }
    }, [isAutopay]); // isAutopay 값에 따라 마일리지 정보를 업데이트

    return { money, mileageId, cardName, isAutopay };
};

export default useMileage;
