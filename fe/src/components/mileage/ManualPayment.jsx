import { useEffect, useRef, useState } from "react";
import { formatNumber, apiCall ,getParsedItem } from "../api/utils";




const ManualPayment = ({ sendMileage, setMoney }) => {
    const [selectPrice, setSelectPrice] = useState(0);
    const cardNumberRef = [useRef(), useRef(), useRef(), useRef()];
    const cvcRef = useRef();

    const [mileage, setMileage] = useState({});

    useEffect(() => {
        if (sendMileage) {
            setMileage(sendMileage);
        }
    }, [])

    const changePayment = (e) => {
        const value = parseInt(e.target.value, 10);
        setSelectPrice(value);
    }
    console.log('selectPrice', selectPrice);

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


        if (!dong || !ho) {
            alert(`동과 호수 정보가 누락되었습니다. 설정을 확인해 주세요.`)
            return;
        }

        const pass = cardNumberRef.every(ref => ref.current && ref.current.value.length === 4);
        if (!pass) {
            alert('카드번호를 제대로 입력해 주세요');
            return;
        }

        if (selectPrice === 0) {
            alert('금액을 선택해주세요.');
            return;
        }
        const cvc = cvcRef.current.value;
        // CVC 유효성 검사
        if (!cvc || cvc.length <= 2) {
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
                autopay: mileage.autopay,
                state: true,

            },
            paymentAmount: selectPrice
        };

        try {
            // apiCall을 사용하여 서버로 결제 요청을 보냄
            const response = await apiCall("/mileage/manualpayment", "POST", paymentData);
            if (response.status === 200) {
                alert("결제가 완료되었습니다!");
                if (response.data != null && !isNaN(response.data.price)) {
                    setMoney(Number(response.data.price));
                    setSelectPrice(0);
                    setMileage(response.data);
                    clearCardInput();
                }
            } else {
                alert("결제에 실패했습니다.");
            }
        } catch (error) {
            console.error("결제 요청 오류:", error);
            alert("결제 중 오류가 발생했습니다.");
        }

    }

    return (
        <div className="manualPayment">

            <p>
                1. 결제 금액 선택하기
            </p>
            <div className="paymentRadio">
                <input type="radio" name="payment" id="10000" value={10000}
                    onChange={changePayment}
                    checked={selectPrice === 10000}
                    hidden />
                <input type="radio" name="payment" id="30000" value={30000}
                    onChange={changePayment}
                    checked={selectPrice === 30000}
                    hidden />
                <input type="radio" name="payment" id="50000" value={50000}
                    onChange={changePayment}
                    checked={selectPrice === 50000}
                    hidden />
                <label htmlFor="10000">{formatNumber(10000)}원</label>
                <label htmlFor="30000">{formatNumber(30000)}원</label>
                <label htmlFor="50000">{formatNumber(50000)}원</label>
            </div>

            <p>
                2. 결제 수단 입력하기
            </p>
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
                    결제하기
                </button>
            </div>

        </div>
    )
}

export default ManualPayment;