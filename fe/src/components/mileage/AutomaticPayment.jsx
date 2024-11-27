import { useEffect, useRef, useState } from "react";
import { apiCall, getParsedItem } from "../api/utils";


const AutomaticPayment = ({ sendMileage, isAutopay, setIsAutopay }) => {
    const cardNumberRef = [useRef(), useRef(), useRef(), useRef()];
    const cvcRef = useRef();
    const [mileage, setMileage] = useState({}); // 상위에서 받은 Mileage정보
    useEffect(() => {
        setMileage(sendMileage);
        //카드 정보 조회 및 마일리지 조회
    }, []);





    const changeCard = (e, index) => {
        const { value } = e.target;

        if (!/^\d*$/.test(value)) {
            e.target.value = value.replace(/\D/g, ''); // 숫자 외 문자를 제거
            alert('숫자로 알맞게 입력하세요.');
            return;
        }
        if (value.length === 4) {
            if (index === cardNumberRef.length - 1) {
                cvcRef.current.focus();
            } else {
                cardNumberRef[index + 1].current.focus();
            }
        }
    }
    console.log('cardNumberRef 상태:', cardNumberRef.map((ref) => ref.current?.value || ''));
    console.log('cvcRef', cvcRef.current);
    const changeCvc = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 3) {
            // 숫자만 입력되도록 제한하고 최대 3자리로 제한
            cvcRef.current.value = value;
        } else {
            alert('숫자로 알맞게 입력하세요.');
        }

    };
    // 카드 번호와 CVC 초기화 함수
    const clearCardInput = () => {
        cardNumberRef.forEach(ref => {
            if (ref.current) ref.current.value = "";
        });
        if (cvcRef.current) cvcRef.current.value = "";
    };
    const setPayment = async () => {

        const dong = getParsedItem("dong");
        const ho = getParsedItem("ho");

        // 필수 정보 검증
        if (!dong || !ho) {
            alert("동과 호수 정보가 누락되었습니다. 설정을 확인해 주세요.");
            return;
        }
        const pass = cardNumberRef.every(ref => ref.current && ref.current.value.length === 4);
        if (!pass) {
            alert('카드번호를 제대로 입력해 주세요');
            return;
        }

        const cvc = cvcRef.current.value;
        // CVC 유효성 검사
        if (!cvc || cvc.length < 3) {
            alert('CVC를 제대로 입력해 주세요');
            return;
        }

        const cardNumber = cardNumberRef.map(ref => ref.current.value).join("");

        const paymentData = {
            card: {
                uno: localStorage.getItem("uno"),
                encryptedCardNumber: cardNumber,
                cardExpiry: cvc,
            },
            mileage: {
                mileageId: mileage.mileageId ? mileage.mileageId : null,
                dong: dong,
                ho: ho,
                autopay: true,
                state: true,
            },

        };
        try {
            // apiCall을 사용하여 서버로 결제 요청을 보냄
            const response = await apiCall(`/mileage/autopay`, "PUT", paymentData);
            if (response.status === 200) {
                alert("자동 결제가 등록되었습니다!");
                clearCardInput();
                setMileage(response.data);
                setIsAutopay(response.data.autopay);
            }
        } catch (error) {
            console.error("결제 요청 오류:", error);
            alert("자동 결제가 등록되지 못했습니다");
        }

    }
    console.log(`mileage`, mileage);

    const fatchAutofalse = async () => {
        const dong = getParsedItem("dong");
        const ho = getParsedItem("ho");

        // 필수 정보 검증
        if (!dong || !ho) {
            alert("동과 호수 정보가 누락되었습니다. 설정을 확인해 주세요.");
            return;
        }

        const paymentData = {
            mileageId: mileage.mileageId ? mileage.mileageId : null,
            dong: dong,
            ho: ho,
            autopay: false,
            state: true,
        };
        try {
            // apiCall을 사용하여 서버로 결제 요청을 보냄
            const response = await apiCall(`/mileage/autopay`, "PATCH", paymentData);
            if (response.status === 200) {
                alert("자동 결제 시스템이 해지되었습니다.");
                setMileage(response.data);
                setIsAutopay(response.data.autopay);
            }
        } catch (error) {
            console.error("자동 결제 해지 오류:", error);
            alert("자동 결제 해지에 실패했습니다.");
        }
    }

    return (
        <div className="automaticPayment">
            {!isAutopay ?
                <>
                    <p>자동 결제 등록하기</p>
                    <div className="paymentGrid">
                        <span> 카드 번호</span>
                        <label htmlFor="cvc">CVC</label>
                        <div class="cardInput">
                            {cardNumberRef.map((num, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    ref={num}
                                    onChange={(e) => changeCard(e, index)}
                                    maxLength="4"

                                />
                            ))}
                        </div>
                        <div className="cvcInput">
                            <input
                                id="cvc"
                                type="password"
                                ref={cvcRef}
                                onChange={changeCvc}
                                maxLength="3"
                            />
                        </div>
                    </div>
                    <div className="paymentButtonContainer">
                        <button onClick={setPayment} className="paymentButton">
                            카드 등록하기
                        </button>
                    </div>
                </> :
                <>
                    <p> 자동 충전 시스템을 해지하시겠습니까?</p>
                    <div className="paymentButtonContainer">
                        <button onClick={fatchAutofalse} className="paymentButton">
                            해지하기
                        </button>
                    </div>
                </>}

        </div>
    )
}

export default AutomaticPayment;