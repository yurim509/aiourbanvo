import { useEffect, useState } from "react";
import { apiCall, getParsedItem, formatNumber } from "../api/utils";
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import RenderPagination from "./RenderPagination";


const MyMileagePurchasePage = () => {
    const navi = useNavigate();
    const [paymentList, setPaymentList] = useState([]);
    const [page, setPage] = useState(1);
    const [pageMaker, setPageMaker] = useState({});

    const fistPageRequest = {
        size: 4,
        page: 1,
        ascending: "false",
        sortingColumn: "timestamp",
        keyword: '',
        startDate: '',
        endDate: '',
    };
    const [pageRequest, setPageRequest] = useState(fistPageRequest);

    useEffect(() => {
        callAPI();

    }, [page]);
    const uno = getParsedItem("uno");

    useEffect(() => {

        if (!uno) {
            alert("로그인이 필요합니다.");
            navi("/");
            return;
        }
    }, [uno])


    const callAPI = async () => {
        const dong = getParsedItem("dong");
        const ho = getParsedItem("ho");



        if (dong && ho) {
            const params = {
                uno: uno,
                page: page,
                size: pageRequest.size,
                ascending: pageRequest.ascending,
                sortingColumn: pageRequest.sortingColumn,
                startDate: pageRequest.startDate ? new Date(pageRequest.startDate).toISOString().split('.')[0] : '',
                endDate: pageRequest.endDate ? new Date(pageRequest.endDate).toISOString().split('.')[0] : '',

            };
            console.log('params', params)
            await apiCall('/mileage/getpaylist', 'GET', params)
                .then(response => {
                    console.log(response.data);
                    const { list, pageMaker } = response.data;
                    setPaymentList(list);
                    setPageMaker(pageMaker);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    const sizeArr = [
        {
            name: '2',
            description: '2개씩 보기',
        },
        {
            name: '4',
            description: '4개씩 보기',
        },
        {
            name: '6',
            description: '6개씩 보기',
        },
        {
            name: '8',
            description: '8개씩 보기',
        },
    ]

    const onClickDate = (value) => {
        let start, end;
        switch (value) {
            case '오늘':
                start = moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss');
                end = moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss');
                break;
            case '어제':
                start = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DDTHH:mm:ss');
                end = moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DDTHH:mm:ss');
                break;
            case '일주일':
                end = moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss');
                start = moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DDTHH:mm:ss');
                break;
            case '한달':
                end = moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss');
                start = moment().subtract(1, 'months').startOf('day').format('YYYY-MM-DDTHH:mm:ss');
                break;
            case '전체':
                start = '';
                end = '';
                break;
            default:
                return;
        }

        setPageRequest((it) => ({
            ...it,
            startDate: start,
            endDate: end
        }));
    };
    const onChangeDateInput = (e) => {
        const { name, value } = e.target;
        setPageRequest((it) => ({
            ...it,
            [name]: value
        }));
    };
    const onChaneAsc = (value) => {

        setPageRequest((it) => ({
            ...it, ascending: value
        }))
    }
    const onchangeRequest = (e) => {
        const { name, value } = e.target;
        setPageRequest((it) => ({
            ...it, [name]: value
        }))
    }
    const [searchRequest, setSearchRequest] = useState(false); // 검색 요청 여부를 추적
    const resetPageRequest = () => {
        setPageRequest(fistPageRequest); // 초기 상태로 리셋
        setPage(1);  // 페이지도 초기화
        setSearchRequest(true);
    };
    //console.log(searchRequest);
    useEffect(() => {
        if (searchRequest) {
            callAPI();
            setSearchRequest(false); // 플래그를 다시 false로 설정하여 다음 요청을 방지
        }
    }, [searchRequest])

    console.log("pageRequest", pageRequest)
    return <div>
        <form className="searchgrid" onSubmit={callAPI}>
            <table className="searchMileageBar">
                <tr>
                    <th>기간검색</th>
                    <td className="dateBox">
                        <div>
                            <input type="date" name="startDate" value={pageRequest.startDate}
                                onChange={onChangeDateInput} />
                            ~
                            <input type="date" name="endDate" value={pageRequest.endDate}
                                onChange={onChangeDateInput} />
                        </div>
                        <div>
                            <input type="button" value="전체" onClick={() => onClickDate("전체")} />
                            <input type="button" value="오늘" onClick={() => onClickDate("오늘")} />
                            <input type="button" value="어제" onClick={() => onClickDate("어제")} />
                            <input type="button" value="일주일" onClick={() => onClickDate("일주일")} />
                            <input type="button" value="한달" onClick={() => onClickDate("한달")} />
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>날짜 정렬</th>
                    <td>
                        <label htmlFor="ascending">
                            <input type="radio" id="ascending" name="ascending"
                                value="true" onChange={(e) => onChaneAsc(e.target.value)}
                                checked={pageRequest.ascending == 'true'} />
                            오름 차순</label>
                        <label htmlFor="descending">
                            <input type="radio" id="descending" name="ascending" value="false"
                                checked={pageRequest.ascending == 'false'}
                                onChange={(e) => onChaneAsc(e.target.value)} />
                            내림 차순</label>
                    </td>
                </tr>
                <tr>
                    <th>보기</th>
                    <td>

                        {sizeArr.map((item, index) => (
                            <label key={index} htmlFor={`size_${item.name}`}>
                                <input
                                    type="radio"
                                    name="size"
                                    value={item.name}
                                    id={`size_${item.name}`}
                                    checked={pageRequest.size == item.name}
                                    onChange={(e) => onchangeRequest(e)}
                                />
                                {item.description}
                            </label>
                        ))}
                    </td>
                </tr>

            </table>
            <div className="buttonwrapper">
                <button type="button" onClick={callAPI}>검색</button>
                <button type="button" onClick={resetPageRequest}>초기화</button>

            </div>
        </form>
        {
            paymentList.length === 0 ?
                <div className="mileage-history-list">
                    data 가 없습니다.
                </div> :
                <div className="mileage-history-list">
                    {paymentList.map((item) => (
                        <div key={item.paymentId} className="mileage-card">
                            <div className="mileage-header">
                                <h2 className="mileage-name">{item.userName}</h2>
                                <span className={`mileage-type negative`}>
                                    사용
                                </span>
                            </div>
                            <div className="mileage-details">
                                <p className="mileage-amount">결제 금액: {formatNumber(+item.price)}원</p>
                                <p className="mileage-timestamp">
                                    {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
        }
        <RenderPagination pageMaker={pageMaker} page={page} setPage={setPage} />
    </div>;
};

export default MyMileagePurchasePage;